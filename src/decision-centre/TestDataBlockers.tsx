import Localized from '../i18n/Localized'
import { useId } from 'react'
import { defects, severities } from './data'
import type { DemoDefect } from './data'

export function summarizeTestDataBlockers(source: readonly DemoDefect[]) {
  const classified = source.filter(defect => defect.classification === 'Test data')
  const open = classified.filter(defect => defect.status === 'Open')
  return {
    classified: classified.length,
    open: open.length,
    oldestDays: open.length ? Math.max(...open.map(defect => defect.ageDays)) : null,
    aged15Plus: open.filter(defect => defect.ageDays >= 15).length,
    awaitingRetest: classified.filter(defect => defect.status === 'Awaiting retest').length,
    severity: severities.map(label => ({ label, count: open.filter(defect => defect.severity === label).length })),
    ageing: [
      { label: '0–7 days', count: open.filter(defect => defect.ageDays <= 7).length },
      { label: '8–14 days', count: open.filter(defect => defect.ageDays >= 8 && defect.ageDays <= 14).length },
      { label: '15+ days', count: open.filter(defect => defect.ageDays >= 15).length },
    ],
  }
}

export default function TestDataBlockers() {
  const id = useId()
  const summary = summarizeTestDataBlockers(defects)
  return <Localized>{<div className="dc-test-data" role="group" aria-labelledby={`${id}-title`}>
    <h4 id={`${id}-title`} className="dc-module-heading">Test Data Blocker Monitoring</h4>
    <p className="uat-data-note">Illustrative example — not actual programme data.</p>
    <ol className="dc-test-data-flow" aria-label="Test-data monitoring workflow">{[
      'Tester identifies missing test data',
      'Jira defect · Defect Classification: Test data',
      'I configure relevant Jira filters',
      'Filtered defects on Jira/Xray dashboards',
      'Test Management coordinates stakeholder follow-up',
    ].map(step => <li key={step}>{step}</li>)}</ol>
    <p className="uat-explanation">Missing data can prevent execution or limit scenario validation, putting agreed due dates at risk. I configure Jira filters and display relevant defects through Jira/Xray dashboards for monitoring, reporting and follow-up with the relevant stakeholders and workstreams.</p>
    <dl className="dc-test-data-kpis">{[
      ['Open test-data defects', summary.open],
      ['Oldest open defect', summary.oldestDays === null ? 'None' : `${summary.oldestDays} days`],
      ['Open defects aged 15+ days', summary.aged15Plus],
      ['Resolved · awaiting retest', summary.awaitingRetest],
    ].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    <div className="dc-test-data-breakdowns">
      <div><h5>Open defects by severity</h5><ul>{summary.severity.map(item => <li key={item.label} title={`${item.count} open Test data defects with ${item.label.toLowerCase()} severity`}>{item.label}<strong>{item.count}</strong></li>)}</ul></div>
      <div><h5>Open defect ageing</h5><ul>{summary.ageing.map(item => <li key={item.label} title={`${item.count} open Test data defects aged ${item.label}`}>{item.label}<strong>{item.count}</strong></li>)}</ul></div>
    </div>
    <p className="uat-explanation">Early visibility supports recovery discussions: agree data ownership and delivery dates, escalate ageing blockers, and coordinate tester availability or unblocked scope while data is prepared. A reported fix still needs validation; the dashboard supports coordination rather than resolving the data issue itself.</p>
    <p className="dc-test-data-note">Dedicated “Test data” view, independent of the classification selector above. Uses the same synthetic defect dataset ({summary.classified} classified records). Open excludes resolved and closed records; ageing is days since submission. Defect counts only—no defect-to-test-case links are modelled.</p>
  </div>}</Localized>
}
