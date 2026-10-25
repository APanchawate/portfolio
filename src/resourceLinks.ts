export type ShowcaseTarget = 'execution' | 'scope' | 'defects' | 'evidence' | 'management'
export interface ShowcaseRequest { target: ShowcaseTarget }
export const showcaseDestinations: Record<ShowcaseTarget, { module: number; view: number; focusId: string }> = {
  execution: { module: 0, view: 0, focusId: 'due-date-execution' },
  scope: { module: 0, view: 1, focusId: 'scenario-scope' },
  defects: { module: 1, view: 0, focusId: 'defect-intelligence' },
  evidence: { module: 1, view: 0, focusId: 'scenario-evidence' },
  management: { module: 3, view: 0, focusId: 'decision-centre' },
}
