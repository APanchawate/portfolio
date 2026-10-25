// Synthetic case-level event history, never actual client records.
export type ExecutionStatus = 'Passed' | 'Failed' | 'Blocked'
export interface ScopeEvent { recordedOn: string; inScope: boolean }
export interface DueDateAgreement { agreedOn: string; dueOn: string | null }
export interface ExecutionRecord { recordedOn: string; status: ExecutionStatus }
export interface DemoUatCase {
  id: string
  workstream: string
  owner: string
  scopeHistory: readonly ScopeEvent[]
  dueDateHistory: readonly DueDateAgreement[]
  executions: readonly ExecutionRecord[]
}
export interface CaseAtSnapshot {
  id: string
  workstream: string
  owner: string
  dueOn: string | null
  firstExecutedOn: string | null
  blocked: boolean
}
export interface ExecutionSnapshot {
  date: string
  cases: readonly CaseAtSnapshot[]
  scope: number
  planned: number
  actual: number
  variance: number
  overdue: number
  undated: number
}

export const reportingDates: readonly string[] = Object.freeze(Array.from({ length: 56 }, (_, day) => {
  const date = new Date(Date.UTC(2027, 1, 1 + day))
  return date.getUTCDay() === 0 || date.getUTCDay() === 6 ? null : date.toISOString().slice(0, 10)
}).filter((date): date is string => date !== null))
const at = (index: number) => reportingDates[Math.min(39, Math.max(0, index))]
export const workstreams = ['Record-to-Report', 'Payables', 'Receivables', 'Assets', 'Intercompany', 'Financial Closing'] as const

export const demoUatCases: readonly DemoUatCase[] = Object.freeze(Array.from({ length: 222 }, (_, i): DemoUatCase => {
  const added = i < 180 ? 0 : i < 210 ? 9 : 24
  const initialDue = i % 13 === 0 ? null : i < 180 ? 3 + Math.floor(i / 180 * 32) : Math.min(38, added + 3 + i % 10)
  const dueDateHistory: DueDateAgreement[] = [{ agreedOn: at(added), dueOn: initialDue === null ? null : at(initialDue) }]
  if (initialDue === null && i % 2 === 0) dueDateHistory.push({ agreedOn: at(Math.max(added + 2, 16)), dueOn: at(Math.max(added + 7, 25)) })
  if (initialDue !== null && i % 17 === 0 && added < 22) dueDateHistory.push({ agreedOn: at(22), dueOn: at(Math.min(39, initialDue + 5)) })
  const scopeHistory: ScopeEvent[] = [{ recordedOn: at(added), inScope: true }]
  if (i >= 12 && i < 30) scopeHistory.push({ recordedOn: at(18), inScope: false })
  if (i >= 110 && i < 118) scopeHistory.push({ recordedOn: at(31), inScope: false })
  const executions: ExecutionRecord[] = []
  const intended = initialDue === null ? Math.max(added + 6, 27) : initialDue + i % 7 - 1
  if (i % 11 !== 0 && intended < 40) {
    if (i % 7 === 0) executions.push({ recordedOn: at(intended), status: 'Blocked' })
    const firstCompleted = intended + (i % 7 === 0 ? 3 : 0)
    if (firstCompleted < 40) {
      executions.push({ recordedOn: at(firstCompleted), status: i % 5 === 0 ? 'Failed' : 'Passed' })
      if (i % 5 === 0 && firstCompleted + 2 < 40) executions.push({ recordedOn: at(firstCompleted + 2), status: 'Passed' })
    }
  } else if (i % 11 === 0 && i % 2 === 0) executions.push({ recordedOn: at(Math.min(38, intended)), status: 'Blocked' })
  return Object.freeze({ id: `DEMO-UAT-${String(i + 1).padStart(3, '0')}`, workstream: workstreams[i % workstreams.length], owner: `Illustrative tester ${i % 12 + 1} / WS Lead`, scopeHistory: Object.freeze(scopeHistory.map(event => Object.freeze(event))), dueDateHistory: Object.freeze(dueDateHistory.map(event => Object.freeze(event))), executions: Object.freeze(executions.map(event => Object.freeze(event))) })
}))

