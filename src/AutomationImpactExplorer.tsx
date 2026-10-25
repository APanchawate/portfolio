import Localized from './i18n/Localized'
import { useState } from 'react'
import { Kpis, percent } from './decision-centre/scenario/SharedUi'
export const automationWorkflows = ['Test Plan creation','Test Execution creation','Test-case creation and cloning','Jira filter creation','Dashboard and KPI gadget configuration','Reporting preparation'] as const
export function automationImpact(quantity:number,manualMinutes:number,automatedMinutes:number,setupMinutes:number) {
  const manual=quantity*manualMinutes,automated=setupMinutes+quantity*automatedMinutes,saved=manual-automated
  return {manual,automated,saved,reduction:manual? saved/manual*100:null}
}
export default function AutomationImpactExplorer() {
  const [workflow,setWorkflow]=useState<string>(automationWorkflows[0]),[assumptions,setAssumptions]=useState({quantity:25,manual:8,automated:1,setup:20})
  const result=automationImpact(assumptions.quantity,assumptions.manual,assumptions.automated,assumptions.setup)
  return <Localized>{<div className="automation-impact"><h4>Test Management Automation Impact Explorer</h4><p className="uat-data-note">Illustrative editable assumptions — not verified project savings. Browser-local arithmetic only; no Jira API calls.</p><label className="scenario-local-filter">Workflow<select value={workflow} onChange={event=>setWorkflow(event.target.value)}>{automationWorkflows.map(value=><option key={value}>{value}</option>)}</select></label>
    <Kpis items={[["Estimated manual effort",`${result.manual.toFixed(1)} min`],["Estimated automated effort",`${result.automated.toFixed(1)} min`],["Estimated time saved",`${result.saved.toFixed(1)} min`],["Estimated reduction",percent(result.reduction)]]}/>
    <details className="dc-thresholds"><summary>Edit assumptions & inspect formulas</summary><div className="scenario-filter-grid">{[['quantity','Number of items'],['manual','Manual minutes per item'],['automated','Automated minutes per item'],['setup','One-time setup minutes']].map(([key,label])=><label key={key}>{label}<input type="number" min={0} max={key==='quantity'?10000:100000} step={key==='quantity'?1:0.1} value={assumptions[key as keyof typeof assumptions]} onChange={event=>setAssumptions(previous=>({...previous,[key]:Math.max(0,Math.min(key==='quantity'?10000:100000,key==='quantity'?Math.floor(Number(event.target.value)||0):Number(event.target.value)||0))}))}/></label>)}</div><p className="uat-explanation">Manual = quantity × manual minutes/item. Automated = setup + quantity × automated minutes/item. Saved = manual − automated. Reduction = saved / manual × 100; zero manual effort gives N/A. All workflows start with the same neutral demonstration assumptions; select a workflow and edit them to explore its effort.</p></details>
    <p className="uat-detail" role="status">{result.saved<0?'Negative savings: under these assumptions setup and automation require more effort than the manual approach.':result.saved===0?'Break-even under the selected assumptions.':'Potential effort reduction under the selected assumptions; validate setup, maintenance, exception handling and quality before using estimates.'}</p>
    <p className="uat-explanation">Conceptual execution: React/TypeScript UI → FastAPI/Python services → Jira/Xray REST APIs → Test Management objects. SQLite supports local application data/state; GitHub Actions and self-hosted runners support execution/CI/CD; Playwright supports browser testing. This simulator is not connected to those services.</p>
    <button className="button secondary" type="button" onClick={()=>{setWorkflow(automationWorkflows[0]);setAssumptions({quantity:25,manual:8,automated:1,setup:20})}}>Reset impact assumptions</button>
  </div>}</Localized>
}
