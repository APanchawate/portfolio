import { demoUatCases, reportingDates, workstreams } from '../dueDateData'
import { classifications, severities } from '../data'
import type { CaseView, DataReadiness, DefectView, Event, Evidence, Filters, Market, Preset, ScenarioAction, ScenarioCase, ScenarioData, ScenarioDefect, ScenarioState } from './types'
export const products = ['Record-to-Report', 'Procure-to-Pay', 'Order-to-Cash', 'Asset Accounting', 'Intercompany', 'Financial Closing'] as const
export const marketContext: { name: Market; codes: number | null; historical: boolean; phase: string }[] = [
  {name:'United States',codes:13,historical:true,phase:'Historical completed UAT'}, {name:'Canada',codes:2,historical:false,phase:'Illustrative UAT execution'}, {name:'China',codes:5,historical:false,phase:'Illustrative stabilization'}, {name:'Benelux',codes:10,historical:false,phase:'Illustrative preparation'}, {name:'Mexico',codes:null,historical:true,phase:'Historical UAT support'},
]
export const defaultFilters: Filters = { market: 'All markets', product: 'All Finance Products', date: reportingDates[24] }
export function addBusinessDays(date: string, days: number) {
  const result = new Date(`${date}T00:00:00Z`); const direction = Math.sign(days)
  for (let remaining=Math.abs(Math.trunc(days));remaining>0;) {result.setUTCDate(result.getUTCDate()+direction);if(result.getUTCDay()!==0&&result.getUTCDay()!==6)remaining--}
  return result.toISOString().slice(0,10)
}
export const daysBetween = (from: string, to: string) => Math.max(0,Math.floor((Date.parse(to)-Date.parse(from))/86400000))
export function latest<T>(events: readonly Event<T>[], date: string, offset=0): T | undefined {
  return events.map((event,index)=>({...event,index,date:event.timingBound?addBusinessDays(event.recordedOn,offset):event.recordedOn})).filter(event=>event.date<=date).sort((a,b)=>a.date.localeCompare(b.date)||a.index-b.index).at(-1)?.value
}
const historical = (market: Market) => marketContext.find(item=>item.name===market)!.historical
const fits = (item: ScenarioCase, filters: Filters) => (filters.market==='All markets'||filters.market===item.market)&&(filters.product==='All Finance Products'||filters.product===item.financeProduct)
const scopeAt = (item: ScenarioCase,date: string) => [...item.scopeHistory].filter(event=>event.recordedOn<=date).at(-1)?.inScope===true
const offsetFor = (item: ScenarioCase) => historical(item.market)?0:item.executionOffset
function caseView(item: ScenarioCase,date: string): CaseView | null {
  if(!scopeAt(item,date))return null
  const offset=offsetFor(item), added=item.scopeHistory[0].recordedOn
  const data=latest(item.dataHistory,date)??'Pending preparation'
  const records=item.executions.map((event,index)=>({...event,index,recordedOn: [added,addBusinessDays(event.recordedOn,offset)].sort().at(-1)!})).filter(event=>event.recordedOn<=date).sort((a,b)=>a.recordedOn.localeCompare(b.recordedOn)||a.index-b.index)
  const gate=latest(item.executionGates??[],date)
  const completed=records.filter(event=>(!gate||event.recordedOn>=gate)&&event.status!=='Blocked'&&(!item.requiresData||latest(item.dataHistory,event.recordedOn)==='Ready'))
  const first=completed[0], last=completed.at(-1)
  const status=last?last.status as 'Passed'|'Failed':data==='Blocked'||records.at(-1)?.status==='Blocked'?'Blocked':'Not executed'
  return {id:item.id,workstream:item.workstream,owner:item.owner,market:item.market,companyCode:item.companyCode,financeProduct:item.financeProduct,tester:item.tester,dueOn:[...item.dueDateHistory].filter(event=>event.agreedOn<=date).at(-1)?.dueOn??null,firstExecutedOn:first?.recordedOn??null,blocked:status==='Blocked',status,evidence:first?(latest(item.evidenceHistory,date,offset)??'Missing'):'Not yet applicable',data,requiresData:item.requiresData,risk:item.risk}
}
export function snapshot(state: ScenarioData, filters: Filters) {
  const cases=state.cases.filter(item=>fits(item,filters)).map(item=>caseView(item,filters.date)).filter((item):item is CaseView=>item!==null)
  const ids=new Set(cases.map(item=>item.id));const executed=cases.filter(item=>item.firstExecutedOn!==null)
  const defects: DefectView[]=state.defects.filter(item=>item.createdOn<=filters.date&&item.caseIds.some(id=>ids.has(id))).map(item=>({id:item.id,caseIds:item.caseIds.filter(id=>ids.has(id)),blockingDataCaseIds:item.blockingDataCaseIds.filter(id=>ids.has(id)),classification:latest(item.classifications,filters.date)!,severity:latest(item.severities,filters.date)!,status:latest(item.statuses,filters.date)!,ageDays:daysBetween(item.createdOn,filters.date),owner:item.owner,markets:[...new Set(item.caseIds.flatMap(id=>cases.find(c=>c.id===id)?.market??[]))],products:[...new Set(item.caseIds.flatMap(id=>cases.find(c=>c.id===id)?.financeProduct??[]))]}))
  const planned=cases.filter(item=>item.dueOn!==null&&item.dueOn<=filters.date).length
  const complete=executed.filter(item=>item.evidence==='Complete').length
  const openDefects=defects.filter(item=>item.status!=='Closed')
  const required=cases.filter(item=>item.requiresData)
  return {date:filters.date,cases,defects,scope:cases.length,planned,actual:executed.length,variance:executed.length-planned,overdue:cases.filter(item=>item.dueOn!==null&&item.dueOn<=filters.date&&!item.firstExecutedOn).length,undated:cases.filter(item=>!item.dueOn).length,passed:cases.filter(item=>item.status==='Passed').length,failed:cases.filter(item=>item.status==='Failed').length,blocked:cases.filter(item=>item.status==='Blocked').length,notExecuted:cases.filter(item=>item.status==='Not executed').length,completeEvidence:complete,missingEvidence:executed.filter(item=>item.evidence==='Missing').length,incompleteEvidence:executed.filter(item=>item.evidence==='Incomplete').length,evidenceCompliance:executed.length?complete/executed.length*100:null,executionCompletion:cases.length?executed.length/cases.length*100:null,dataRequired:required.length,dataReady:required.filter(item=>item.data==='Ready').length,dataBlocked:required.filter(item=>item.data!=='Ready'&&!item.firstExecutedOn).length,openDefects:openDefects.length,openCriticalHigh:openDefects.filter(item=>item.severity==='Critical'||item.severity==='High').length,openTestDataDefects:openDefects.filter(item=>item.classification==='Test data').length}
}
export type ScenarioSnapshot = ReturnType<typeof snapshot>
export function scopeChanges(state: ScenarioData,filters: Filters, since=reportingDates[0]) {
  const relevant=state.cases.filter(item=>fits(item,filters));const baseline=relevant.filter(item=>!item.id.startsWith('SIM-UAT-')&&scopeAt(item,reportingDates[0])).length
  let added=0,removed=0,dueDateRevisions=0
  for(const item of relevant){for(const event of item.scopeHistory)if((event.recordedOn>since||event.recordedOn===reportingDates[0]&&since===reportingDates[0]&&item.id.startsWith('SIM-UAT-'))&&event.recordedOn<=filters.date){if(event.inScope)added++;else removed++}dueDateRevisions+=item.dueDateHistory.slice(1).filter(event=>event.agreedOn>since&&event.agreedOn<=filters.date&&scopeAt(item,event.agreedOn)).length}
  const current=relevant.filter(item=>scopeAt(item,filters.date)).length
  return {baseline,current,added,removed,net:current-baseline,percentage:baseline?(current-baseline)/baseline*100:null,dueDateRevisions}
}
export function forecast(state: ScenarioData, filters: Filters) {
  const current=snapshot(state,filters),remaining=current.scope-current.actual,index=reportingDates.indexOf(filters.date)
  if(!current.scope)return {date:null,reason:'No applicable scope',throughput:0,remaining}
  if(!remaining)return {date:filters.date,reason:'All current in-scope cases executed; acceptance is separate',throughput:0,remaining}
  if(index<4)return {date:null,reason:'Insufficient history: five reporting days required',throughput:0,remaining}
  const start=reportingDates[index-4]
  const recent=current.cases.filter(item=>item.firstExecutedOn&&item.firstExecutedOn>=start&&item.firstExecutedOn<=filters.date).length
  const throughput=recent/5
  return {date:throughput?addBusinessDays(filters.date,Math.ceil(remaining/throughput)):null,reason:throughput?'Constant recent five-day throughput; current scope, no new scope or readiness delays assumed':'No recent throughput; a completion date cannot be estimated',throughput,remaining}
}
function extraCase(id:number,market:Market,product:string,date:string): ScenarioCase {
  return {id:`SIM-UAT-${id}`,market,companyCode:`SYN-${market.slice(0,3).toUpperCase()}-X`,financeProduct:product,workstream:workstreams[products.indexOf(product as typeof products[number])],owner:'Synthetic tester / WS Lead',tester:'Synthetic tester',risk:'Moderate',scopeHistory:[{recordedOn:date,inScope:true}],dueDateHistory:[{agreedOn:date,dueOn:addBusinessDays(date,5+id%5)}],executions:[],executionOffset:0,requiresData:true,dataHistory:[{recordedOn:date,value:'Ready'}],evidenceHistory:[]}
}
export function createScenario(preset: Preset='On Track'):ScenarioState {
  const cases:ScenarioCase[]=demoUatCases.map((item,i)=>{
    const market=i<180?marketContext[i%5].name:marketContext[[1,2,3][i%3]].name
    const isHistorical=historical(market),requiresData=i%7!==1
    const blocked=!isHistorical&&requiresData&&(preset==='At Risk'?i%3===0:i%23===0)
    const data:DataReadiness=blocked?(['Missing','Invalid','Pending preparation','Blocked'] as const)[i%4]:'Ready'
    const records=isHistorical?[{recordedOn:addBusinessDays(reportingDates[0],-5),status:'Passed' as const}]:item.executions
    const first=records.find(event=>event.status!=='Blocked')?.recordedOn??reportingDates[39]
    return {...item,scopeHistory:isHistorical?[{recordedOn:addBusinessDays(reportingDates[0],-10),inScope:true}]:item.scopeHistory,dueDateHistory:isHistorical?[{agreedOn:addBusinessDays(reportingDates[0],-10),dueOn:addBusinessDays(reportingDates[0],-5)}]:item.dueDateHistory,executions:records,market,companyCode:`SYN-${market.slice(0,3).toUpperCase()}-${i%3+1}`,financeProduct:products[i%6],tester:`Synthetic tester ${i%12+1}`,risk:i%4===0?'High':'Moderate',requiresData,dataHistory:[{recordedOn:isHistorical?addBusinessDays(reportingDates[0],-10):reportingDates[0],value:data}],evidenceHistory:[{recordedOn:first,timingBound:true,value:isHistorical?'Complete':preset==='At Risk'?(i%3===0?'Missing':i%3===1?'Incomplete':'Complete'):i%19===0?'Missing':i%31===0?'Incomplete':'Complete'}],executionOffset:isHistorical?0:preset==='At Risk'?4:-2}
  })
  const defects:ScenarioDefect[]=[]
  cases.forEach((item,i)=>{
    if(i%4!==0&&item.dataHistory[0].value==='Ready')return
    const issueData=item.dataHistory[0].value!=='Ready'
    // Some data issues intentionally have no defect: recording a defect is a separate action.
    if(issueData&&i%2)return
    const createdOn=reportingDates[Math.max(0,Math.min(18,2+i%17))]
    const closed=historical(item.market)||!issueData&&preset!=='At Risk'&&i%13!==0
    const related=cases[i+30]
    const caseIds=related&&related.market===item.market&&related.financeProduct===item.financeProduct&&i%12===0?[item.id,related.id]:[item.id]
    const make=(suffix:string)=>({id:`SIM-DEF-${i+1}${suffix}`,caseIds,blockingDataCaseIds:issueData?[item.id]:[],createdOn,owner:'Synthetic Product Team / data owner',classifications:[{recordedOn:createdOn,value:issueData?'Test data' as const:classifications[i%7]}],severities:[{recordedOn:createdOn,value:severities[preset==='At Risk'?i%2:2+i%2]}],statuses:[{recordedOn:createdOn,value:'Open' as const},...(closed?[{recordedOn:addBusinessDays(createdOn,3),value:'Closed' as const}]:[])]})
    defects.push(make(''))
    if(i%19===0)defects.push(make('-B')) // More than one defect may link to a case.
  })
  const result:ScenarioState={cases,defects,nextId:1000,log:[],preset,filters:{...defaultFilters},past:[]}
  if(preset==='Scope Expansion')for(let i=0;i<25;i++)result.cases.push(extraCase(1000+i,'Canada',products[i%6],reportingDates[15]))
  if(preset==='Scope Expansion')result.nextId=1025
  return result
}
const dataOf=(state:ScenarioState):ScenarioData=>({cases:state.cases,defects:state.defects,nextId:state.nextId,log:state.log})
export function scenarioReducer(state:ScenarioState,action:ScenarioAction):ScenarioState {
  if(action.type==='filters')return {...state,filters:{...state.filters,...action.filters}}
  if(action.type==='reset')return createScenario()
  if(action.type==='preset')return {...createScenario(action.preset),filters:{...state.filters}}
  if(action.type==='undo'){const previous=state.past.at(-1);return previous?{...state,...previous,past:state.past.slice(0,-1)}:state}
  const date=state.filters.date, current=snapshot(state,state.filters)
  let cases=state.cases,defects=state.defects,nextId=state.nextId,message=''
  const ids=new Set(current.cases.map(item=>item.id))
  if(action.type==='add'){
    const count=Number.isFinite(action.quantity)?Math.min(100,Math.max(0,Math.trunc(action.quantity))):0;if(!count)return state
    const market=state.filters.market==='All markets'?'Canada':state.filters.market
    cases=[...cases,...Array.from({length:count},(_,i)=>extraCase(nextId+i,market,state.filters.product==='All Finance Products'?products[i%6]:state.filters.product,date))];nextId+=count;message=`Added ${count} synthetic cases on ${date}`
  } else if(action.type==='remove'){
    const count=Number.isFinite(action.quantity)?Math.max(0,Math.trunc(action.quantity)):0;if(!count)return state
    const remove=new Set(current.cases.filter(item=>!historical(item.market)).slice(-count).map(item=>item.id));if(!remove.size)return state
    cases=cases.map(item=>remove.has(item.id)?{...item,scopeHistory:[...item.scopeHistory,{recordedOn:date,inScope:false}]}:item);message=`Removed ${remove.size} synthetic cases on ${date}`
  } else if(action.type==='resetScope'){
    const baseline=createScenario(state.preset);const original=new Map(baseline.cases.map(item=>[item.id,item]));cases=cases.filter(item=>original.has(item.id)).map(item=>({...item,scopeHistory:original.get(item.id)!.scopeHistory}));const kept=new Set(cases.map(item=>item.id));defects=defects.filter(item=>item.caseIds.some(id=>kept.has(id)));message='Restored preset scope (all markets); other scenario edits retained'
  } else if(action.type==='timing'){
    if(!Number.isFinite(action.days)||!action.days)return state
    cases=cases.map(item=>ids.has(item.id)&&!historical(item.market)?{...item,executionOffset:Math.max(-20,Math.min(20,item.executionOffset+action.days))}:item);message=`Counterfactual execution timing ${action.days>0?'+':''}${action.days} business days for selected non-historical scope`
  } else if(action.type==='evidence'){
    if(!current.cases.some(item=>item.id===action.caseId&&item.firstExecutedOn))return state
    cases=cases.map(item=>item.id===action.caseId?{...item,evidenceHistory:[...item.evidenceHistory,{recordedOn:date,value:action.value}]}:item);message=`Evidence ${action.value.toLowerCase()} for ${action.caseId}`
  } else if(action.type==='data'){
    if(!current.cases.some(item=>item.id===action.caseId&&item.requiresData&&!item.firstExecutedOn&&item.data!==action.value))return state
    cases=cases.map(item=>item.id===action.caseId?{...item,dataHistory:[...item.dataHistory,{recordedOn:date,value:action.value}],executionGates:action.value==='Ready'?[...(item.executionGates??[]),{recordedOn:date,value:addBusinessDays(date,1)}]:item.executionGates}:item)
    if(action.value==='Ready')defects=defects.map(item=>item.blockingDataCaseIds.includes(action.caseId)&&latest(item.statuses,date)==='Open'&&item.blockingDataCaseIds.every(id=>latest(cases.find(c=>c.id===id)!.dataHistory,date)==='Ready')?{...item,statuses:[...item.statuses,{recordedOn:date,value:'Awaiting retest'}]}:item)
    message=`Data ${action.value.toLowerCase()} for ${action.caseId}; execution is not automatic`
  } else if(action.type==='openDefect'){
    const linked=current.cases.find(item=>item.id===action.caseId);if(!linked)return state
    defects=[...defects,{id:`SIM-DEF-NEW-${nextId++}`,caseIds:[linked.id],blockingDataCaseIds:action.dataBlocker?[linked.id]:[],createdOn:date,owner:'Synthetic Product Team / data owner',classifications:[{recordedOn:date,value:action.classification}],severities:[{recordedOn:date,value:action.severity}],statuses:[{recordedOn:date,value:'Open'}]}];message=`Opened a synthetic ${action.classification} defect for ${linked.id}`
  } else if(action.type==='defect'){
    const found=defects.find(item=>item.id===action.id);if(!found||found.createdOn>date)return state
    defects=defects.map(item=>item.id===action.id?{...item,statuses:action.status?[...item.statuses,{recordedOn:date,value:action.status}]:item.statuses,classifications:action.classification?[...item.classifications,{recordedOn:date,value:action.classification}]:item.classifications,severities:action.severity?[...item.severities,{recordedOn:date,value:action.severity}]:item.severities}:item)
    if(action.status==='Closed')cases=cases.map(item=>found.blockingDataCaseIds.includes(item.id)&&current.cases.some(c=>c.id===item.id&&!c.firstExecutedOn&&c.data!=='Ready')&&!defects.some(defect=>defect.blockingDataCaseIds.includes(item.id)&&latest(defect.statuses,date)!=='Closed'&&defect.createdOn<=date)?{...item,dataHistory:[...item.dataHistory,{recordedOn:date,value:'Ready'}],executionGates:[...(item.executionGates??[]),{recordedOn:date,value:addBusinessDays(date,1)}]}:item)
    message=`Updated ${action.id}; classification alone never resolves data readiness`
  }
  if(!message)return state
  return {...state,cases,defects,nextId,log:[...state.log,message],past:[...state.past.slice(-24),dataOf(state)]}
}
export function scenarioHistory(state:ScenarioState) {return reportingDates.map(date=>snapshot(state,{...state.filters,date}))}
export function readinessRows(state:ScenarioState, thresholds={execution:95,evidence:95,criticalHigh:0,blockers:0,overdue:0,churn:10}) {
  const value=snapshot(state,state.filters),index=reportingDates.indexOf(state.filters.date),changes=scopeChanges(state,state.filters,reportingDates[Math.max(0,index-5)])
  const churn=value.scope?(changes.added+changes.removed)/value.scope*100:0
  return [
    {metric:'Execution completion',value:value.executionCompletion,threshold:thresholds.execution,unit:'%',passes:value.executionCompletion!==null&&value.executionCompletion>=thresholds.execution,reason:'Distinct first-executed cases / current in-scope cases'},
    {metric:'Evidence compliance',value:value.evidenceCompliance,threshold:thresholds.evidence,unit:'%',passes:value.evidenceCompliance!==null&&value.evidenceCompliance>=thresholds.evidence,reason:'Evidence-complete executed cases / executed cases'},
    {metric:'Open critical / high defects',value:value.openCriticalHigh,threshold:thresholds.criticalHigh,unit:'maximum',passes:value.openCriticalHigh<=thresholds.criticalHigh,reason:'Open and awaiting-retest linked defects; closed issues excluded'},
    {metric:'Test-data blockers',value:value.dataBlocked,threshold:thresholds.blockers,unit:'maximum',passes:value.dataBlocked<=thresholds.blockers,reason:'Unexecuted in-scope cases requiring data that is not ready'},
    {metric:'Overdue cases',value:value.overdue,threshold:thresholds.overdue,unit:'maximum',passes:value.overdue<=thresholds.overdue,reason:'Due by reporting date, with no first Passed or Failed execution'},
    {metric:'Recent scope churn',value:churn,threshold:thresholds.churn,unit:'% maximum',passes:churn<=thresholds.churn,reason:'Gross scope additions + removals over preceding five reporting intervals / current scope'},
  ]
}
