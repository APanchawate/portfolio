import Localized from './i18n/Localized'
import { useState } from 'react'
import { weeks, plannedCapacity, actualCapacity, plannedExecution, actualExecution, passedExecution, workflow } from './decision-centre/uatData'

export function ExampleChart({ execution }: { execution: boolean }) {
  const [week, setWeek] = useState(4)
  const planned = execution ? plannedExecution : plannedCapacity
  const actual = execution ? actualExecution : actualCapacity
  const max = 100
  const x = (i: number) => 64 + i * 73
  const y = (value: number) => 218 - value / max * 176
  const line = (values: number[]) => values.map((value, i) => `${x(i)},${y(value)}`).join(' ')
  const unit = execution ? '%' : ' testers'
  const variance = actual[week] - planned[week]
  return <Localized>{<>
    <div className="uat-legend"><span className="uat-planned">Planned {execution ? 'executed' : 'active testers'} · dashed</span><span className="uat-actual">Actual {execution ? 'executed' : 'active testers'} · solid</span>{execution && <span className="uat-passed">Actual passed · dotted</span>}</div>
    <div className="uat-scroll" role="region" aria-label="Eight-week chart; scroll horizontally on narrow screens" tabIndex={0}>
      <svg className="uat-chart" viewBox="0 0 640 270" role="img" aria-labelledby={`uat-chart-title-${execution} uat-chart-desc-${execution}`}>
        <title id={`uat-chart-title-${execution}`}>{execution ? 'Cumulative test execution and passed tests' : 'Planned and actual active tester capacity'}</title>
        <desc id={`uat-chart-desc-${execution}`}>Illustrative example — not actual programme data. Eight weekly observations. Exact values are available through the week buttons below. {execution ? 'Executed includes passed, failed and other completed outcomes; passed is shown separately.' : 'Active testers represent participating people, not full-time equivalents or guaranteed throughput.'}</desc>
        <text x="64" y="20">{execution ? 'Cumulative tests (% of fixed scope)' : 'Active testers (people)'}</text>
        {[0, 1, 2, 3, 4, 5].map(tick => <g key={tick}><line x1="64" x2="575" y1={y(tick * max / 5)} y2={y(tick * max / 5)} className="uat-gridline"/><text x="52" y={y(tick * max / 5) + 4} textAnchor="end">{tick * max / 5}{execution ? '%' : ''}</text></g>)}
        <line x1={x(week)} x2={x(week)} y1="42" y2="218" className="uat-selection"/>
        <polyline points={line(planned)} className="uat-line uat-line-planned"/>
        <polyline points={line(actual)} className="uat-line uat-line-actual"/>
        {execution && <polyline points={line(passedExecution)} className="uat-line uat-line-passed"/>}
        {weeks.map((w, i) => <g key={w} onPointerEnter={() => setWeek(i)}>
          <rect x={x(i) - 25} y="40" width="50" height="180" fill="transparent"><title>{`Week ${w}: planned ${planned[i]}${unit}, actual ${actual[i]}${unit}${execution ? `, passed ${passedExecution[i]}%` : ''}`}</title></rect>
          <circle cx={x(i)} cy={y(actual[i])} r={i === week ? 5 : 3} className="uat-point"/>
          <text x={x(i)} y="240" textAnchor="middle">W{w}</text>
        </g>)}
        <text x="320" y="263" textAnchor="middle">Illustrative UAT week</text>
      </svg>
    </div>
    <div className="uat-week-picker" role="group" aria-label="Inspect exact weekly chart values">{weeks.map((w, i) => <button type="button" key={w} aria-pressed={week === i} onClick={() => setWeek(i)} title={`Inspect week ${w}`}>W{w}</button>)}</div>
    <p className="uat-detail" role="status">Week {week + 1}: planned <strong>{planned[week]}{unit}</strong> · actual <strong>{actual[week]}{unit}</strong> · {execution ? `execution variance ${variance} percentage points` : `capacity gap ${planned[week] - actual[week]} testers`}{execution && <> · passed <strong>{passedExecution[week]}%</strong></>}</p>
    <p className="uat-explanation">{execution ? 'Execution variance flags a delivery gap for management reporting and recovery discussions. It is a percentage-point gap against plan, not a forecast delay. Executed tests include failed outcomes; execution completion alone does not establish business acceptance.' : 'Availability gaps inform tester assignments, onboarding priorities and workload rebalancing with markets and Product Teams. Headcount alone does not determine execution speed: skills, working time and blockers also matter.'}</p>
  </>}</Localized>
}

export { default as PhaseTimeline } from './decision-centre/UatPhaseTimeline'

export function DefectWorkflow() {
  const [selected, setSelected] = useState(0)
  return <Localized>{<>
    <ol className="uat-defect-flow" aria-label="Illustrative defect lifecycle">{workflow.slice(0, 7).map((step, i) => <li key={step.name}><button type="button" aria-pressed={selected === i} onClick={() => setSelected(i)} title={`${step.role}: ${step.detail}`}><span>0{i + 1}</span>{step.name}<small>{step.role}</small></button>{i < 6 && <span className="uat-flow-arrow" aria-hidden="true">→</span>}</li>)}</ol>
    <div className="uat-reopen"><span aria-hidden="true">↩</span><button type="button" aria-pressed={selected === 7} onClick={() => setSelected(7)} title={workflow[7].detail}>Retest fails → Reopening → Assignment / Resolution</button></div>
    <p className="uat-detail" role="status"><strong>{workflow[selected].name} · {workflow[selected].role}</strong><br/>{workflow[selected].detail}</p>
    <p className="uat-explanation">Jira tracks classification, ownership and status; Xray connects testing context and retest evidence. I support quality review, stakeholder coordination, follow-up and escalation; technical owners deliver fixes. This is an illustrative operating flow, not a specific Jira configuration.</p>
  </>}</Localized>
}
