import type { DemoUatCase } from '../dueDateData'
import type { classifications, severities } from '../data'
export type Market = 'United States' | 'Canada' | 'China' | 'Benelux' | 'Mexico'
export type Preset = 'On Track' | 'At Risk' | 'Scope Expansion'
export type Evidence = 'Complete' | 'Missing' | 'Incomplete' | 'Not yet applicable'
export type DataReadiness = 'Ready' | 'Missing' | 'Invalid' | 'Pending preparation' | 'Blocked'
export type CaseStatus = 'Passed' | 'Failed' | 'Blocked' | 'Not executed'
export type Classification = typeof classifications[number]
export type Severity = typeof severities[number]
export type DefectStatus = 'Open' | 'Awaiting retest' | 'Closed'
export interface Event<T> { recordedOn: string; value: T; timingBound?: boolean }
export interface ScenarioCase extends DemoUatCase {
  market: Market; companyCode: string; financeProduct: string; tester: string; risk: 'High' | 'Moderate' | 'Lower'
  executionGates?: Event<string>[]
  requiresData: boolean; dataHistory: Event<DataReadiness>[]; evidenceHistory: Event<Evidence>[]; executionOffset: number
}
export interface ScenarioDefect {
  id: string; caseIds: string[]; blockingDataCaseIds: string[]; createdOn: string; owner: string
  classifications: Event<Classification>[]; severities: Event<Severity>[]; statuses: Event<DefectStatus>[]
}
export interface Filters { market: Market | 'All markets'; product: string; date: string }
export interface ScenarioData { cases: ScenarioCase[]; defects: ScenarioDefect[]; nextId: number; log: string[] }
export interface ScenarioState extends ScenarioData { preset: Preset; filters: Filters; past: ScenarioData[] }
export interface CaseView {
  id: string; workstream: string; owner: string; market: Market; companyCode: string; financeProduct: string; tester: string
  dueOn: string | null; firstExecutedOn: string | null; blocked: boolean; status: CaseStatus; evidence: Evidence; data: DataReadiness; requiresData: boolean; risk: ScenarioCase['risk']
}
export interface DefectView { id: string; caseIds: string[]; blockingDataCaseIds: string[]; classification: Classification; severity: Severity; status: DefectStatus; ageDays: number; owner: string; markets: Market[]; products: string[] }
export type ScenarioAction =
  | { type: 'filters'; filters: Partial<Filters> }
  | { type: 'preset'; preset: Preset }
  | { type: 'reset' } | { type: 'undo' } | { type: 'resetScope' }
  | { type: 'add'; quantity: number } | { type: 'remove'; quantity: number } | { type: 'timing'; days: number }
  | { type: 'evidence'; caseId: string; value: 'Complete' | 'Missing' | 'Incomplete' }
  | { type: 'data'; caseId: string; value: DataReadiness }
  | { type: 'openDefect'; caseId: string; classification: Classification; severity: Severity; dataBlocker?: boolean }
  | { type: 'defect'; id: string; status?: DefectStatus; classification?: Classification; severity?: Severity }
