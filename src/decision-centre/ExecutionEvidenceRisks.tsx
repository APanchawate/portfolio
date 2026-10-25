import Localized from '../i18n/Localized'
import { dailySnapshots, shortDate, workstreamSummary } from './dueDateData'
import { illustrativeEvidenceKpi } from './evidenceData'
import type { ShowcaseTarget } from '../resourceLinks'

export default function ExecutionEvidenceRisks({ onExplore }: { onExplore?: (target: ShowcaseTarget) => void }) {
  const snapshot = dailySnapshots[24]
  const priority = workstreamSummary(snapshot)[0]
  return <Localized>{<details className="dc-thresholds execution-evidence-risks"><summary>Overdue execution & missing evidence</summary>
    <p className="uat-data-note">Separate illustrative snapshots — not actual programme data or joined defect records.</p>
    <p className="uat-explanation"><strong>{snapshot.overdue} overdue, unexecuted cases</strong> at {shortDate(snapshot.date)} in the due-date example. {priority.workstream} has the largest overdue count ({priority.overdue}); follow up on agreed commitments and blockers with the relevant WS Lead.</p>
    <p className="uat-explanation"><strong>{illustrativeEvidenceKpi.incomplete} missing or incomplete evidence records</strong> among {illustrativeEvidenceKpi.required} executed cases requiring evidence in the independent evidence example. Testers supply appropriate evidence; Test Management monitors gaps and follows up.</p>
    <p className="uat-explanation">These figures expose follow-up needs. They do not imply that defects caused every overdue case or that the two datasets describe the same test cases.</p>
    {onExplore && <div className="resource-actions"><button type="button" className="button secondary" onClick={() => onExplore('execution')}>Inspect overdue cases</button><button type="button" className="button secondary" onClick={() => onExplore('evidence')}>Inspect evidence completeness</button></div>}
  </details>}</Localized>
}
