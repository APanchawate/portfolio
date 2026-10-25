// Synthetic teaching examples only; no programme data or internal identifiers.
export const weeks = [1, 2, 3, 4, 5, 6, 7, 8]
export const plannedCapacity = [15, 30, 50, 70, 85, 95, 100, 100]
export const actualCapacity = [12, 25, 44, 62, 80, 92, 98, 100]
export const plannedExecution = [2, 8, 22, 45, 70, 88, 97, 100]
export const actualExecution = [1, 5, 15, 32, 55, 77, 91, 98]
export const passedExecution = [0, 3, 10, 23, 43, 65, 82, 93]
export const workflow = [
  { name: 'Submission', role: 'Business tester', detail: 'Record the failed scenario, expected and actual behaviour, impact and supporting evidence in Jira; link the Xray execution.' },
  { name: 'Quality review', role: 'Test coordination', detail: 'Check reproducibility, evidence and completeness. Request clarification from the tester when information is missing.' },
  { name: 'Classification', role: 'Test coordination & stakeholders', detail: 'Use the Defect Classification field to distinguish implementation, test data, training, migration and other causes; align severity with business impact.' },
  { name: 'Assignment', role: 'Product Team & technical owner', detail: 'Agree the responsible owner, dependencies and target fixing date. Escalate unclear ownership or overdue business-critical issues.' },
  { name: 'Resolution', role: 'Technical owner', detail: 'Investigate and deliver the fix or agreed corrective action. Test coordination follows up on status and makes blockers visible.' },
  { name: 'Retesting', role: 'Business tester', detail: 'Re-run the affected scenario and capture evidence in Xray. Confirm the expected result or reopen the issue if it persists.' },
  { name: 'Closure', role: 'Responsible defect owner / tester', detail: 'Close according to the agreed process after successful retesting and evidence review. Closure contributes to readiness visibility; it does not authorize release.' },
  { name: 'Reopening', role: 'Tester & responsible owner', detail: 'If retesting fails, reopen the Jira issue and return it to assignment and resolution with updated evidence. Keep stakeholders informed of the remaining risk.' },
]
