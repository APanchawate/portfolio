import Localized from './i18n/Localized'
import { ArrowUpRight, BrainCircuit, ChartNoAxesCombined, ClipboardCheck, Workflow } from 'lucide-react'
import { handleSectionLink } from './navigation/sectionNavigation'

const pillars = [
  { title: 'Enterprise Test Management', summary: 'International UAT governance and readiness.', href: 'projects', Icon: ClipboardCheck },
  { title: 'Automation Engineering', summary: 'Python and Jira/Xray API workflows.', href: 'automation-hub', Icon: Workflow },
  { title: 'Reporting & Test Intelligence', summary: 'KPIs, risk signals and decision visibility.', href: 'reporting-transformation', Icon: ChartNoAxesCombined },
  { title: 'AI & Digital Transformation', summary: 'Knowledge assistants and AI-assisted engineering.', href: 'explore-expertise', Icon: BrainCircuit },
] as const

export default function PortfolioPathways() {
  return <Localized>{<section className="section portfolio-pathways" id="portfolio-guide" aria-labelledby="portfolio-guide-title" tabIndex={-1}>
    <div className="section-head"><div><p className="kicker">EXPLORE BY CAPABILITY</p><h2 id="portfolio-guide-title">Technical depth<br/><em>when you need it.</em></h2></div>
      <p>Open the area most relevant to your role.</p></div>
    <div className="portfolio-pathways-grid">{pillars.map(({ title, summary, href, Icon }) => <a className="portfolio-pathway-card" key={title} href={`#${href}`} onClick={event => handleSectionLink(event, href, href === 'automation-hub')}>
      <Icon size={26} aria-hidden="true"/><h3>{title}</h3><p>{summary}</p><span className="portfolio-pathway-link">Explore capability <ArrowUpRight size={17} aria-hidden="true"/></span>
    </a>)}</div>
  </section>}</Localized>
}
