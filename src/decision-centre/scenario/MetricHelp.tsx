import Localized from '../../i18n/Localized'
const definitions = [
  ['execution variance', 'Actual executed cases minus cases due by the reporting date. A negative value indicates an aggregate delay; individual overdue cases still need review.'],
  ['evidence compliance', 'Executed cases meeting their applicable evidence requirements divided by executed cases. Execution alone does not establish evidence completeness.'],
  ['scope change', 'Additions minus removals relative to the initial baseline. Changes affect workload and completion percentages; business stakeholders decide scope relevance.'],
  ['forecast completion', 'An illustrative completion date projected from recent five-reporting-day throughput and remaining scope. N/A means history or throughput is insufficient.'],
  ['data-block', 'An unexecuted case requiring data that is not Ready. A data issue need not have a Jira defect; resolving data does not execute a test.'],
  ['threshold', 'An editable demonstration criterion for reviewing readiness. It is not an industry requirement, formal UAT sign-off or release authorization.'],
] as const

export default function MetricHelp({ label }: { label: string }) {
  const normalized = label.toLowerCase().replace(/[\s-]+/g, ' ')
  const text = definitions.find(([term]) => normalized.includes(term.replace(/-/g, ' ')))?.[1]
  if (!text) return null
  return <Localized>{<details className="metric-help"><summary aria-label={`Explain ${label}`}>?</summary><p>{text}</p></details>}</Localized>
}
