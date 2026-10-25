import Localized from '../../i18n/Localized'
import ExploreDetails from '../../ExploreDetails'
import { useState } from 'react'
import { useScenario } from './ScenarioContext'
import { products } from './engine'
import { riskBand } from '../data'
export default function RiskHeatmap() {
  const {metrics}=useScenario(),[selected,setSelected]=useState('Financial Closing')
  const rows=products.map((process,index)=>{
    const cases=metrics.cases.filter(item=>item.financeProduct===process),defects=metrics.defects.filter(item=>item.products.includes(process)&&item.status!=='Closed')
    const overdue=cases.filter(item=>item.dueOn&&item.dueOn<=metrics.date&&!item.firstExecutedOn).length,blocked=cases.filter(item=>item.requiresData&&item.data!=='Ready'&&!item.firstExecutedOn).length
    const high=defects.filter(item=>item.severity==='Critical'||item.severity==='High').length,impact=[5,4,4,3,5,5][index]
    const likelihood=cases.length?Math.min(5,Math.max(1,Math.ceil((overdue+blocked)/cases.length*5))+Math.min(2,high)):0
    return {process,impact,likelihood,score:impact*likelihood,scope:cases.length,overdue,blocked,high}
  })
  const row=rows.find(item=>item.process===selected)!
  return <Localized>{<><h4 className="dc-module-heading">Business-Process Risk Heatmap</h4><p className="uat-explanation">Compare Finance Product risk signals to prioritize overdue commitments, data blockers and high-severity issues.</p><div className="uat-scroll" role="region" aria-label="Shared-scenario process risk heatmap" tabIndex={0}><table className="dc-risk-table"><caption>Risk = impact × illustrative likelihood · Lower 1–7 · Moderate 8–14 · High 15–25</caption><thead><tr><th scope="col">Finance Product</th>{[1,2,3,4,5].map(value=><th key={value} scope="col">Likelihood {value}</th>)}</tr></thead><tbody>{rows.map(item=><tr key={item.process}><th scope="row"><button type="button" aria-pressed={item.process===selected} onClick={()=>setSelected(item.process)}>{item.process}<small>Impact {item.impact}/5 · {item.scope} cases</small></button></th>{[1,2,3,4,5].map(value=><td key={value} className={item.likelihood===value?`dc-risk-${riskBand(item.score).toLowerCase()}`:''}>{item.likelihood===value?`${item.score} · ${riskBand(item.score)}`:'—'}</td>)}</tr>)}</tbody></table></div><p className="uat-detail" role="status">{row.process}: {row.scope?`${row.overdue} overdue cases, ${row.blocked} data-blocked cases and ${row.high} open critical/high defects.`:'No applicable cases under current filters; risk is not assessed.'}</p><ExploreDetails heading="Explore Risk Calculation"><p className="uat-explanation">Synthetic impact weights (1–5) combine with an illustrative likelihood: ceil((overdue + data-blocked) / scope × 5), minimum 1, plus up to 2 for open critical/high defects, capped at 5. Signals may overlap; this is a prioritization model, not a measured probability.</p></ExploreDetails></>}</Localized>
}
