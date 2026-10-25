import Localized from '../i18n/Localized'
import { useId, useState } from 'react'
import { managementStages, phaseWeekCoverage, stabilizationWindow, timelinePhases } from './phaseTimelineData'
import type { UatDuration } from './phaseTimelineData'
import { illustrativeEvidenceKpi as legacyEvidence } from './evidenceData'
import { useOptionalScenario } from './scenario/ScenarioContext'
import { snapshot } from './scenario/engine'

export default function UatPhaseTimeline() {
  const id = useId()
  const scenario = useOptionalScenario()
  const metrics = scenario ? snapshot(scenario.state, scenario.state.filters) : null
  const evidence = metrics ? {required:metrics.actual,complete:metrics.completeEvidence,incomplete:metrics.missingEvidence+metrics.incompleteEvidence,percentage:metrics.evidenceCompliance} : legacyEvidence
  const [duration, setDuration] = useState<UatDuration>(12)
  const [selected, setSelected] = useState('planning-readiness')
  const phase = timelinePhases.find(item => item.id === selected)!
  const weeks = Array.from({ length: duration }, (_, index) => index + 1)
  const stabilization = stabilizationWindow(duration)
  return <Localized>{<div className="enterprise-phase-timeline">
    <h4 className="dc-module-heading">UAT Planning, Execution & Readiness</h4>
    <p className="uat-explanation">UAT Planning &amp; Readiness establishes scope, due-date commitments and prerequisites before formal execution. Formal UAT lasts approximately 2–3 months in my project experience. These overlapping management stages are illustrative and project-dependent—not mandatory ISTQB or SAP phases.</p>
    <div className="phase-management-stages" role="group" aria-label="Four overlapping UAT management stages">{managementStages.map(stage => <button type="button" key={stage.number} aria-pressed={phase.stage === stage.number} aria-controls={`${id}-detail`} onClick={() => setSelected(stage.focusId)} title={stage.window}><small>Stage {stage.number}</small><strong>{stage.title}</strong><span>{stage.window}</span></button>)}</div>
    <p className="phase-duration-note">Stages describe management focus, not a sequential handover. Execution, defect management, retesting, evidence capture and reporting overlap; readiness evidence is accumulated throughout UAT and consolidated toward completion.</p>
    <div className="phase-toolbar"><div className="uat-week-picker" role="group" aria-label="Illustrative formal UAT duration">{([8, 12] as const).map(value => <button key={value} type="button" aria-pressed={duration === value} onClick={() => setDuration(value)}>{value}-week example</button>)}</div><p>Illustrative example — not actual programme data.</p></div>
    <p className="phase-duration-note">The planning and readiness lead-in length is illustrative and not fixed. The final ≈15 days are shown as <strong>15 calendar days</strong> (just over two weeks), starting within UAT week {stabilization.firstWeek}. Changing this example only changes the timeline.</p>
    <div className="phase-legend" aria-label="Timeline legend"><span>Preparation before UAT · cyan</span><span>Ongoing / as needed · purple</span><span>Intensive final period · outlined cyan</span></div>
    <div className="uat-scroll" role="region" aria-label={`${duration}-week formal UAT timeline with separate UAT Planning & Readiness period; scroll horizontally on narrow screens`} tabIndex={0}>
      <table className="enterprise-phase-table" style={{ minWidth: duration === 12 ? 940 : 740 }}>
        <caption>Select a phase name to inspect its purpose, my contribution and management outputs. Bars show coordination windows, not daily effort or a guarantee of fix availability.</caption>
        <colgroup><col className="phase-name-column"/><col className="phase-pre-column"/>{weeks.map(week => <col key={week}/>)}</colgroup>
        <thead><tr className="phase-window-head"><th scope="col" rowSpan={2}>Activity</th><th scope="col" rowSpan={2}>UAT Planning &amp; Readiness<br/><small>Before formal UAT</small></th><th scope="colgroup" colSpan={duration}>→ Formal UAT · {duration} weeks →<br/><small>UAT Kickoff &amp; Stakeholder Alignment · opening milestone</small></th></tr><tr>{weeks.map(week => <th key={week} scope="col">W{week}</th>)}</tr></thead>
        <tbody>{timelinePhases.map(item => <tr key={item.id} className={`${selected === item.id ? 'phase-selected' : ''} ${item.intensive ? 'phase-intensive-row' : ''}`}>
          <th scope="row"><button type="button" aria-pressed={selected === item.id} aria-controls={`${id}-detail`} onClick={() => setSelected(item.id)} title={item.purpose}>{item.name}{item.governanceLabel && <small className="phase-evidence-guidance">{item.governanceLabel}</small>}</button></th>
          <td className="phase-pre-cell">{item.preparation && <span className="phase-pre-bar" aria-label="Preparation before formal UAT">Prepare</span>}</td>
          {weeks.map(week => {
            const coverage = phaseWeekCoverage(item, duration, week)
            const label = coverage.width ? item.intensive ? `Intensive stabilization: ${Math.round(coverage.width * 7 / 100)} calendar days of week ${week}` : `Coordination window in UAT week ${week}; as needed` : 'Outside this activity window'
            return <td key={week} title={label}><span className="uat-sr-only">{label}</span>{coverage.width > 0 && <span aria-hidden="true" className={`phase-window-bar ${item.intensive ? 'phase-intensive-bar' : ''}`} style={{ marginLeft: `${coverage.offset}%`, width: `${coverage.width}%` }}/>}</td>
          })}
        </tr>)}</tbody>
      </table>
    </div>
    <div className="phase-selected-detail" id={`${id}-detail`} role="status" aria-live="polite">
      <h5>{phase.name}</h5>
      <p className="phase-stage-context">Stage {phase.stage} · {managementStages.find(stage => stage.number === phase.stage)!.title}</p>
      <p className="phase-selected-window">{phase.preparation ? 'Before the formal UAT window' : phase.intensive ? `Final ≈15 calendar days · part of week ${stabilization.firstWeek} through week ${duration}` : `Formal UAT weeks 1–${duration} · ongoing / as needed`}</p>
      {phase.governanceLabel && <p className="phase-evidence-guidance">{phase.governanceLabel}</p>}
      <dl><div><dt>Purpose</dt><dd>{phase.purpose}</dd></div><div><dt>My contribution</dt><dd><ul>{phase.contribution.map(text => <li key={text}>{text}</li>)}</ul></dd></div><div><dt>Key management outputs</dt><dd>{phase.outputs}</dd></div></dl>
      {phase.evidenceNote && <p className="phase-evidence-note">{phase.evidenceNote}</p>}
    </div>
    <div className="phase-evidence-kpi" id="uat-evidence-completeness" tabIndex={-1} role="group" aria-labelledby={`${id}-evidence-title`}>
      <h5 id={`${id}-evidence-title`}>Illustrative Evidence Completeness</h5>
      <p>{scenario ? 'Shared synthetic scenario: market, product and reporting-date filters apply. The 8-/12-week selector changes this timeline illustration only.' : 'Separate synthetic snapshot of executed cases; unchanged by the 8-/12-week timeline selector.'} Evidence completeness is distinct from execution completion.</p>
      <dl>{[
        ['Executed test cases requiring evidence', evidence.required],
        ['Test cases meeting evidence requirements', evidence.complete],
        ['Missing or incomplete evidence', evidence.incomplete],
        ['Evidence completeness', evidence.percentage === null ? 'Not applicable' : `${evidence.percentage.toFixed(1)}%`],
      ].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      <p>Completeness = cases meeting agreed evidence requirements ÷ executed cases requiring evidence. Requirements vary by scenario; cases not requiring evidence are excluded. Attachment presence alone does not prove evidence quality or business acceptance.</p>
    </div>
    <p className="uat-explanation"><strong>Continuous work, intensified focus:</strong> defect triage, fixing coordination and retesting run throughout UAT as issues and fixes arise. The final period increases focus on critical issues; business test execution, reporting and remaining commitments continue. Open defects and risks remain visible for accountable decisions—this is not a requirement to close every defect or a release approval.</p>
  </div>}</Localized>
}