// Each reporting point reads only events known at that cutoff; later changes never rewrite an earlier point.
export function createSnapshot(date: string, source: readonly DemoUatCase[] = demoUatCases): ExecutionSnapshot {
  const distinct = new Set<string>()
  const cases: CaseAtSnapshot[] = []
  for (const item of source) {
    if (distinct.has(item.id)) throw new Error(`Duplicate synthetic case identity: ${item.id}`)
    distinct.add(item.id)
    const scope = [...item.scopeHistory].filter(event => event.recordedOn <= date).sort((a, b) => a.recordedOn.localeCompare(b.recordedOn)).at(-1)
    if (!scope?.inScope) continue
    const agreement = [...item.dueDateHistory].filter(event => event.agreedOn <= date).sort((a, b) => a.agreedOn.localeCompare(b.agreedOn)).at(-1)
    const recorded = [...item.executions].filter(event => event.recordedOn <= date).sort((a, b) => a.recordedOn.localeCompare(b.recordedOn))
    const firstExecution = recorded.find(event => event.status === 'Passed' || event.status === 'Failed')
    cases.push(Object.freeze({ id: item.id, workstream: item.workstream, owner: item.owner, dueOn: agreement?.dueOn ?? null, firstExecutedOn: firstExecution?.recordedOn ?? null, blocked: !firstExecution && recorded.at(-1)?.status === 'Blocked' }))
  }
  const planned = cases.filter(item => item.dueOn !== null && item.dueOn <= date).length
  const actual = cases.filter(item => item.firstExecutedOn !== null).length
  return Object.freeze({ date, cases: Object.freeze(cases), scope: cases.length, planned, actual, variance: actual - planned, overdue: cases.filter(item => item.dueOn !== null && item.dueOn <= date && item.firstExecutedOn === null).length, undated: cases.filter(item => item.dueOn === null).length })
}
export const dailySnapshots: readonly ExecutionSnapshot[] = Object.freeze(reportingDates.map(date => createSnapshot(date)))
export const weeklySnapshots: readonly ExecutionSnapshot[] = Object.freeze(dailySnapshots.filter((_, i) => i % 5 === 4))

export function changesSince(date: string, previous: string | null, source: readonly DemoUatCase[] = demoUatCases) {
  const after = previous ?? reportingDates[0]
  let added = 0, removed = 0, dueDateRevisions = 0
  for (const item of source) {
    for (const event of item.scopeHistory) {
      if (event.recordedOn > after && event.recordedOn <= date) {
        if (event.inScope) added++
        else removed++
      }
    }
    dueDateRevisions += item.dueDateHistory.slice(1).filter(event => {
      const inScopeAtUpdate = [...item.scopeHistory].filter(scope => scope.recordedOn <= event.agreedOn).sort((a, b) => a.recordedOn.localeCompare(b.recordedOn)).at(-1)?.inScope
      return inScopeAtUpdate && event.agreedOn > after && event.agreedOn <= date
    }).length
  }
  return { added, removed, dueDateRevisions }
}
export function workstreamSummary(snapshot: ExecutionSnapshot) {
  return workstreams.map(workstream => {
    const cases = snapshot.cases.filter(item => item.workstream === workstream)
    return { workstream, scope: cases.length, planned: cases.filter(item => item.dueOn !== null && item.dueOn <= snapshot.date).length, actual: cases.filter(item => item.firstExecutedOn !== null).length, overdue: cases.filter(item => item.dueOn !== null && item.dueOn <= snapshot.date && item.firstExecutedOn === null).length, undated: cases.filter(item => item.dueOn === null).length, blocked: cases.filter(item => item.blocked).length }
  }).sort((a, b) => b.overdue - a.overdue || b.undated - a.undated)
}
export const shortDate = (value: string) => new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`))
