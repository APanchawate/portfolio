import Localized from './i18n/Localized'
import { ArrowRight, ArrowUpRight, BarChart3, Download, FileText, Network, Presentation } from 'lucide-react'
import type { ShowcaseTarget } from './resourceLinks'
import type { ResourceAvailability } from './resourceAssets'
import { resourceFiles, resourceUrl } from './resourceAssets'
import { PresentationAction } from './DocumentActions'
import BackToTop from './navigation/BackToTop'
import { handleSectionLink } from './navigation/sectionNavigation'
export { resourceFiles, resourceUrl, hasResourceSignature, resourceIsAvailable } from './resourceAssets'

const examples: { target: ShowcaseTarget; title: string; description: string }[] = [
  { target: 'execution', title: 'Due-date-driven cumulative execution', description: 'Agreed commitments, actual execution, overdue cases and daily/weekly variance.' },
  { target: 'scope', title: 'Scope tracking', description: 'Scope additions and removals alongside historical execution snapshots.' },
  { target: 'defects', title: 'Defect dashboards', description: 'Severity, ageing, classification and test-data blocker monitoring.' },
  { target: 'evidence', title: 'Evidence completeness', description: 'Execution evidence requirements, completeness and documentation gaps.' },
  { target: 'management', title: 'Management reporting', description: 'Fictional market status, dependencies and escalation priorities.' },
]

export default function ProfessionalResources({ onExplore, assets }: { onExplore: (target: ShowcaseTarget) => void; assets: ResourceAvailability }) {
  const { cv, presentation, powerpoint } = assets
  return <Localized>{<section className="section professional-resources" id="resources" aria-labelledby="resources-title" tabIndex={-1}>
    <div className="section-head"><div><p className="kicker">RESOURCES & APPLIED EXPERTISE</p><h2 id="resources-title">Professional Resources &amp; Project Showcase</h2></div><p>Professional documents, illustrative reporting examples and a practical view of the automation behind enterprise testing.</p></div>
    <p className="resource-language-note">Documents available in English.</p>
    <div className="resources-grid">
      <article className="resource-card"><div className="resource-icon"><FileText size={23} aria-hidden="true"/></div><h3>Curriculum Vitae</h3><p>Professional experience across enterprise Test Management, stakeholder coordination, Jira/Xray governance and automation.</p>
        <p className="resource-status" role="status">{cv === 'available' ? 'PDF available' : cv === 'checking' ? 'Checking CV availability…' : 'CV PDF pending — final file not yet supplied.'}</p>
        <div className="resource-actions">{cv === 'available' ? <>
          <a className="button primary" href={resourceUrl(resourceFiles.cv)} target="_blank" rel="noopener noreferrer" aria-label="View CV (PDF, opens in a new tab)">View CV <ArrowUpRight size={16} aria-hidden="true"/></a>
          <a className="button secondary" href={resourceUrl(resourceFiles.cv)} download="Akshay-Panchawate-CV.pdf">Download CV <Download size={16} aria-hidden="true"/></a>
        </> : null}</div>
        {cv === 'unavailable' && <a className="text-link" href="mailto:akshaysipune15@gmail.com">Request my CV by email <ArrowRight size={15} aria-hidden="true"/></a>}
      </article>
      <article className="resource-card"><div className="resource-icon"><Presentation size={23} aria-hidden="true"/></div><h3>Enterprise Test Management Presentation</h3><p>A concise overview of my enterprise UAT management methodology, international testing governance, automated KPI reporting, Automation Hub and practical AI-assisted engineering experience.</p>
        <p className="resource-status" role="status">{presentation === 'available' && powerpoint === 'available' ? 'PDF and PowerPoint versions available.' : presentation === 'checking' || powerpoint === 'checking' ? 'Checking presentation availability…' : presentation === 'available' ? 'Presentation PDF available.' : powerpoint === 'available' ? 'PowerPoint available · PDF temporarily unavailable.' : 'Presentation temporarily unavailable.'}</p>
        <div className="resource-actions"><PresentationAction assets={assets}/></div>
      </article>
      <article className="resource-card"><div className="resource-icon"><BarChart3 size={23} aria-hidden="true"/></div><h3>Reporting &amp; KPI Showcase</h3><p>Explore the existing interactive examples of execution control, quality monitoring and management visibility.</p><p className="resource-status">Illustrative examples — not actual programme data.</p>
        <details className="resource-details"><summary>Explore reporting examples</summary><ul className="resource-examples">{examples.map(example => <li key={example.target}><a href="#decision-centre" onClick={() => onExplore(example.target)}><span><strong>{example.title}</strong><small>{example.description}</small></span><ArrowUpRight size={16} aria-hidden="true"/></a></li>)}</ul></details>
      </article>
      <article className="resource-card"><div className="resource-icon"><Network size={23} aria-hidden="true"/></div><h3>Automation Architecture &amp; Solutions</h3><p>An integrated Test Management Automation Hub connects repeatable Jira/Xray administration and reporting. Supporting reporting tools and AI solutions retain their appropriate roles.</p>
        <ol className="resource-architecture" aria-label="Conceptual automation and reporting flow">{['Jira/Xray', 'REST APIs / Python', 'Data Processing', 'Dashboards / Reports', 'Stakeholder Visibility'].map(step => <li key={step}>{step}</li>)}</ol>
        <details className="resource-details"><summary>Explore solution patterns</summary><dl className="resource-patterns"><div><dt>API workflows</dt><dd>Python and REST APIs support repeatable Jira/Xray operations and reporting preparation.</dd></div><div><dt>Reporting workflows</dt><dd>Power Query and VBA support spreadsheet-based data preparation and management reporting.</dd></div><div><dt>Automation Hub</dt><dd>React/TypeScript provides the interface, FastAPI/Python provides automation services, and SQLite supports local application data and workflow state where relevant.</dd></div><div><dt>Delivery tooling</dt><dd>GitHub Actions supports CI/CD, with self-hosted runners where appropriate; Playwright supports browser testing. Delivery setups vary between solutions.</dd></div></dl><a className="text-link" href="#automation-hub" onClick={event => handleSectionLink(event, 'automation-hub', true)}>Explore the Automation Hub architecture <ArrowRight size={15} aria-hidden="true"/></a></details>
      </article>
    </div>
    <BackToTop/>
  </section>}</Localized>
}
