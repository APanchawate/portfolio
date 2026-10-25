import Localized from '../i18n/Localized'
import { useState } from 'react'
import { assessReadiness, initialReadiness, initialThresholds } from './data'
import type { ReadinessInput } from './data'

const inputs: { key: keyof ReadinessInput; label: string; max: number; hint: string }[] = [
  { key: 'execution', label: 'Test execution completion', max: 100, hint: 'Executed cases as a share of agreed scope; executed does not mean passed.' },
  { key: 'coverage', label: 'Business-process coverage', max: 100, hint: 'Share of in-scope business processes with completed validation evidence in this example.' },
  { key: 'critical', label: 'Open critical defects', max: 20, hint: 'Unresolved critical issues requiring accountable stakeholder attention.' },
  { key: 'evidence', label: 'Evidence completeness', max: 100, hint: 'Share of required test evidence complete and reviewable.' },
]
export default function ReadinessSimulator() {
  const [values, setValues] = useState(initialReadiness)
  const [thresholds, setThresholds] = useState(initialThresholds)
  const assessment = assessReadiness(values, thresholds)
  return <Localized>{<>
    <div className="dc-readiness-grid"><div className="dc-controls">{inputs.map(input => <label key={input.key} htmlFor={`dc-${input.key}`}>
      <span>{input.label}<output htmlFor={`dc-${input.key}`}>{values[input.key]}{input.max === 100 ? '%' : ''}</output></span>
      <input id={`dc-${input.key}`} type="range" min={0} max={input.max} step={1} value={values[input.key]} aria-describedby={`dc-${input.key}-hint`} onChange={event => setValues(previous => ({ ...previous, [input.key]: Number(event.target.value) }))}/>
      <small id={`dc-${input.key}-hint`}>{input.hint}</small>
    </label>)}</div>
    <div className="dc-assessment" role="status" aria-live="polite"><p className="kicker">ILLUSTRATIVE ASSESSMENT</p><h4>{assessment.status}</h4><ul>{assessment.reasons.map(reason => <li key={reason}>{reason}</li>)}</ul><p>Meeting these thresholds does not establish business acceptance or authorize a release.</p></div></div>
    <details className="dc-thresholds"><summary>Configure demonstration thresholds</summary><p>Below-target percentages within 10 points prompt review; larger gaps or critical defects above the configured maximum prompt attention.</p><div className="dc-threshold-grid">{inputs.map(input => <label key={input.key} htmlFor={`dc-target-${input.key}`}>{input.key === 'critical' ? 'Maximum open critical defects' : `Minimum ${input.label.toLowerCase()} (%)`}<input id={`dc-target-${input.key}`} type="number" min={0} max={input.max} step={1} value={thresholds[input.key]} onChange={event => setThresholds(previous => ({ ...previous, [input.key]: Math.min(input.max, Math.max(0, Math.round(Number(event.target.value) || 0))) }))}/></label>)}</div></details>
    <p className="uat-explanation">Real release decisions require project-specific exit criteria, business acceptance and accountable approval. This model omits pass rate, risk acceptance and other programme conditions; it is not a release recommendation.</p>
  </>}</Localized>
}
