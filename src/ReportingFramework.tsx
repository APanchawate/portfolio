import Localized from './i18n/Localized'
import { Activity, BarChart3, Layers3, TrendingUp } from 'lucide-react'

const views = [
  { title: 'Overall Test Status', description: 'Execution trends, planned progress and changing scope.', icon: Activity,
    original: 'Test Status Report',
    detail: 'Stacked Pass, Fail and Executing status bars show testing status over time, alongside lines for changing total test-case scope and planned cumulative execution. Together they reveal progress against plan and remaining work; planned execution, actual execution and total scope are distinct measurements.' },
  { title: 'Workstream Failure Rates', description: 'Failure percentages and areas requiring investigation.', icon: BarChart3,
    original: 'Failed Test Cases per Workstream (Fail / Total TC)',
    detail: 'Failure percentage = Failed test cases / Total test cases × 100, using the total test-case scope of each workstream. It is not failed/executed. Higher rates identify concentrations of unsuccessful results for investigation and targeted follow-up.' },
  { title: 'Defect Evolution', description: 'Unresolved defects, priority distribution and closure trends.', icon: TrendingUp,
    original: 'Defect Evolution for Open Defects',
    detail: 'Combines unresolved defects over time, creation and closure trends, all versus closed defects, and open versus resolved defects by Critical, High, Medium and Low priority, with status/priority summaries. It shows whether resolution keeps pace and where unresolved risks need attention. Defect progress is separate from test execution progress.' },
  { title: 'Workstream Execution', description: 'Planned versus executed, remaining workload and status breakdown.', icon: Layers3,
    original: 'Status Test Execution per Workstream — Overall',
    detail: 'A stacked execution-status chart is paired with a reconciliation table: Workstream, Planned, Executed, Difference (Executed − Planned), To Do, Pass, Fail, Executing, Blocked and Total. This supports numerical accountability for commitments, remaining workload and failed or blocked cases; Planned, Executed and Total are not interchangeable.' },
] as const

export default function ReportingFramework() {
  return <Localized>{<div className="reporting-framework" role="group" aria-labelledby="reporting-framework-title">
    <h4 id="reporting-framework-title">15-Page Enterprise UAT KPI Reporting Framework</h4>
    <p>Four key management views within an automated reporting package.</p>
    <div className="reporting-view-grid">{views.map(view => <article key={view.title} className="reporting-view-card">
      <view.icon size={20} aria-hidden="true"/><h5>{view.title}</h5><p>{view.description}</p>
      <details><summary>View reporting logic<span className="uat-sr-only"> — {view.title}</span></summary><p className="report-original-title">Report: {view.original}</p><p>{view.detail}</p></details>
    </article>)}</div>
    <p className="reporting-boundary">One integrated 15-page package; these four views are representative. The other eleven pages are not specified here. Descriptions only — no original client charts, report figures or templates are reproduced.</p>
  </div>}</Localized>
}

export function ReportingWorkflow() {
  return <Localized>{<div className="reporting-workflow">
    <h4>Reporting modernization &amp; stakeholder review</h4>
    <ol aria-label="Conceptual reporting workflow">{['Jira/Xray Data', 'Data Extraction', 'Data Transformation', 'KPI Calculations', 'Report Generation', 'Confluence Publication', 'Stakeholder Review'].map(step => <li key={step}>{step}</li>)}</ol>
    <p>Excel Power Query and VBA/macros supported the earlier workflow. Python, APIs and SQLite developed the automation further, including PDF reporting. These describe stages of modernization; individual reporting solutions can use different tool combinations.</p>
  </div>}</Localized>
}
