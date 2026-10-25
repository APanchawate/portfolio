import Localized from './i18n/Localized'
import ExploreDetails from './ExploreDetails'
import ReportingFramework, { ReportingWorkflow } from './ReportingFramework'
import BackToTop from './navigation/BackToTop'
import AutomationHubArchitecture from './AutomationHubArchitecture'
import AutomationImpactExplorer from './AutomationImpactExplorer'
import { ArrowRight } from 'lucide-react'
import { featuredCases, originalCases } from './portfolioCases'

export default function FeaturedCaseStudies() {
  return <Localized>{<section className="section projects" id="projects" tabIndex={-1} aria-labelledby="cases-title">
    <div className="section-head"><div><p className="kicker">FEATURED BUSINESS CASE STUDIES</p><h2 id="cases-title">Governance experience.<br/><em>Engineering capability.</em></h2></div><p>Business challenges, my contribution and operational value—with technical implementation available on demand.</p></div>
    <div className="case-grid">{featuredCases.map((item, index) => <article className="case featured-case" key={item.title} id={index === 3 ? 'technical-projects' : index === 2 ? 'reporting-transformation' : undefined} tabIndex={index >= 2 ? -1 : undefined}><div className="case-top"><span>CASE {String(index + 1).padStart(2, '0')}</span><ArrowRight size={18} aria-hidden="true"/></div><h3 id={index === 3 ? 'automation-hub' : undefined} tabIndex={index >= 2 ? -1 : undefined}>{item.title}</h3>
      <dl>{[['Challenge', (item.preview?.challenge ?? item.challenge)], ['My Contribution', (item.preview?.role ?? item.role)], ['Business value', (item.preview?.value ?? item.value)]].map(([label, text]) => <div key={label}><dt>{label}</dt><dd>{text}</dd></div>)}</dl>
      <ExploreDetails className="case-technical" heading="Explore Technical Approach"><dl>{[['Challenge',item.challenge],['My Contribution',item.role],['Business value',item.value]].map(([label,text])=><div key={label}><dt>{label}</dt><dd>{text}</dd></div>)}<div><dt>Approach</dt><dd>{item.approach}</dd></div></dl><p>{item.technical}</p><p>{item.stakeholders}</p>
        {index === 2 && <><ReportingFramework/><ReportingWorkflow/></>}
        {index === 3 && <><AutomationHubArchitecture/><div className="dc-thresholds"><h4>Explore illustrative automation effort and impact</h4><AutomationImpactExplorer/></div></>}
        {originalCases.filter(project => item.supportingProjects.includes(project.n)).map(project => <div className="case-supporting-project" key={project.n}><h4>{project.title}</h4><dl>{[['Business challenge', project.challenge], ['My Contribution', project.role], ['Business value', project.impact], ['Approach', project.approach], ['Scope', project.scale], ['Technical enablers', project.tech]].map(([label, text]) => <div key={label}><dt>{label}</dt><dd>{text}</dd></div>)}</dl></div>)}
      </ExploreDetails>{item.link && <a className="text-link" href={item.link.href}>{item.link.label} <ArrowRight size={15} aria-hidden="true"/></a>}
      {index === 3 && <BackToTop/>}
    </article>)}</div>
    <BackToTop/>
  </section>}</Localized>
}
