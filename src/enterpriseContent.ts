// Professional role statements supplied by the portfolio owner. Examples below are synthetic.
export const collaborationPartners = [
  ['22 Central Finance Product Teams', 'Finance processes, test-case relevance and business-scope decisions'],
  ['Product Contact Persons (PCPs)', 'Product-level clarification and coordinated follow-up'],
  ['Market Rollout Managers', 'Market inputs, rollout alignment and testing dependencies'],
  ['Market Business Testers', 'Execution commitments, results and appropriate evidence'],
  ['Implementation and Technical Partners', 'GAP case creation, technical fixes and support'],
]
export const scopeEngineeringStages = [
  { title: 'Market & Rollout Inputs', text: 'Central Rollout Management provides market requirements, company-code information and relevant scope inputs.' },
  { title: 'Master Repository Mapping', text: 'Map potentially relevant master test cases to company codes and Finance Products for review.' },
  { title: 'Scope Consolidation', text: 'Prepare a structured workbook with proposed coverage, validation status, tester assignments and execution due dates.' },
  { title: 'Product & Market Validation', text: 'Finance Product Teams and markets confirm relevant and non-relevant cases, missing scenarios and required GAP cases.' },
  { title: 'Quality & Readiness', text: 'Product Teams or partners create new GAP cases where needed. Central Test Management reviews quality against shared templates and coordinates testers and timing.' },
  { title: 'UAT Execution Preparation', text: 'Prepare the validated scope for Jira/Xray Test Plans, Test Executions, monitoring and reporting.' },
]
export const syntheticScopeRows = [
  { market: 'Market Alder', companyCode: 'F101', product: 'Record-to-Report', id: 'DEMO-SCOPE-01', description: 'Validate a fictional ledger reconciliation', validation: 'Product/market validated', tester: 'Demo tester A', due: 'UAT week 2' },
  { market: 'Market Birch', companyCode: 'F202', product: 'Payables', id: 'DEMO-SCOPE-02', description: 'Review a synthetic invoice exception', validation: 'Pending product review', tester: 'Demo tester B', due: 'Not yet agreed' },
  { market: 'Market Cedar', companyCode: 'F303', product: 'Intercompany', id: 'DEMO-SCOPE-03', description: 'Check a fictional cross-entity posting', validation: 'GAP scenario requested', tester: 'Assignment pending', due: 'Not yet agreed' },
]
// Broad professional experience only; no entity counts, country records or rollout dates.
export const rolloutStages = ['Scope Preparation', 'Execution Readiness', 'Ongoing UAT', 'Completed UAT'] as const
export interface RolloutRegion {
  name: string
  status: string
  activity: string
  phases: readonly typeof rolloutStages[number][]
}
export const rolloutRegions: readonly RolloutRegion[] = [
  { name: 'Europe', status: 'Completed UAT Experience', activity: 'Supported completed UAT through execution monitoring, defect and evidence follow-up and stakeholder reporting.', phases: ['Completed UAT'] },
  { name: 'North & South America', status: 'Completed UAT Experience', activity: 'Supported completed UAT across markets in the Americas, coordinating testing activities, workstream follow-up and automated KPI reporting.', phases: ['Completed UAT'] },
  { name: 'East Asia', status: 'Ongoing UAT Support', activity: 'Support concurrent UAT execution monitoring, tester coordination and reporting, connecting workstreams and stakeholders on outstanding issues.', phases: ['Ongoing UAT'] },
  { name: 'Western Europe', status: 'Rollout Preparation / Ongoing Support', activity: 'Prepare market-specific scope, map reusable master cases and coordinate business validation, quality reviews and execution readiness.', phases: ['Scope Preparation', 'Execution Readiness'] },
]
