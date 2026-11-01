import Localized from './i18n/Localized'
import { ArrowUpRight, BrainCircuit, ChartNoAxesCombined, ClipboardCheck, Workflow } from 'lucide-react'
import { handleSectionLink } from './navigation/sectionNavigation'

const pillars = [
  { title: 'Enterprise Test Management', summary: 'International UAT governance, readiness, execution and defect coordination.', href: 'projects', Icon: ClipboardCheck },
  { title: 'Automation Engineering', summary: 'Python, Jira/Xray APIs, Playwright and repeatable testing workflows.', href: 'automation-hub', Icon: Workflow },
  { title: 'Reporting & Test Intelligence', summary: 'Management KPIs, dashboard automation, defect trends and execution visibility.', href: 'reporting-transformation', Icon: ChartNoAxesCombined },
  { title: 'AI & Digital Transformation', summary: 'Enterprise knowledge assistants and practical AI-assisted engineering.', href: 'ai-engineering', Icon: BrainCircuit },
] as const

export default function PortfolioPathways() {
  return <Localized>{<section className="section portfolio-pathways" id="portfolio-guide" aria-labelledby="portfolio-guide-title" tabIndex={-1}>
    <div className="section-head"><div><p className="kicker">EXPLORE THE PORTFOLIO</p><h2 id="portfolio-guide-title">Business outcomes.<br/><em>Technical depth when you need it.</em></h2></div>
      <p>Start with the capability most relevant to your role. Each area connects to real delivery experience and implementation detail.</p></div>
    <div className="portfolio-pathways-grid">{pillars.map(({ title, summary, href, Icon }) => <a className="portfolio-pathway-card" key={title} href={`#${href}`} onClick={event => handleSectionLink(event, href, href === 'automation-hub')}>
      <Icon size={26} aria-hidden="true"/><h3>{title}</h3><p>{summary}</p><span className="portfolio-pathway-link">Explore capability <ArrowUpRight size={17} aria-hidden="true"/></span>
    </a>)}</div>
    <p className="portfolio-pathways-note">Programme-scale metrics and personally delivered results are identified separately in the detailed case studies.</p>
  </section>}</Localized>
}
