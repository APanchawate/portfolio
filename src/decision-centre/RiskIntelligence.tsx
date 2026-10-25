import Localized from '../i18n/Localized'
import { useState } from 'react'
import { DefectWorkflow } from '../UatVisuals'
import Tabs from './Tabs'
import DefectIntelligence from './scenario/DefectIntelligence'
import EvidenceMonitor from './scenario/EvidenceMonitor'
import DataReadiness from './scenario/DataReadiness'
import RiskHeatmap from './scenario/RiskHeatmap'
import { useScenario } from './scenario/ScenarioContext'

export default function RiskIntelligence({ requestedView }: { requestedView?: number }) {
  const [active, setActive] = useState(requestedView ?? 0)
  const { metrics } = useScenario()
  const item = metrics.cases.find(value => value.firstExecutedOn) ?? metrics.cases[0]
  return <Localized>{<><p className="uat-detail">Shared follow-up: {metrics.overdue} overdue, unexecuted cases · {metrics.missingEvidence + metrics.incompleteEvidence} executed cases with evidence gaps. These are related dimensions, not assumed defect causes.</p><Tabs labels={['Defect Intelligence','Evidence Compliance','Test Data Readiness','Risk Heatmap']} label="Risk and quality gadgets" active={active} onChange={setActive}>
    {active === 0 ? <DefectIntelligence/> : active === 1 ? <EvidenceMonitor/> : active === 2 ? <DataReadiness/> : <RiskHeatmap/>}
  </Tabs><details className="dc-workflow"><summary>Traceability and defect coordination approach</summary>
    {item ? <><h4 className="dc-module-heading">Traceability from requirement to evidence</h4><ol className="dc-traceability">{[['Business requirement',`Validate the synthetic ${item.financeProduct} scenario`],['Business process',item.financeProduct],['Test case',item.id],['Test execution',item.firstExecutedOn ?? 'Not yet executed'],['Defect / evidence',`${metrics.defects.filter(defect=>defect.caseIds.includes(item.id)).map(defect=>defect.id).join(', ') || 'No linked defect'} · Evidence: ${item.evidence}`]].map(([label,text])=><li key={label}><strong>{label}</strong><span>{text}</span></li>)}</ol><p className="uat-explanation">This example uses a real relationship within the synthetic scenario. Traceability supports coverage review and auditability; a link alone is not acceptance.</p></> : <p className="uat-explanation">No cases under current filters.</p>}
    <DefectWorkflow/>
  </details></>}</Localized>
}
