import ExploreDetails from './ExploreDetails'
import Localized from './i18n/Localized'
import { ArrowUpRight, BarChart3, BrainCircuit, ClipboardCheck, Globe2, Settings2, ShieldCheck, Workflow } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import BackToTop from './navigation/BackToTop'
import { handleSectionLink } from './navigation/sectionNavigation'

interface ExplorationCard { title: string; text: string; icon: LucideIcon; destination: string; expandCase?: boolean }
export const explorationCards: readonly ExplorationCard[] = [
  { title: 'UAT Governance', text: 'Planning, scope preparation, execution monitoring and testing quality.', icon: ClipboardCheck, destination: 'scope-engineering' },
  { title: 'Jira/Xray Governance', text: 'Technical configuration, test repository governance and regression management.', icon: Settings2, destination: 'expertise' },
  { title: 'Automation Hub', text: 'Integrated automation for Test Plans, Test Executions, test cases, filters and dashboards.', icon: Workflow, destination: 'automation-hub', expandCase: true },
  { title: 'Reporting & KPIs', text: 'Execution planning, management dashboards, evidence and defect intelligence.', icon: BarChart3, destination: 'reporting-transformation' },
  { title: 'IT Project Coordination & Digital Transformation', text: 'International stakeholder coordination, delivery planning, risk and dependency tracking, management reporting and process modernization.', icon: Globe2, destination: 'experience' },
  { title: 'AI & Engineering', text: 'AI knowledge agents, Python development, GitHub Copilot, Playwright, debugging and intelligent workflow support.', icon: BrainCircuit, destination: 'ai-engineering' },
]
function NavigationCard({ card }: { card: ExplorationCard }) {
  const Icon = card.icon
  return <Localized>{<a className="expertise-navigation-card" href={`#${card.destination}`} onClick={event => handleSectionLink(event, card.destination, card.expandCase)}><Icon size={24} aria-hidden="true"/><h3>{card.title}</h3><p>{card.text}</p><ArrowUpRight className="navigation-card-arrow" size={17} aria-hidden="true"/></a>}</Localized>
}
export function ProfessionalOverview() {
  return <Localized>{<section className="section recruiter-overview" id="about" tabIndex={-1} aria-labelledby="overview-title"><p className="kicker">PROFESSIONAL OVERVIEW</p><h2 id="overview-title">Enterprise understanding. Technical delivery.</h2>
    <ExploreDetails heading="Explore Professional Profile"><div className="overview-card-grid">{[
      { title: 'Enterprise UAT Governance', text: 'International SAP S/4HANA Finance testing, market scope, execution monitoring, evidence and defect follow-up.', icon: ShieldCheck, destination: 'scope-engineering' },
      { title: 'Jira/Xray Technical Ownership', text: 'Configuration, custom fields, repository standards, dashboards, filters and regression infrastructure.', icon: Settings2, destination: 'expertise' },
      { title: 'Automation Engineering', text: 'An integrated Hub, Python/APIs, FastAPI, React/TypeScript, SQLite, reporting and AI-assisted workflows.', icon: Workflow, destination: 'automation-hub', expandCase: true },
    ].map(card => <NavigationCard key={card.title} card={card}/>)}</div>
    <div className="overview-context"><h3>Professional context</h3><p>Within a two-person internal Central Test Management team, I support Rollout Management, Finance Product Teams and markets with testing preparation, execution commitments, evidence and stakeholder follow-up.</p><p>I am the primary technical owner of testing-specific Jira/Xray configuration and custom fields, maintain the reusable master repository and develop automation for execution setup and reporting.</p></div></ExploreDetails><BackToTop/>
  </section>}</Localized>
}
export function ExpertiseExplorer() {
  return <Localized>{<section className="section expertise-explorer" id="explore-expertise" tabIndex={-1} aria-labelledby="explorer-title"><div className="section-head"><div><p className="kicker">CHOOSE YOUR PATH</p><h2 id="explorer-title">Explore My Expertise</h2></div><p>Choose an area to explore—from enterprise testing governance to hands-on automation engineering.</p></div><div className="expertise-navigation-grid">{explorationCards.map(card => <NavigationCard key={card.title} card={card}/>)}</div><BackToTop/></section>}</Localized>
}
