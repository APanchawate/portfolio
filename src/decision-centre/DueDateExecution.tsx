import Localized from '../i18n/Localized'
import ExploreDetails from '../ExploreDetails'
import { useId, useMemo, useState } from 'react'
import { changesSince, dailySnapshots, weeklySnapshots, workstreamSummary, shortDate } from './dueDateData'
import type { ExecutionSnapshot } from './dueDateData'
import { useOptionalScenario } from './scenario/ScenarioContext'
import { forecast, scenarioHistory, scopeChanges } from './scenario/engine'
import { reportingDates } from './dueDateData'
import MetricHelp from './scenario/MetricHelp'
import { ScopeActions } from './scenario/ScopeChanges'

export default function DueDateExecution() {
  const id = useId()
  const [view, setView] = useState<'daily' | 'weekly'>('daily')
  const [legacyDate, setLegacyDate] = useState(dailySnapshots[24].date)
  const scenario = useOptionalScenario()
  const history = useMemo(() => scenario ? scenarioHistory(scenario.state) : dailySnapshots, [scenario?.state.cases, scenario?.state.defects, scenario?.state.filters.market, scenario?.state.filters.product])
  const selectedDate = scenario?.state.filters.date ?? legacyDate
  const setSelectedDate = (date: string) => scenario ? scenario.dispatch({ type: 'filters', filters: { date } }) : setLegacyDate(date)
  const prediction = scenario ? forecast(scenario.state, scenario.state.filters) : null
  const [workstream, setWorkstream] = useState('All workstreams')
  const points = view === 'daily' ? history : scenario ? history.filter((_, index) => index % 5 === 4 || history[index].date === selectedDate) : weeklySnapshots
  const selectedIndex = Math.max(0, points.findIndex(point => point.date === selectedDate))
  const selected = points[selectedIndex]
  const previous = points[selectedIndex - 1]?.date ?? null
  const changes = scenario ? scopeChanges(scenario.state, { ...scenario.state.filters, date: selected.date }, previous ?? reportingDates[0]) : changesSince(selected.date, previous)
  const summary = workstreamSummary(selected)
  const overdue = selected.cases.filter(item => item.dueOn !== null && item.dueOn <= selected.date && item.firstExecutedOn === null && (workstream === 'All workstreams' || item.workstream === workstream))
  const max = Math.ceil(Math.max(1, ...history.map(point => point.scope)) / 50) * 50
  const x = (index: number) => 64 + index / (points.length - 1) * 530
  const y = (value: number) => 228 - value / max * 180
  const stepLine = (key: 'scope' | 'planned' | 'actual') => points.filter(point => !scenario || key !== 'actual' || point.date <= selectedDate).map((point, i) => `${i ? `${x(i)},${y(points[i - 1][key])} ` : ''}${x(i)},${y(point[key])}`).join(' ')
  const describe = (point: ExecutionSnapshot) => `${shortDate(point.date)}: scope ${point.scope}, planned due ${point.planned}, ${scenario && point.date > selectedDate ? 'actual not reported at the current cutoff; select this date to inspect its snapshot' : `executed ${point.actual}, variance ${point.variance} cases`}`
  function switchView(next: 'daily' | 'weekly') {
    const options = next === 'daily' ? history : scenario ? history.filter((_, index) => index % 5 === 4 || history[index].date === selectedDate) : weeklySnapshots
    // Keep the selected reporting date, or choose its week-ending snapshot when moving to weekly.
    const point = options.find(item => item.date >= selected.date) ?? options[options.length - 1]
    setView(next); setSelectedDate(point.date)
  }
  return <Localized>{<div className="due-execution" id="due-date-execution" tabIndex={-1}>
    <h4 className="dc-module-heading">UAT Execution Forecast &amp; Schedule Intelligence</h4>
    <p className="uat-explanation">Select a reporting date or tap the chart to inspect a snapshot. Moving the pointer does not change your reporting cutoff.</p>
    <p className="uat-data-note">Illustrative example — not actual programme data. 1 February–26 March 2027 · 40 business-day snapshots.</p>
    {scenario && <details className="dc-thresholds"><summary>Simulate execution timing & scope</summary><p className="uat-explanation">Timing changes recompute counterfactual dates for selected non-historical cases, capped at ±20 business days from the seed. They never change due dates or permit execution before scope inclusion or data readiness. Scope/evidence/defect edits are dated events; use Undo or Reset for reversal.</p><div className="scenario-actions"><button type="button" onClick={() => scenario.dispatch({type:'timing',days:3})}>Delay execution +3 business days</button><button type="button" onClick={() => scenario.dispatch({type:'timing',days:-2})}>Faster execution −2 business days</button></div><ScopeActions/></details>}
    <div className="due-toolbar"><div className="uat-week-picker" role="group" aria-label="Reporting frequency">{(['daily', 'weekly'] as const).map(option => <button key={option} type="button" aria-pressed={view === option} onClick={() => switchView(option)}>{option === 'daily' ? 'Daily' : 'Weekly'}</button>)}</div>
      <label htmlFor={`${id}-date`}>{view === 'daily' ? 'Reporting date' : scenario ? 'Weekly / current-cutoff snapshot' : 'Week-ending reporting date'}<select id={`${id}-date`} value={selected.date} onChange={event => setSelectedDate(event.target.value)}>{points.map(point => <option key={point.date} value={point.date}>{shortDate(point.date)} 2027</option>)}</select></label>
    </div>
    <div className="uat-legend"><span className="due-scope-label">Total UAT scope · dotted</span><span className="uat-planned">Cumulative planned · agreed due dates · dashed</span><span className="uat-actual">Cumulative actual executed · solid</span></div>
    <div className="uat-scroll" role="region" aria-label="Due-date-driven execution chart; scroll horizontally on narrow screens" tabIndex={0}>
      <svg className="uat-chart due-chart" viewBox="0 0 660 290" role="img" aria-labelledby={`${id}-chart-title ${id}-chart-description`}>
        <title id={`${id}-chart-title`}>Total scope, agreed due-date plan and actual first executions</title>
        <desc id={`${id}-chart-description`}>Synthetic {view} end-of-day snapshots counting distinct in-scope cases. Scope and commitments vary over time. Exact values are available through the date selector and data table. Actual includes first recorded Passed or Failed outcomes; Blocked-only cases do not count as executed.</desc>
        <text x="64" y="22">Distinct in-scope test cases (count)</text>
        {[0, 1, 2, 3, 4, 5].map(tick => <g key={tick}><line x1="64" x2="594" y1={y(tick * max / 5)} y2={y(tick * max / 5)} className="uat-gridline"/><text x="52" y={y(tick * max / 5) + 4} textAnchor="end">{tick * max / 5}</text></g>)}
        <line x1={x(selectedIndex)} x2={x(selectedIndex)} y1="48" y2="228" className="uat-selection"/>
        <polyline points={stepLine('scope')} className="uat-line due-line-scope"/>
        <polyline points={stepLine('planned')} className="uat-line uat-line-planned"/>
        <polyline points={stepLine('actual')} className="uat-line uat-line-actual"/>
        {points.map((point, index) => <g key={point.date} onClick={() => setSelectedDate(point.date)}><rect x={x(index) - Math.min(24, 265 / points.length)} y="42" width={Math.min(48, 530 / points.length)} height="190" fill="transparent"><title>{describe(point)}</title></rect>{(view === 'weekly' || index % 10 === 0 || index === points.length - 1) && <text x={x(index)} y="250" textAnchor={index === 0 ? 'start' : index === points.length - 1 ? 'end' : 'middle'}>{shortDate(point.date)}</text>}</g>)}
        {(['scope', 'planned', 'actual'] as const).map(key => <circle key={key} cx={x(selectedIndex)} cy={y(selected[key])} r="4" className={`due-selected-${key}`} pointerEvents="none"/>)}
        <text x="330" y="278" textAnchor="middle">{view === 'daily' ? 'Daily business-day reporting snapshots' : scenario ? 'Friday snapshots + current cutoff, if partial' : 'Weekly Friday reporting snapshots'}</text>
      </svg>
    </div>
    <div className="due-navigation"><button type="button" disabled={selectedIndex === 0} onClick={() => setSelectedDate(points[selectedIndex - 1].date)}>← Previous snapshot</button><button type="button" disabled={selectedIndex === points.length - 1} onClick={() => setSelectedDate(points[selectedIndex + 1].date)}>Next snapshot →</button></div>
    <div role="status" aria-live="polite"><p className="due-snapshot-label">{shortDate(selected.date)} 2027 · End of reporting day · {previous ? `Changes since ${shortDate(previous)}` : 'Opening reporting period; initial scope is the baseline'}</p>
      <dl className="due-metrics">{[
        ['Total in-scope cases', selected.scope], ['Planned due by date', selected.planned], ['Actual executed cases', selected.actual], ['Execution variance (actual − planned)', `${selected.variance > 0 ? '+' : ''}${selected.variance} cases`],
        ['Overdue & unexecuted', selected.overdue], ['Without agreed due dates', selected.undated], ['Scope movement', `+${changes.added} / −${changes.removed}`], ['Due-date updates / revisions', changes.dueDateRevisions],
        ...(prediction ? [['Forecast completion', prediction.date ? shortDate(prediction.date) + ' ' + prediction.date.slice(0,4) : 'Not estimable']] : []),
      ].map(([label, value]) => <div key={label}><dt>{label}<MetricHelp label={String(label)}/></dt><dd>{value}</dd></div>)}</dl>
    </div>
    <ExploreDetails heading="Explore Execution Interpretation & Workstream Detail">
    <p className="uat-explanation">Execution due dates are aligned with testers and Workstream Leads. These commitments form a cumulative planning baseline, which is compared with actual execution and evolving UAT scope through daily and weekly management reporting.</p>
    {prediction && <p className="uat-explanation"><strong>Illustrative forecast based on synthetic execution data.</strong> {prediction.reason}. Remaining: {prediction.remaining} cases; recent throughput: {prediction.throughput.toFixed(1)} cases/business day. Actual execution is plotted only through the selected reporting date; future scope/planned lines show synthetic seed commitments, not completed outcomes.</p>}
    <p className="uat-explanation">{view === 'weekly' ? 'Weekly values are Friday snapshots (plus the selected cutoff for a partial week), not sums of daily cumulative counts. Scope movements and due-date updates cover the interval since the previous displayed Friday (or the cycle opening).' : 'Daily values are business-day closing snapshots. Scope movements and due-date updates cover the interval since the previous reporting day.'} Removing executed cases or revising due dates can lower a later curve point without rewriting earlier reports.</p>
    <div className="due-management"><h5>Management follow-up</h5><p>{selected.variance < 0 ? `${-selected.variance} fewer cases executed than due in aggregate.` : 'Aggregate actual execution meets or exceeds the due-date plan.'} {selected.overdue} due cases remain unexecuted; early execution of other cases can offset their impact on aggregate variance.</p>
      <p>{changes.added || changes.removed ? `Scope changed by +${changes.added} / −${changes.removed}; confirm coverage, assignments and commitments with the WS Leads.` : 'No scope movement in this reporting interval.'} {selected.undated ? `Agree dates for ${selected.undated} undated cases; they remain in scope but are absent from the planned curve.` : 'All in-scope cases have an agreed date.'}</p>
      <p>Discuss tester availability, blocker ownership, retest support and workload rebalancing with the most affected workstreams. Agree and record any revised commitments; preserve the previous snapshots.</p>
    </div>
    <div className="uat-scroll" role="region" aria-label="Workstream follow-up table; scroll horizontally on narrow screens" tabIndex={0}><table className="due-table"><caption>Workstream follow-up · sorted by overdue cases</caption><thead><tr>{['Workstream', 'Scope', 'Due', 'Executed', 'Overdue', 'Undated', 'Blocked only'].map(label => <th scope="col" key={label}>{label}</th>)}</tr></thead><tbody>{!selected.scope&&<tr><td colSpan={7}>No in-scope cases match this market, product and reporting date.</td></tr>}{summary.map(row => <tr key={row.workstream}><th scope="row">{row.workstream}</th><td>{row.scope}</td><td>{row.planned}</td><td>{row.actual}</td><td>{row.overdue}</td><td>{row.undated}</td><td>{row.blocked}</td></tr>)}</tbody></table></div>
    </ExploreDetails>
    <details className="dc-thresholds"><summary>Which cases are overdue?</summary><label className="due-filter" htmlFor={`${id}-workstream`}>Workstream<select id={`${id}-workstream`} value={workstream} onChange={event => setWorkstream(event.target.value)}><option>All workstreams</option>{summary.map(row => <option key={row.workstream}>{row.workstream}</option>)}</select></label>
      <p className="uat-explanation" role="status">{overdue.length} overdue, unexecuted cases in this selection. All identifiers below are synthetic.</p>
      <div className="uat-scroll due-overdue-list" role="region" aria-label="Synthetic overdue cases" tabIndex={0}><table className="due-table"><caption>Cases due on or before {shortDate(selected.date)}, without a qualifying first execution</caption><thead><tr>{['Synthetic case', 'Workstream', 'Coordination owner', 'Agreed due date', 'Recorded status'].map(label => <th key={label} scope="col">{label}</th>)}</tr></thead><tbody>{!overdue.length&&<tr><td colSpan={5}>No overdue, unexecuted cases match this selection.</td></tr>}{overdue.map(item => <tr key={item.id}><th scope="row">{item.id}</th><td>{item.workstream}</td><td>{item.owner}</td><td>{shortDate(item.dueOn!)}</td><td>{item.blocked ? 'Blocked only' : 'No qualifying execution'}</td></tr>)}</tbody></table></div>
    </details>
    <details className="dc-thresholds"><summary>Counting rules & historical snapshots</summary><ul className="due-rules">
      <li>Each point counts distinct cases in scope at that end-of-day cutoff, using only scope events and due-date agreements recorded by then. Scope is not a count of execution attempts.</li>
      <li>Planned = in-scope cases with an agreed due date on or before the reporting date. Undated cases remain in total scope but are excluded from planned counts.</li>
      <li>Actual = in-scope cases with a first recorded Passed or Failed outcome by the cutoff. A Blocked-only record is not a completed execution; it remains unexecuted until a Passed or Failed outcome is recorded. Not-started / in-progress cases also remain unexecuted.</li>
      <li>The source reporting framework also distinguishes Executing and To Do. This synthetic demonstration does not model them separately: they remain unexecuted until a qualifying Passed or Failed result. Its calculations are not a reproduction of the original reports.</li>
      <li>A failure counts as executed, not accepted. Retests, repeated attempts, later passes and later blocked statuses do not add another executed case or erase the first execution.</li>
      <li>Overdue = due on or before the reporting date and no qualifying first execution by that day’s close. Variance = actual minus planned, in cases; early execution can conceal individual overdue commitments.</li>
      <li>Scope and due-date histories are versioned. The curves are an as-reported, evolving baseline: later additions, removals or revised agreements affect subsequent points only. Replanning may lower planned counts; removing executed cases may lower actual counts.</li>
      <li>Daily = 40 business-day closing snapshots across eight weeks. Weekly = the eight Friday closing snapshots from those same daily records, never sums or averages. Changes are gross additions/removals and in-scope due-date updates since the previous displayed snapshot; opening in-scope cases form the initial baseline, not new additions. In the shared scenario, market/product filters apply consistently; evidence compliance is assessed separately against executed cases.</li>
    </ul></details>
    <details className="dc-thresholds"><summary>Inspect the {view} chart data</summary><div className="uat-scroll" role="region" aria-label="Exact execution chart data" tabIndex={0}><table className="due-table"><caption>Illustrative {view} snapshots · distinct in-scope cases</caption><thead><tr>{['Reporting date', 'Total scope', 'Planned due', 'Actual executed', 'Variance'].map(label => <th scope="col" key={label}>{label}</th>)}</tr></thead><tbody>{points.map(point => <tr key={point.date}><th scope="row">{shortDate(point.date)}</th><td>{point.scope}</td><td>{point.planned}</td><td>{scenario && point.date > selectedDate ? 'Not reported' : point.actual}</td><td>{scenario && point.date > selectedDate ? 'Not reported' : point.variance}</td></tr>)}</tbody></table></div></details>
  </div>}</Localized>
}
