// Entirely fictional demonstration data. No client assessments, identifiers or schedules.
export const classifications = ['Partner system', 'Training', 'Test data', 'Implementation', 'New requirement', 'New minor requirement', 'Migration'] as const
export const severities = ['Critical', 'High', 'Medium', 'Low'] as const
export type Severity = typeof severities[number]
export type DefectStatus = 'Open' | 'Awaiting retest' | 'Closed'
export interface DemoDefect { classification: typeof classifications[number]; severity: Severity; status: DefectStatus; ageDays: number }
export const defects: DemoDefect[] = classifications.flatMap((classification, i) =>
  Array.from({ length: 4 + i % 3 }, (_, j) => ({
    classification,
    severity: severities[(i + j) % severities.length],
    status: (['Open', 'Awaiting retest', 'Closed', 'Open', 'Closed', 'Awaiting retest'] as const)[(i + j) % 6],
    ageDays: 2 + (i * 3 + j * 5) % 26,
  })),
)
export const risks = [
  { process: 'Record-to-Report', impact: 5, likelihood: 3, focus: 'Validate posting completeness and reconciliation across the agreed scope.' },
  { process: 'Procure-to-Pay', impact: 4, likelihood: 3, focus: 'Prioritize supplier invoice and payment scenarios and their dependencies.' },
  { process: 'Order-to-Cash', impact: 4, likelihood: 2, focus: 'Review billing-to-receivables coverage and integration evidence.' },
  { process: 'Asset Accounting', impact: 3, likelihood: 2, focus: 'Check asset lifecycle scenarios and relevant migration dependencies.' },
  { process: 'Intercompany', impact: 5, likelihood: 4, focus: 'Coordinate cross-entity dependencies and prioritize reconciliation blockers.' },
  { process: 'Financial Closing', impact: 5, likelihood: 5, focus: 'Prioritize closing-critical scenarios, evidence gaps and unresolved dependencies.' },
]
export const riskBand = (score: number) => score >= 15 ? 'High' : score >= 8 ? 'Moderate' : 'Lower'
export const traceability = [
  ['Business requirement', 'Reconcile intercompany balances'],
  ['Business process', 'Intercompany reconciliation'],
  ['Test case', 'Validate matching and exception handling'],
  ['Test execution', 'Illustrative UAT cycle · week 5'],
  ['Defect / evidence', 'Mismatch recorded; execution evidence linked'],
]
export interface ReadinessInput { execution: number; coverage: number; critical: number; evidence: number }
export interface ReadinessThresholds { execution: number; coverage: number; critical: number; evidence: number }
export const initialReadiness: ReadinessInput = { execution: 92, coverage: 96, critical: 1, evidence: 90 }
export const initialThresholds: ReadinessThresholds = { execution: 95, coverage: 100, critical: 0, evidence: 95 }
export function assessReadiness(input: ReadinessInput, thresholds: ReadinessThresholds) {
  const checks = [
    { label: 'Test execution completion', value: input.execution, target: thresholds.execution },
    { label: 'Business-process coverage', value: input.coverage, target: thresholds.coverage },
    { label: 'Evidence completeness', value: input.evidence, target: thresholds.evidence },
  ]
  const gaps = checks.filter(check => check.value < check.target)
  const criticalGap = input.critical > thresholds.critical
  const reasons = gaps.map(check => `${check.label}: ${check.value}% is below the ${check.target}% demonstration target.`)
  if (criticalGap) reasons.unshift(`Open critical defects: ${input.critical}, above the demonstration maximum of ${thresholds.critical}.`)
  const status = criticalGap || gaps.some(check => check.target - check.value > 10)
    ? 'Attention required' : gaps.length ? 'Review recommended' : 'Illustrative criteria satisfied'
  if (!reasons.length) reasons.push('All four configured demonstration thresholds are met. This is not a release authorization.')
  return { status, reasons }
}
export const markets = [
  { name: 'Market Alder', phase: 'UAT Planning & Readiness', dependency: 'Business scenario review', blocker: 'Market-specific scope awaiting confirmation', priority: 'Medium', owner: 'Market lead & Product Team', action: 'Agree scope owners and review dates before committing tester capacity.' },
  { name: 'Market Birch', phase: 'UAT Planning & Readiness', dependency: 'Tester access provisioning', blocker: 'Four tester accounts pending', priority: 'High', owner: 'Market coordinator & access team', action: 'Confirm access delivery and adjust onboarding commitments.' },
  { name: 'Market Cedar', phase: 'UAT execution', dependency: 'Interface test data', blocker: 'Partner data set unavailable', priority: 'High', owner: 'Product Team & partner coordinator', action: 'Escalate data ownership and rebalance testers toward unblocked scope.' },
  { name: 'Market Elm', phase: 'Defect resolution', dependency: 'Fix delivery and retest support', blocker: 'Critical reconciliation defect remains open', priority: 'High', owner: 'Technical owner & business tester', action: 'Confirm fix timing, business impact and retest capacity; report residual risk.' },
  { name: 'Market Maple', phase: 'Regression', dependency: 'Stable regression environment', blocker: 'None recorded in this example', priority: 'Low', owner: 'Regression coordinator & automation team', action: 'Monitor environment stability and evidence coverage; coordinate with automation owners.' },
  { name: 'Market Willow', phase: 'Readiness assessment', dependency: 'Business evidence review', blocker: 'Two evidence reviews pending', priority: 'Medium', owner: 'Business owners & test coordination', action: 'Consolidate outstanding reviews and present remaining conditions to accountable stakeholders.' },
] as const
export const interpretations = [
  { shows: 'Tester capacity, due-date-driven execution and overlapping UAT Planning & Readiness and formal execution coordination windows.', value: 'Identify capacity gaps early, compare progress against baseline and coordinate recovery planning.', contribution: 'I support UAT Planning & Readiness, preliminary Pre-UAT testing, UAT and regression coordination, Jira/Xray executions and management reporting.' },
  { shows: 'Synthetic process risks, defect patterns and requirement-to-evidence relationships.', value: 'Prioritize business-critical coverage, route issues to appropriate owners and expose retesting backlogs.', contribution: 'I support defect coordination, classification, monitoring and reporting, alongside test-case quality and Jira/Xray traceability.' },
  { shows: 'An illustrative assessment against adjustable demonstration thresholds.', value: 'Make evidence gaps and unresolved risks explicit for readiness discussions.', contribution: 'My role is to consolidate testing evidence, highlight outstanding risks and support accountable stakeholders in release-readiness discussions.' },
  { shows: 'Six fictional markets at different testing phases, with dependencies and blockers.', value: 'Coordinate parallel workstreams, assign follow-up owners and prioritize escalation.', contribution: 'I support Central and Market Rollout Managers with Enterprise UAT Governance & Rollout Coordination: testing commitments, defect and evidence tracking, and management visibility through Jira/Xray and Python/REST API automation.' },
]
