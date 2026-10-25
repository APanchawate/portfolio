import Localized from '../i18n/Localized'
import ExploreDetails from '../ExploreDetails'
import { Activity, Globe2, ShieldCheck, TriangleAlert } from 'lucide-react'
import { Kpis, percent } from './scenario/SharedUi'
import BackToTop from '../navigation/BackToTop'
import { useEffect, useState } from 'react'
import { showcaseDestinations } from '../resourceLinks'
import type { ShowcaseRequest } from '../resourceLinks'
import { ExampleChart, PhaseTimeline } from '../UatVisuals'
import Tabs from './Tabs'
import DueDateExecution from './DueDateExecution'
import RiskIntelligence from './RiskIntelligence'
import ScenarioReadiness from './scenario/ScenarioReadiness'
import ScopeChanges from './scenario/ScopeChanges'
import ScenarioControls, { ScenarioSummary } from './scenario/ScenarioControls'
import { ScenarioProvider, useScenario } from './scenario/ScenarioContext'
import MarketGovernance from './MarketGovernance'
import { interpretations } from './data'

const navigationLabels = ['UAT Execution', 'Defect & Quality Risks', 'Release Readiness', 'International Rollouts']
const navigationCards = [
  {description: 'Progress, forecasts and scope', icon: <Activity size={23}/>},
  {description: 'Defects, evidence and blockers', icon: <TriangleAlert size={23}/>},
  {description: 'Decision-support indicators', icon: <ShieldCheck size={23}/>},
  {description: 'Market-level testing oversight', icon: <Globe2 size={23}/>},
]
const modules = ['UAT Execution Control', 'Risk & Defect Intelligence', 'Release Readiness', 'Multi-Market Governance']
function ExecutionControl({ active, onChange }: { active: number; onChange: (index: number) => void }) {
  return <Localized>{<Tabs labels={['Execution Forecast','Scope Changes','Tester ramp-up','Phase timeline']} label="Execution control views" active={active} onChange={onChange}>
    {active === 0 ? <DueDateExecution/> : active === 1 ? <ScopeChanges/> : active === 2 ? <ExampleChart execution={false}/> : <PhaseTimeline/>}
  </Tabs>}</Localized>
}
function DecisionCentreContent({ showcaseRequest }: { showcaseRequest?: ShowcaseRequest | null }) {
  const { epoch, metrics } = useScenario()
  const [gadgetModified, setGadgetModified] = useState(false)
  useEffect(() => { setGadgetModified(false) }, [epoch])
  const [active, setActive] = useState(0)
  const [executionView, setExecutionView] = useState(0)
  const [riskView, setRiskView] = useState(0)
  const [readinessView, setReadinessView] = useState(0)
  const [riskKey, setRiskKey] = useState(0)
  const [requestedFocus, setRequestedFocus] = useState<string | null>(null)
  useEffect(() => {
    if (!showcaseRequest) return
    const destination = showcaseDestinations[showcaseRequest.target]
    setActive(destination.module); setExecutionView(destination.view); setRiskView(showcaseRequest.target === 'evidence' ? 1 : 0); setRiskKey(key => key + 1); setRequestedFocus(destination.focusId)
  }, [showcaseRequest])
  useEffect(() => {
    if (!requestedFocus) return
    const target = document.getElementById(requestedFocus)
    if (target) {
      target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
      target.focus({ preventScroll: true }); setRequestedFocus(null)
    }
  }, [requestedFocus, active, executionView])
  const interpretation = interpretations[active]
  return <Localized>{<section className="section decision-centre" id="decision-centre" aria-labelledby="dc-title" tabIndex={-1}>
    <div className="section-head"><div><p className="kicker">ENTERPRISE TESTING IN PRACTICE</p><h2 id="dc-title">Enterprise Test Management Decision Centre</h2></div><p>Explore how I turn testing progress, quality risks and international rollout activity into clear management visibility.</p></div>
    <div className="dc-surface">
      <p className="dc-disclaimer dc-compact-disclaimer">Interactive demonstration · Synthetic data<span className="uat-sr-only"> — not actual client or programme performance.</span></p>
      <div className="dc-overview-kpis"><Kpis items={[['Execution Progress', percent(metrics.executionCompletion)], ['Open Defects', metrics.openDefects], ['Test Scope', metrics.scope]]}/></div>
      <ScenarioSummary hasGadgetChanges={gadgetModified}/>
      <Tabs navigationWrapper={navigation => <ExploreDetails heading="Explore Advanced Decision Centre" className="dc-advanced-exploration">{navigation}<ScenarioControls hasGadgetChanges={gadgetModified} embedded hideSummary/></ExploreDetails>} labels={navigationLabels} cards={navigationCards} label="Decision Centre modules" active={active} onChange={setActive} onActivate={() => setRequestedFocus('dc-module-content')}>
        <h3 className="dc-module-title" id="dc-module-content" tabIndex={-1}>{modules[active]}</h3>
        <div key={epoch} onChangeCapture={() => setGadgetModified(true)}>{active === 0 ? <ExecutionControl active={executionView} onChange={setExecutionView}/> : active === 1 ? <RiskIntelligence key={riskKey} requestedView={riskView}/> : active === 2 ? <Tabs labels={['Readiness Assessment','Risk Drivers']} label="Readiness gadgets" active={readinessView} onChange={setReadinessView}><ScenarioReadiness drivers={readinessView===1}/></Tabs> : <MarketGovernance/>}</div>
      </Tabs>
      <ExploreDetails heading="Explore Management Interpretation"><dl className="dc-interpretation">{[['What it shows', interpretation.shows], ['Management value', interpretation.value], ['My contribution', interpretation.contribution]].map(([label, text]) => <div key={label}><dt>{label}</dt><dd>{text}</dd></div>)}</dl></ExploreDetails>
      <p className="uat-decision-note">Illustrative example — not actual programme data. I support governance, coordination and decision visibility; authorized stakeholders retain final release approval.</p>
    </div>
    <BackToTop/>
  </section>}</Localized>
}

export default function DecisionCentre(props: { showcaseRequest?: ShowcaseRequest | null }) {
  return <Localized>{<ScenarioProvider><DecisionCentreContent {...props}/></ScenarioProvider>}</Localized>
}
