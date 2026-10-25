import Localized from '../../i18n/Localized'
import ExploreDetails from '../../ExploreDetails'
import { useId } from 'react'
import { useScenario } from './ScenarioContext'
import { scopeChanges, forecast } from './engine'
import { Kpis, percent } from './SharedUi'
export function ScopeActions() {
  const {dispatch,metrics}=useScenario()
  return <Localized>{<div className="scenario-actions"><button type="button" onClick={()=>dispatch({type:'add',quantity:10})}>Add 10 test cases</button><button type="button" onClick={()=>dispatch({type:'add',quantity:25})}>Add 25 test cases</button><button type="button" disabled={!metrics.cases.some(item=>item.market!=='United States'&&item.market!=='Mexico')} onClick={()=>dispatch({type:'remove',quantity:10})}>Remove up to 10 test cases</button><button type="button" onClick={()=>dispatch({type:'resetScope'})}>Reset scope</button></div>}</Localized>
}
export default function ScopeChanges() {
  const id=useId()
  const {state}=useScenario(),changes=scopeChanges(state,state.filters),prediction=forecast(state,state.filters)
  const steps=[{label:'Baseline',start:0,end:changes.baseline},{label:'Additions',start:changes.baseline,end:changes.baseline+changes.added},{label:'Removals',start:changes.baseline+changes.added,end:changes.current},{label:'Current scope',start:0,end:changes.current}]
  const max=Math.max(1,changes.baseline+changes.added,changes.current),y=(value:number)=>215-value/max*170
  return <Localized>{<div id="scenario-scope" tabIndex={-1}><h4 className="dc-module-heading">UAT Scope Change Intelligence</h4><p className="uat-explanation">Scope changes alter workload, execution percentages and readiness. New cases receive synthetic due dates five to nine business days after the selected reporting date, but no automatic execution result.</p>
    <Kpis items={[["Initial baseline scope",changes.baseline],["Current scope",changes.current],["Added cases",changes.added],["Removed cases",changes.removed],["Net scope change",`${changes.net>0?'+':''}${changes.net}`],["Scope change",percent(changes.percentage)]]}/>
    <ScopeActions/>
    <div className="uat-scroll" role="region" aria-label="Scope-change waterfall chart; scroll horizontally on narrow screens" tabIndex={0}><svg className="uat-chart" viewBox="0 0 620 270" role="img" aria-labelledby={`${id}-waterfall-title`}><title id={`${id}-waterfall-title`}>{`Baseline ${changes.baseline} + additions ${changes.added} − removals ${changes.removed} = current scope ${changes.current}`}</title><text x="45" y="22">Distinct test cases</text><line x1="45" x2="580" y1="215" y2="215" className="uat-gridline"/>{steps.map((step,index)=><g key={step.label}><rect x={60+index*135} y={y(Math.max(step.start,step.end))} width="76" height={Math.max(1,Math.abs(y(step.end)-y(step.start)))} className={index===1||index===2?'scenario-waterfall-change':'scenario-waterfall-total'}><title>{`${step.label}: ${index===1?`+${changes.added}`:index===2?`−${changes.removed}`:step.end}`}</title></rect><text x={98+index*135} y={y(Math.max(step.start,step.end))-9} textAnchor="middle">{index===1?`+${changes.added}`:index===2?`−${changes.removed}`:step.end}</text><text x={98+index*135} y="244" textAnchor="middle">{step.label}</text>{index<3&&<line x1={136+index*135} x2={195+index*135} y1={y(step.end)} y2={y(step.end)} className="uat-selection"/>}</g>)}</svg></div>
    <ExploreDetails heading="Explore Scope Counting & Reset"><p className="uat-detail">Remaining execution workload: <strong>{prediction.remaining} cases</strong>. Percentages use current in-scope cases; baseline + additions − removals = current scope. Scope reset restores the preset across all markets; Undo restores the previous edit.</p></ExploreDetails>
    <p className="uat-explanation">Central Test Management coordinates scope mapping, validation and reporting. Business-scope relevance decisions remain with Central Finance Product Teams and market stakeholders.</p>
  </div>}</Localized>
}
