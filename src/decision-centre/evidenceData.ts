// Independent synthetic evidence-review snapshot; no client data or linkage to the duration example.
export interface EvidenceReviewCase {
  id: string
  evidenceRequirement: string | null
  meetsAgreedRequirements: boolean
  attachmentPresent: boolean
}
const evidenceExamples = ['Expected/actual business result and transaction reference', 'Relevant screenshot with scenario context', 'Business result with a supporting log extract']
export const executedEvidenceCases: readonly EvidenceReviewCase[] = Object.freeze(Array.from({ length: 60 }, (_, index) => Object.freeze({
  id: `EVID-DEMO-${String(index + 1).padStart(2, '0')}`,
  evidenceRequirement: index < 48 ? evidenceExamples[index % evidenceExamples.length] : null,
  meetsAgreedRequirements: index < 42,
  // Some incomplete records have attachments: presence alone is not sufficient.
  attachmentPresent: index < 45,
})))
export function evidenceCompleteness(cases: readonly EvidenceReviewCase[]) {
  if (new Set(cases.map(item => item.id)).size !== cases.length) throw new Error('Evidence snapshot must contain distinct executed test cases')
  const required = cases.filter(item => item.evidenceRequirement !== null)
  const complete = required.filter(item => item.meetsAgreedRequirements).length
  return { required: required.length, complete, incomplete: required.length - complete, percentage: required.length ? complete / required.length * 100 : null }
}
export const illustrativeEvidenceKpi = Object.freeze(evidenceCompleteness(executedEvidenceCases))
