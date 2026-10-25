import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'vite'
let server, engine, dates, impact
before(async()=>{
  server=await createServer({configFile:'vite.config.ts',server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'})
  engine=await server.ssrLoadModule('/src/decision-centre/scenario/engine.ts')
  dates=(await server.ssrLoadModule('/src/decision-centre/dueDateData.ts')).reportingDates
  impact=(await server.ssrLoadModule('/src/AutomationImpactExplorer.tsx')).automationImpact
})
after(async()=>{await server?.close()})
const view=s=>engine.snapshot(s,s.filters)
const act=(s,a)=>engine.scenarioReducer(s,a)
test('all presets, dates and market filters reconcile scope, execution and evidence',()=>{
  for(const preset of ['On Track','At Risk','Scope Expansion']){
    const s=engine.createScenario(preset)
    assert.equal(new Set(s.cases.map(c=>c.id)).size,s.cases.length)
    assert.equal(new Set(s.defects.map(d=>d.id)).size,s.defects.length)
    for(const defect of s.defects)for(const id of [...defect.caseIds,...defect.blockingDataCaseIds])assert(s.cases.some(c=>c.id===id))
    assert(s.defects.some(d=>d.caseIds.length>1));assert(s.cases.some(c=>s.defects.filter(d=>d.caseIds.includes(c.id)).length>1))
    for(const date of dates)for(const market of ['All markets',...engine.marketContext.map(m=>m.name)]){
      const f={...s.filters,date,market},m=engine.snapshot(s,f),scope=engine.scopeChanges(s,f)
      assert.equal(m.scope,m.passed+m.failed+m.blocked+m.notExecuted)
      assert.equal(m.actual,m.passed+m.failed);assert(m.actual<=m.scope);assert(m.planned<=m.scope)
      assert.equal(m.actual,m.completeEvidence+m.missingEvidence+m.incompleteEvidence)
      assert.equal(m.evidenceCompliance,m.actual?m.completeEvidence/m.actual*100:null)
      assert.equal(m.variance,m.actual-m.planned)
      assert.equal(scope.baseline+scope.added-scope.removed,scope.current)
      for(const c of m.cases){if(c.firstExecutedOn)assert(c.firstExecutedOn<=date);if(!c.firstExecutedOn)assert.equal(c.evidence,'Not yet applicable')}
      assert.equal(m.openDefects,m.defects.filter(d=>d.status!=='Closed').length)
    }
  }
})
test('market and product partitions sum to the same global metrics',()=>{
  const s=engine.createScenario('At Risk'),global=view(s)
  for(const key of ['scope','actual','planned','overdue','completeEvidence','dataBlocked','openDefects']){
    const markets=engine.marketContext.map(m=>engine.snapshot(s,{...s.filters,market:m.name})[key]).reduce((a,b)=>a+b,0)
    const products=engine.products.map(product=>engine.snapshot(s,{...s.filters,product})[key]).reduce((a,b)=>a+b,0)
    assert.equal(markets,global[key],key);assert.equal(products,global[key],key)
  }
})
test('scope additions/removals, shared history and scope reset reconcile; no future addition leaks',()=>{
  let s=engine.createScenario();const original=view(s)
  s=act(s,{type:'add',quantity:25});assert.equal(view(s).scope,original.scope+25);assert.equal(view(s).actual,original.actual)
  assert.equal(engine.snapshot(s,{...s.filters,date:dates[23]}).scope,engine.snapshot(engine.createScenario(),{...s.filters,date:dates[23]}).scope)
  s=act(s,{type:'remove',quantity:10});assert.equal(view(s).scope,original.scope+15)
  const changes=engine.scopeChanges(s,s.filters);assert.equal(changes.baseline+changes.added-changes.removed,view(s).scope)
  s=act(s,{type:'resetScope'});assert.equal(view(s).scope,original.scope)
  s=act(s,{type:'filters',filters:{date:dates[0]}});const first=view(s).scope;s=act(s,{type:'add',quantity:10});assert.equal(view(s).scope,first+10);const opening=engine.scopeChanges(s,s.filters);assert.equal(opening.baseline+opening.added-opening.removed,opening.current)
  for(const quantity of [0,-5,0.1,NaN])assert.equal(act(s,{type:'remove',quantity}),s)
})
test('timing simulation moves first executions, never exceeds eligible scope and respects data readiness',()=>{
  const base=engine.createScenario(),delayed=act(base,{type:'timing',days:5}),fast=act(base,{type:'timing',days:-4})
  assert(view(delayed).actual<=view(base).actual);assert(view(fast).actual>=view(base).actual)
  for(const s of [delayed,fast])for(const date of dates){const m=engine.snapshot(s,{...s.filters,date});assert(m.actual<=m.scope);for(const c of m.cases)if(c.firstExecutedOn){assert(c.firstExecutedOn<=date);const record=s.cases.find(v=>v.id===c.id);assert(c.firstExecutedOn>=record.scopeHistory[0].recordedOn);if(c.requiresData)assert.equal(engine.latest(record.dataHistory,c.firstExecutedOn),'Ready')}}
  const empty={...base,filters:{...base.filters,product:'No such product'}};assert.equal(engine.forecast(empty,empty.filters).date,null)
  const early={...base,filters:{...base.filters,date:dates[1]}};assert.match(engine.forecast(early,early.filters).reason,/Insufficient/)
  const stopped={...base,cases:base.cases.map(c=>({...c,executions:[]}))};assert.equal(engine.forecast(stopped,stopped.filters).date,null);assert.equal(view(stopped).evidenceCompliance,null)
})
test('correcting evidence changes evidence denominator result without changing execution; previous snapshots stay intact',()=>{
  let s=engine.createScenario('At Risk');const m=view(s),c=m.cases.find(c=>c.firstExecutedOn&&c.evidence!=='Complete');assert(c)
  const previous=engine.snapshot(s,{...s.filters,date:dates[23]});s=act(s,{type:'evidence',caseId:c.id,value:'Complete'})
  assert.equal(view(s).actual,m.actual);assert.equal(view(s).completeEvidence,m.completeEvidence+1);assert(view(s).evidenceCompliance>m.evidenceCompliance)
  assert.deepEqual(engine.snapshot(s,{...s.filters,date:dates[23]}),previous)
  const pending=m.cases.find(c=>!c.firstExecutedOn);assert.equal(act(s,{type:'evidence',caseId:pending.id,value:'Complete'}),s)
})
test('test data readiness and explicitly linked defect actions are separate and consistent',()=>{
  let s=engine.createScenario('At Risk');const c=view(s).cases.find(c=>c.requiresData&&!c.firstExecutedOn&&c.data!=='Ready');assert(c)
  const initial=view(s);s=act(s,{type:'openDefect',caseId:c.id,classification:'Test data',severity:'High',dataBlocker:true});const added=s.defects.at(-1)
  assert.equal(view(s).openDefects,initial.openDefects+1);assert.equal(view(s).dataBlocked,initial.dataBlocked)
  s=act(s,{type:'defect',id:added.id,classification:'Training'});assert.equal(view(s).dataBlocked,initial.dataBlocked)
  s=act(s,{type:'data',caseId:c.id,value:'Ready'});assert.equal(view(s).dataBlocked,initial.dataBlocked-1);assert.equal(view(s).actual,initial.actual)
  assert.equal(engine.latest(s.defects.find(d=>d.id===added.id).statuses,s.filters.date),'Awaiting retest')
  const closureBase=engine.createScenario('At Risk');const blocked=view(closureBase).cases.find(c=>c.requiresData&&!c.firstExecutedOn&&c.data!=='Ready');let t=act(closureBase,{type:'openDefect',caseId:blocked.id,classification:'Test data',severity:'High',dataBlocker:true});
  const blockers=t.defects.filter(d=>d.blockingDataCaseIds.includes(blocked.id)&&engine.latest(d.statuses,t.filters.date)!=='Closed');assert(blockers.length)
  for(const d of blockers)t=act(t,{type:'defect',id:d.id,status:'Closed'})
  assert.equal(view(t).cases.find(c=>c.id===blocked.id).data,'Ready')
})
test('closing defects changes shared readiness drivers and edits remain reversible',()=>{
  let s=engine.createScenario('At Risk');const initial=view(s),d=initial.defects.find(d=>d.status!=='Closed'&&(d.severity==='Critical'||d.severity==='High'));assert(d)
  s=act(s,{type:'defect',id:d.id,status:'Closed'});assert.equal(view(s).openDefects,initial.openDefects-1);assert.equal(view(s).openCriticalHigh,initial.openCriticalHigh-1)
  assert.equal(engine.readinessRows(s).find(r=>r.metric==='Open critical / high defects').value,initial.openCriticalHigh-1)
  s=act(s,{type:'undo'});assert.deepEqual(view(s),initial)
  s=act(s,{type:'preset',preset:'Scope Expansion'});assert(view(s).scope>view(engine.createScenario()).scope)
  s=act(s,{type:'reset'});assert.deepEqual(s,engine.createScenario())
})
test('automation assumptions handle normal, zero, negative-savings and setup cases',()=>{
  assert.deepEqual(impact(25,8,1,20),{manual:200,automated:45,saved:155,reduction:77.5})
  assert.equal(impact(0,8,1,20).reduction,null);assert.equal(impact(0,8,1,20).saved,-20)
  assert(impact(1,1,10,20).reduction<0);assert.equal(impact(5,2,2,0).saved,0)
})
test('agreed due dates, first executions, retests and historical revisions use their recorded dates',()=>{
  const base=engine.createScenario();const seed=base.cases.find(c=>c.market==='Canada')
  const record={...seed,id:'UNIT-CASE-A',scopeHistory:[{recordedOn:dates[0],inScope:true},{recordedOn:dates[6],inScope:false}],dueDateHistory:[{agreedOn:dates[0],dueOn:dates[1]},{agreedOn:dates[3],dueOn:dates[8]}],executions:[{recordedOn:dates[2],status:'Failed'},{recordedOn:dates[4],status:'Passed'},{recordedOn:dates[5],status:'Blocked'}],requiresData:true,dataHistory:[{recordedOn:dates[0],value:'Ready'}],evidenceHistory:[{recordedOn:dates[2],value:'Missing'}],executionOffset:0}
  const s={...base,cases:[record],defects:[]};const at=i=>engine.snapshot(s,{...s.filters,date:dates[i]})
  assert.equal(at(1).planned,1);assert.equal(at(1).overdue,1);assert.equal(at(1).actual,0)
  assert.equal(at(2).actual,1);assert.equal(at(2).failed,1);assert.equal(at(2).missingEvidence,1)
  assert.equal(at(3).planned,0);assert.equal(at(2).planned,1)
  assert.equal(at(4).actual,1);assert.equal(at(4).passed,1);assert.equal(at(5).actual,1)
  assert.equal(at(6).scope,0);assert.equal(at(6).actual,0)
})
test('making data ready never creates an execution result on that reporting day',()=>{
  const base=engine.createScenario('At Risk');const seed=base.cases.find(c=>c.market==='Canada')
  const record={...seed,id:'UNIT-DATA',requiresData:true,scopeHistory:[{recordedOn:dates[0],inScope:true}],dueDateHistory:[{agreedOn:dates[0],dueOn:dates[5]}],executions:[{recordedOn:dates[24],status:'Passed'},{recordedOn:dates[27],status:'Passed'}],dataHistory:[{recordedOn:dates[0],value:'Missing'}],evidenceHistory:[],executionOffset:0}
  let s={...base,cases:[record],defects:[]};assert.equal(view(s).actual,0)
  s=act(s,{type:'data',caseId:record.id,value:'Ready'});assert.equal(view(s).dataBlocked,0);assert.equal(view(s).actual,0)
  assert.equal(engine.snapshot(s,{...s.filters,date:dates[27]}).actual,1)
  assert.equal(engine.snapshot(s,{...s.filters,date:dates[23]}).dataBlocked,1)
})
test('closing a resolved data blocker preserves an already recorded execution',()=>{
  const base=engine.createScenario('At Risk'),seed=base.cases.find(c=>c.market==='Canada')
  const record={...seed,id:'UNIT-CLOSE',requiresData:true,scopeHistory:[{recordedOn:dates[0],inScope:true}],executions:[{recordedOn:dates[27],status:'Passed'}],dataHistory:[{recordedOn:dates[0],value:'Missing'}],evidenceHistory:[],executionOffset:0}
  let s={...base,cases:[record],defects:[]};s=act(s,{type:'openDefect',caseId:record.id,classification:'Test data',severity:'High',dataBlocker:true});const id=s.defects[0].id
  s=act(s,{type:'data',caseId:record.id,value:'Ready'});assert.equal(act(s,{type:'data',caseId:record.id,value:'Ready'}),s)
  s=act(s,{type:'filters',filters:{date:dates[28]}});assert.equal(view(s).actual,1)
  s=act(s,{type:'defect',id,status:'Closed'});assert.equal(view(s).actual,1);assert.equal(view(s).cases[0].firstExecutedOn,dates[27])
})
