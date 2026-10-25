// Synthetic operating-model examples only; not client schedules or mandatory standards.
export type UatDuration = 8 | 12
export interface TimelinePhase {
  id: string
  name: string
  stage: 1 | 2 | 3 | 4
  preparation?: boolean
  governanceLabel?: string
  evidenceNote?: string
  intensive?: boolean
  purpose: string
  contribution: readonly string[]
  outputs: string
}
export const timelinePhases: readonly TimelinePhase[] = [
  {
    id: 'planning-readiness', name: 'UAT Planning & Readiness', stage: 1, preparation: true,
    governanceLabel: 'Evidence Requirements & Tester Guidance',
    evidenceNote: 'Before UAT, Test Management communicates scenario-specific evidence expectations and guides testers on attaching appropriate execution evidence in Jira/Xray.',
    purpose: 'Support Central and Market Rollout Managers with testing preparation before the formal UAT window opens.',
    contribution: ['Confirm UAT scope and test-case readiness; align execution due dates with testers and WS Leads, who coordinate their testers and help establish commitments.', 'Establish daily and weekly cumulative planned-execution baselines from those due dates; prepare Jira/Xray Test Plans and Test Executions.', 'Communicate execution and evidence requirements; verify tester availability, access and prerequisites, and identify outstanding readiness risks.', 'Support UAT Kickoff & Stakeholder Alignment as an opening milestone, with Rollout Managers, Market CFOs and other senior business stakeholders participating in relevant discussions.'],
    outputs: 'Agreed scope and due-date commitments, prepared execution structures, prerequisite visibility and documented readiness risks.',
  },
  {
    id: 'execution', name: 'UAT Execution & Monitoring', stage: 2,
    purpose: 'Support business testers as they execute in-scope cases against agreed commitments and document results and evidence.',
    contribution: ['Support Rollout Management with execution coordination and follow up with WS Leads on agreed tester commitments, including during stabilization.', 'Monitor distinct executed cases against the cumulative due-date plan; execution does not imply a passed result.'],
    outputs: 'Execution evidence, completion visibility and outstanding commitments for business and management follow-up.',
  },
  {
    id: 'scope-control', name: 'Due-Date-Driven Execution Tracking', stage: 2,
    purpose: 'Keep the execution plan and evolving UAT scope transparent.',
    contribution: ['Track cumulative planned versus actual execution daily and monitor scope additions and removals.', 'Follow up on overdue cases and unagreed due dates; record changed commitments without rewriting earlier reporting snapshots.'],
    outputs: 'Daily variance, scope-change visibility and a prioritized follow-up list for testers and WS Leads.',
  },
  {
    id: 'evidence-capture', name: 'Test Evidence Management', stage: 2,
    governanceLabel: 'Test Evidence Capture & Quality Monitoring',
    purpose: 'Keep execution evidence traceable and reviewable throughout UAT, using the requirements appropriate to each test case.',
    contribution: ['Testers capture appropriate execution evidence and attach or link it to the relevant Jira/Xray execution context.', 'I communicate expectations, monitor completeness and follow up on missing or incomplete evidence with testers and WS Leads.'],
    outputs: 'Evidence coverage, documentation gaps and follow-up ownership supporting traceability, reviewability and business acceptance discussions.',
    evidenceNote: 'Requirements vary by scenario. An attachment alone does not establish relevance, adequate quality or business acceptance.',
  },
  {
    id: 'defects', name: 'Defect Management & Stabilization', stage: 2,
    evidenceNote: 'Testers provide updated execution evidence where required during defect follow-up. Test Management monitors gaps; technical owners remain responsible for fixes.',
    purpose: 'Make business-impacting issues actionable across the whole formal UAT window.',
    contribution: ['Coordinate triage, classification, assignment, fixing-date follow-up and escalation with markets, Product Teams and technical owners.', 'Keep unresolved critical issues visible throughout UAT; technical owners investigate and deliver fixes.'],
    outputs: 'Clear ownership, business-impact priorities, outstanding fixing commitments and visible residual risks.',
  },
  {
    id: 'retesting', name: 'Retesting & Evidence Validation', stage: 3,
    evidenceNote: 'Testers provide updated execution evidence for retests where required, linked to the relevant test and defect context. I follow up on missing or incomplete documentation.',
    purpose: 'Validate delivered fixes whenever they become available, rather than waiting for a final testing phase.',
    contribution: ['Coordinate tester availability, retest priorities and updated execution evidence with business testers and technical owners.', 'Track unsuccessful retests and reopening; keep retest backlog and dependencies visible.'],
    outputs: 'Retest evidence, confirmed outcomes, reopened issues and transparent retesting demand.',
  },
  {
    id: 'reporting', name: 'Management Reporting & Decision Support', stage: 2,
    purpose: 'Maintain a shared daily view of progress, blockers and business risk across stakeholders.',
    contribution: ['Provide daily management reporting and coordinate testers, WS Leads, markets and Product Teams.', 'Document actions and owners, escalate overdue commitments and support recovery discussions.'],
    outputs: 'Decision-ready progress reporting, accountable follow-up actions and escalation priorities.',
  },
  {
    id: 'stabilization', name: 'Defect Stabilization & Retesting', stage: 3, intensive: true,
    governanceLabel: 'Intensive focus during the final ≈15 days',
    purpose: 'Increase focus on unresolved business-critical issues and retesting in the final approximately 15 days of UAT.',
    contribution: ['Prioritize unresolved critical and high-impact issues, coordinate defect owners, testers and other stakeholders on fixes and retests, and monitor unfinished execution commitments.', 'Coordinate Evidence Completeness Review and consolidate open risks and readiness evidence for accountable stakeholders while other UAT activities continue.'],
    outputs: 'Prioritized fixing and retest backlog, remaining commitments, residual-risk visibility and readiness evidence. This period does not require every defect to be resolved.',
  },
  {
    id: 'evidence-review', name: 'Evidence Completeness Review', stage: 4, intensive: true,
    purpose: 'Identify outstanding execution documentation gaps during final stabilization, while ongoing evidence capture and retesting continue.',
    contribution: ['Review evidence completeness against the agreed case-specific requirements and prioritize missing or incomplete documentation.', 'Follow up with the responsible testers and WS Leads on updates, including retest evidence where required; testers remain responsible for capturing it.'],
    outputs: 'An outstanding-evidence list, responsible follow-up owners and transparent conditions for business acceptance and readiness discussions.',
    evidenceNote: 'Completeness supports traceability and reviewability. It does not prove that tests passed, that evidence quality is sufficient in every respect, or that business acceptance has been granted.',
  },
  {
    id: 'completion-readiness', name: 'UAT Completion & Release Readiness', stage: 4, intensive: true,
    purpose: 'Consolidate completion status, evidence and testing exceptions for business acceptance and release-readiness discussions.',
    contribution: ['Review execution completion against scope and evidence completeness; consolidate open defects, residual risks and unresolved testing exceptions.', 'Prepare management-level testing status and readiness reporting to support accountable stakeholders in business acceptance and release-readiness discussions; formal UAT approval and final go-live decisions remain with authorized decision-makers.'],
    outputs: 'Testing completion status, reviewable evidence, open defects, residual risks and unresolved exceptions for accountable stakeholders.',
  },
]
// Management lenses overlap; these are not sequential entry/exit gates.
export const managementStages = [
  { number: 1, title: 'UAT Planning & Readiness', focusId: 'planning-readiness', window: 'Before formal UAT execution' },
  { number: 2, title: 'UAT Execution & Monitoring', focusId: 'execution', window: 'Across the formal UAT window' },
  { number: 3, title: 'Defect Stabilization & Retesting', focusId: 'stabilization', window: 'Throughout UAT; intensified near the end' },
  { number: 4, title: 'UAT Completion & Release Readiness', focusId: 'completion-readiness', window: 'Consolidation overlaps final stabilization' },
] as const
export const stabilizationCalendarDays = 15
export function stabilizationWindow(duration: UatDuration) {
  const totalDays = duration * 7
  const startDay = totalDays - stabilizationCalendarDays
  return { totalDays, startDay, firstWeek: Math.floor(startDay / 7) + 1, days: stabilizationCalendarDays }
}
export function phaseWeekCoverage(phase: TimelinePhase, duration: UatDuration, week: number) {
  if (phase.preparation || week < 1 || week > duration) return { offset: 0, width: 0 }
  const start = phase.intensive ? stabilizationWindow(duration).startDay : 0
  const weekStart = (week - 1) * 7
  const visibleStart = Math.max(start, weekStart)
  const visibleEnd = Math.min(duration * 7, weekStart + 7)
  if (visibleStart >= visibleEnd) return { offset: 0, width: 0 }
  return { offset: (visibleStart - weekStart) / 7 * 100, width: (visibleEnd - visibleStart) / 7 * 100 }
}
