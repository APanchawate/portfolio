import Localized from './i18n/Localized'
import ExploreDetails from './ExploreDetails'
import AiExperience from './AiExperience'
import { useEffect, useState } from 'react'
import HeroActions from './DocumentActions'
import { usePortfolioResources } from './resourceAssets'
import { ExpertiseExplorer, ProfessionalOverview } from './RecruiterOverview'
import BackToTop from './navigation/BackToTop'
import SiteNavigation from './navigation/SiteNavigation'
import FloatingBackToTop from './navigation/FloatingBackToTop'
import { goToSection, handleSectionLink } from './navigation/sectionNavigation'
import { careerAvailability } from './careerAvailability'
import DecisionCentre from './decision-centre/DecisionCentre'
import ProfessionalResources from './ProfessionalResources'
import FeaturedCaseStudies from './FeaturedCaseStudies'
import { OperatingModel, ParallelRollouts, ScopeEngineering } from './EnterpriseContext'
import type { ShowcaseRequest } from './resourceLinks'
import { ArrowRight, BarChart3, CalendarDays, ClipboardCheck, Code2, MapPin, Plane, Repeat2, ShieldCheck, Workflow } from 'lucide-react'

const experience = [
  { period:'Current', company:'BMW Group — Group Finance Backbone (GFBB)', subtitle:'', role:'Test Management, Automation & Reporting', summary:'Coordinating international UAT delivery across business and technical stakeholders, with planning, progress tracking, management reporting and process modernization.', text:'Supporting Central and Market Rollout Managers through operational Test Management governance, coordination, automation and reporting within a global SAP S/4HANA Finance transformation. Supporting the complete testing lifecycle from Acceptance Testing and Pre-UAT through UAT and Regression Testing, including planning, readiness, execution control, tester coordination, defect governance, escalation, reporting and automation.', points:['Coordinating international SAP S/4HANA Finance UAT planning, readiness and execution commitments with Rollout Management, testers and Finance Product Teams.','Primary technical ownership of Jira/Xray configurations, test repository governance and automation solutions.','Modernizing reporting workflows to reduce repetitive preparation and improve stakeholder visibility into progress, defects, risks and dependencies.','Developing market- and release-specific testing plans, execution structures, responsibilities and ramp-up curves.','Coordinating tester assignments, training, availability and coverage gaps.','Monitoring planned versus actual execution and defining recovery actions.','Establishing repository, evidence, traceability, dashboard and reporting standards.','Providing management and market leadership with decision-ready testing, defect and readiness reporting.','Supporting release-readiness assessments through testing evidence and risk analysis; final approvals remain with authorized decision-makers.'] },
  { period:'Previous', company:'Bosch Powertrain Solutions', subtitle:'International Programmes', role:'Project Management & SAP Processes', summary:'Supported international project coordination across SAP-enabled product and operational processes, connecting business and technical stakeholders on planning, progress and dependencies.', points:['Supported cross-functional planning, milestone and risk tracking, stakeholder communication and management reporting.','Contributed to process testing, documentation and reporting improvements to strengthen operational transparency and business/IT alignment.'], text:'Supported international project coordination and enterprise processes across SAP-enabled product and operational landscapes.' },
  { period:'Foundation', company:'UNR Engineering Technologies', subtitle:'Technology Delivery', role:'Junior IT Project Engineer', text:'Built an early foundation in technical project delivery, stakeholder support and structured problem solving.' },
]

const opportunityRoles = [
 'Test Manager', 'Technical Test Manager', 'UAT / Test Coordinator',
 'Test Management Support', 'Defect Manager', 'QA Governance Specialist',
 'Automation Specialist', 'Jira/Xray Specialist', 'Process Automation Specialist',
 'IT Project / PMO Support',
]
const classifications = ['Partner system', 'Training', 'Test data', 'Implementation', 'New requirement', 'New minor requirement', 'Migration']
const enterpriseMetrics = [
  ['7,000+', 'Master Test Cases', 'Central reusable repository supported'],
  ['22', 'Finance Product Teams', 'Cross-functional programme environment'],
  ['400+', 'Test Plans / Executions', 'Repository and execution scope'],
  ['', 'Automation Hub', 'Integrated Jira/Xray automation for test management, dashboards and reporting.'],
]
const stages = [
  { title: 'Scope Preparation', objective: 'Turn rollout inputs into a proposed market-specific UAT scope.', contributions: ['Review company codes, rollout requirements, Finance Product coverage and the reusable master test-case repository.', 'Map reusable master cases, consolidate proposed market scope and identify potential coverage gaps.'], output: 'Draft UAT scope for review.', note: 'Business and implementation stakeholders own FIT/GAP analysis; I coordinate the downstream testing preparation.' },
  { title: 'Business Validation', objective: 'Coordinate relevance reviews and test-case quality readiness.', contributions: ['Coordinate scope reviews with Central Finance Product Teams, market representatives and rollout stakeholders; track relevance decisions.', 'Identify missing GAP scenarios and support new test-case preparation and quality reviews.'], output: 'Reviewed scope and test-case quality readiness.', note: 'Finance Product Teams and business stakeholders determine scope relevance. Product Teams or implementation partners create required GAP cases; I coordinate the process and quality reviews, without independently approving business scope.' },
  { title: 'Execution Readiness', objective: 'Prepare testers, commitments and Jira/Xray execution structures.', contributions: ['Coordinate tester allocation, responsibilities, access and execution prerequisites; check test-case quality and follow up on readiness gaps.', 'Prepare Jira/Xray Test Plans and Test Executions; agree execution due dates with testers and Workstream Leads and establish the planning baseline.', 'Align timelines and reporting expectations; support UAT kickoff and stakeholder alignment as a readiness milestone.'], output: 'Structured UAT execution setup.' },
  { title: 'UAT Execution Monitoring', objective: 'Make progress, issues and follow-up priorities visible.', contributions: ['Monitor planned versus actual execution and changing test scope; track Pass, Fail, Executing and Blocked statuses in source reporting.', 'Follow up on defects, retesting, evidence requirements and test-data issues with testers, WS Leads and technical owners.', 'Coordinate workstream and market-level reporting, escalation and recovery discussions.'], output: 'Current testing status, issues and follow-up priorities.', note: 'Technical owners resolve defects; testers execute cases and capture appropriate evidence. I coordinate governance, monitoring and follow-up.' },
  { title: 'Reporting & Stakeholder Follow-up', objective: 'Connect execution monitoring with structured management discussions.', contributions: ['Generate the automated 15-page UAT KPI reporting package to support monitoring and stakeholder follow-up.', 'Review overall execution trends, failure rates by workstream, defect evolution and workstream execution performance.', 'Communicate risks, remaining workload and outstanding actions; consolidate readiness evidence for accountable stakeholders.'], output: 'Consolidated management reporting and decision-support information.', note: 'Formal business acceptance, UAT sign-off and go-live authorization remain with authorized business and programme stakeholders.' },
]
const platformOwnershipDetails = [
     ['Platform governance','Primary technical ownership of custom fields and testing-specific Jira/Xray setup. Configure filters, JQL, dashboards, reporting structures and KPI gadgets; automate through Jira REST APIs v2/v3 and Xray APIs.'],
     ['Test repository governance','Maintain reusable master cases, organization and labels. Apply quality standards and templates, review test-case quality and support cross-market reuse. Product Teams or implementation partners create required GAP cases.'],
     ['Regression governance','Prepare regression scope, case labels, Test Plans and dashboards. Coordinate execution monitoring and technical enablement with the dedicated automation team; that team owns Tosca scripts.'],
     ['Defect governance','Configure Defect Classification and relevant Jira filters to support categorization, routing, test-data blocker monitoring, reporting and follow-up. Technical owners resolve defects; classification does not automatically establish root cause.'],
    ]
const stack = [
 ['Test Management & Governance', 'UAT · Regression Testing · Defect Management · Test Planning · Traceability · Test-Case Quality · Management Reporting · Stakeholder Coordination'],
 ['Jira/Xray Configuration & Administration', 'Custom fields · Testing-specific configuration · Repository governance · Test Plans & Executions · Filters · Dashboards · KPI gadgets · JQL · REST APIs'],
 ['Engineering Technologies', 'Python · REST APIs · FastAPI · React / TypeScript · SQL / SQLite · Playwright · GitHub Actions · Self-hosted runners · GitHub · VS Code · CI/CD · JavaScript · Next.js · Excel Power Query · VBA'],
 ['Hands-on AI Applications', 'AI coding assistance · GitHub Copilot · Prompt engineering · Knowledge assistant configuration · AI-assisted debugging · AI-supported documentation and reporting'],
 ['Learning & Exploration', 'Exploring Azure cloud services, cloud-based workflow orchestration and AI agent development frameworks. Azure KPI reporting orchestration is planned, not deployed.'],
 ['Enterprise Systems', 'SAP S/4HANA Finance programme exposure · International business testing · SAP-related delivery coordination · SAP module coursework'],
]

function SectionHead({ kicker, title, text }: { kicker: string; title: string; text?: string }) {
 return <Localized>{<div className="section-head"><div><p className="kicker">{kicker}</p><h2>{title}</h2></div>{text && <p>{text}</p>}</div>}</Localized>
}
function App() {
 const [open, setOpen] = useState(false)
 const [showcaseRequest, setShowcaseRequest] = useState<ShowcaseRequest | null>(null)
 const assets = usePortfolioResources()
 useEffect(() => {
  const revealHash = () => { try { const id = decodeURIComponent(window.location.hash.slice(1)); if (id) goToSection(id) } catch { /* Ignore malformed URL fragments. */ } }
  const frame = requestAnimationFrame(revealHash)
  window.addEventListener('hashchange', revealHash); window.addEventListener('popstate', revealHash)
  return () => { cancelAnimationFrame(frame); window.removeEventListener('hashchange', revealHash); window.removeEventListener('popstate', revealHash) }
 }, [])
 return <Localized>{<div className="app">
  <a className="skip-link" href="#main">Skip to content</a>
  <div className="ambient one"/><div className="ambient two"/>
  <SiteNavigation open={open} onToggle={() => setOpen(!open)} onClose={() => setOpen(false)} cv={assets.cv} presentation={assets.presentation}/>
  <main id="main" tabIndex={-1}>
   <section className="hero section" id="top" tabIndex={-1}>
    <div className="hero-copy reveal">
     <div className="eyebrow"><span className="pulse"/><span>Available from {careerAvailability.date}</span></div>
     <p className="intro">AKSHAY PANCHAWATE</p>
     <h1>Enterprise Test Management &amp; <em>Automation Specialist</em></h1>
     <p className="hero-capabilities">Enterprise Test Management · IT Project Coordination · Process Automation · AI-Assisted Engineering</p>
     <p className="hero-text">I combine enterprise Test Management governance with hands-on Python automation and AI-assisted engineering, supporting international SAP S/4HANA Finance rollouts through UAT coordination, Jira/Xray technical ownership, automated reporting and knowledge-driven workflows.</p>
     <div className="hero-mobility"><p className="location"><MapPin size={16} aria-hidden="true"/><span>{careerAvailability.mobilitySummary}</span></p></div>
     <HeroActions assets={assets}/>
    </div>
    <aside className="governance-visual enterprise-hero-panel" aria-label="Enterprise experience and contribution">
     <p className="kicker">BUSINESS GOVERNANCE. TECHNICAL OWNERSHIP.</p><h2>Enterprise context.<br/><em>Hands-on delivery.</em></h2>
     <div className="hero-enterprise-metrics">{enterpriseMetrics.map(([value,label,note])=><div key={label}>{label === 'Automation Hub' ? <Workflow className="hub-metric-icon" size={32} aria-hidden="true"/> : <strong>{value}</strong>}<h3>{label}</h3><p>{note}</p></div>)}</div>
     <p className="visual-foot">Core member of a two-person Central Test Management team, with primary technical ownership of Jira/Xray configurations, test repository governance and automation solutions.</p>
    </aside>
   </section>
   <ProfessionalOverview/>
   <ExpertiseExplorer/>
   <div className="enterprise-scope-strip" aria-label="Additional enterprise scope and personal contribution"><p><strong>20+ company codes</strong> · international testing scope supported</p><p><strong>200+ dashboards</strong> · personally created through automation</p><p><strong>1,500+ defects</strong> · management and reporting environment</p></div>
   <OperatingModel/>
   <FeaturedCaseStudies/>
   <ScopeEngineering/>
   <ParallelRollouts/>
   <section className="section" id="expertise" tabIndex={-1}>
    <SectionHead kicker="A HANDS-ON DIFFERENTIATOR" title="Jira/Xray Platform & Test Repository Governance" text="The platform responsibilities behind reusable test structures: configuration, repository standards, filters, dashboards and automation."/>
    <div className="cap-grid platform-governance-grid">{[
      ['Repository Governance', 'Reusable master cases, quality standards and cross-market coverage.'],
      ['Test Execution Governance', 'Structured Jira/Xray plans, executions and tester commitments.'],
      ['Reporting & Dashboards', 'Consistent filters, automated dashboards and management visibility.'],
      ['Regression Management', 'Coordinated scope, reusable coverage and automation-team collaboration.'],
    ].map(([title,text],i)=>{const Icon=[ShieldCheck,ClipboardCheck,BarChart3,Repeat2][i];return <article className="cap-card" key={title}><div className="cap-ident"><Icon size={20} aria-hidden="true"/><span className="cap-number">0{i+1}</span></div><h3>{title}</h3><p>{text}</p><div className="line"/></article>})}</div>
    <ExploreDetails heading="Explore Jira/Xray Technical Details"><dl className="disclosure-definition-list">{platformOwnershipDetails.map(([title,text])=><div key={title}><dt>{title}</dt><dd>{text}</dd></div>)}</dl>
    <div className="workflow" aria-label="From requirements to management visibility">{['Business / testing requirements','Jira/Xray configuration','Test Plans & Executions','Jira filters','Automated dashboards & KPI gadgets','Management visibility'].map((step,i)=><div key={step}><span>{step}</span>{i<5 && <ArrowRight size={18} aria-hidden="true"/>}</div>)}</div>
    <div className="configuration-example" id="defect-classification" tabIndex={-1}><div><p className="kicker">CONFIGURATION IN PRACTICE</p><h3>Defect Classification</h3><p>I created this seven-category custom Jira field to support structured categorization, dashboard filtering, reporting and follow-up. It does not automatically establish root cause or make me the technical resolution owner.</p></div><ul className="classification-list">{classifications.map(label=><li key={label}>{label}</li>)}</ul></div>
    </ExploreDetails>
    <p className="governance-value">Product Teams and markets validate business relevance; my focus is reliable technical configuration and reusable testing structures.</p>
   <BackToTop/>
   </section>
   <section className="section approach" id="approach" tabIndex={-1}>
    <SectionHead kicker="A CONNECTED DELIVERY RECIPE" title="My Enterprise UAT Management Recipe" text="A structured working approach: prepare scope, validate readiness, monitor agreed execution commitments and report exceptions."/>
    <div className="lifecycle-rails"><span>Stakeholder alignment</span><span>Traceability</span><span>Risk reporting</span></div>
    <ol className="lifecycle uat-recipe" aria-label="Five connected stages of my UAT management recipe">{stages.map((stage,i)=><li key={stage.title}><span className="stage-number">0{i+1}</span><h3>{stage.title}</h3><p>{stage.objective}</p></li>)}</ol>
    <ExploreDetails heading="Explore Complete UAT Methodology">{stages.map((stage,i)=><div className="methodology-detail" key={stage.title}><h3>{stage.title}</h3><p className="stage-output"><strong>Management output</strong>{stage.output}</p><ul>{stage.contributions.map(text=><li key={text}>{text}</li>)}</ul>{i===3 && <p>I created the <a href="#defect-classification" onClick={event => handleSectionLink(event, 'defect-classification')}>Defect Classification dropdown field</a> to support consistent categorization and reporting.</p>}{stage.note && <p className="ownership-note">{stage.note}</p>}</div>)}</ExploreDetails>
    <div className="lifecycle-loop"><p>Defect management, retesting, evidence capture and reporting overlap execution. The reporting package supports both UAT monitoring and stakeholder follow-up.</p><p><a className="text-link" href="#reporting-transformation" onClick={event => handleSectionLink(event, 'reporting-transformation')}>Explore the 15-page reporting framework <ArrowRight size={15} aria-hidden="true"/></a></p></div>
    <ExploreDetails heading="Explore Governance Details">
    <div className="industry-practices" role="group" aria-labelledby="industry-practices-title">
      <h3 id="industry-practices-title">Industry-Aligned Test Management Practices</h3>
      <div className="industry-practices-grid">{[
        ['Test Planning & Control', 'UAT scope, tester and Workstream Lead alignment, agreed execution due dates, readiness and execution baselines.'],
        ['Test Monitoring & Reporting', 'Daily and weekly cumulative execution tracking, scope changes, overdue cases, Jira/Xray dashboards and management reporting.'],
        ['Defect & Quality Management', 'Defect classification, triage coordination, Jira filters, test-data blockers, retesting and evidence completeness.'],
        ['Test Completion & Readiness', 'Execution status, outstanding defects, evidence quality, residual risks and reporting to support Rollout Management decisions.'],
      ].map(([title, description]) => <article key={title}><h4>{title}</h4><p>{description}</p></article>)}</div>
      <p className="industry-practices-note">Reflects established testing principles described in ISTQB syllabi, adapted to practical enterprise UAT delivery.</p>
    </div>
    </ExploreDetails>
   <BackToTop/>
   </section>
   <DecisionCentre showcaseRequest={showcaseRequest}/>
   <section className="section experience" id="experience" tabIndex={-1}>
    <SectionHead kicker="PROFESSIONAL EXPERIENCE" title="From engineering delivery to enterprise transformation."/>
    <div className="timeline">{experience.map((e,i)=><article key={e.company}><div className="time-marker"><span>{String(i+1).padStart(2,'0')}</span></div><div className="exp-period">{e.period}</div><div className="exp-main">{e.subtitle && <p>{e.subtitle}</p>}<h3>{e.company}</h3><h4>{e.role}</h4>{'points' in e ? <><ul className="exp-points">{e.points?.slice(0,3).map(point=><li key={point}>{point}</li>)}</ul><ExploreDetails heading="Explore Responsibilities & Achievements"><p>{e.summary}</p><p>{e.text}</p>{(e.points?.length ?? 0)>3 && <ul className="exp-points">{e.points?.slice(3).map(point=><li key={point}>{point}</li>)}</ul>}</ExploreDetails></> : <div>{e.text}</div>}</div></article>)}</div>
   <BackToTop/>
   </section>
   <section className="section tech" id="stack" tabIndex={-1}>
    <SectionHead kicker="TECHNICAL ENABLERS" title="Technology that reinforces governance." text="Hands-on automation and configuration complement delivery coordination. Tosca development belongs to the dedicated automation team; my SAP experience is in programme delivery and business testing."/>
    <div className="stack-grid">{stack.map(([title,items],i)=><article key={title}><div><Code2 size={18} aria-hidden="true"/><span>0{i+1}</span></div><h3>{title}</h3><p className="skill-preview">{['UAT · Jira/Xray · Reporting','JQL · Custom fields · Xray','Python · FastAPI · React/TypeScript','GitHub Copilot · Knowledge assistants','Azure (exploring) · GitHub Actions','SAP S/4HANA · Finance testing'][i]}</p><><p>{['UAT, quality governance and stakeholder coordination.', 'Testing-specific configuration, repository standards and reporting.', 'Python/API development, application delivery and automation infrastructure.', 'Implemented AI support for coding, knowledge access and communication.', 'Learning and planned workflows; Azure reporting orchestration is not deployed.', 'SAP programme delivery and business-testing exposure.'][i]}</p><p>{items}</p></></article>)}</div>
    <AiExperience/>
   <BackToTop/>
   </section>
      <section className="section" id="education" tabIndex={-1}>
        <div className="section-head"><div><p className="kicker">EDUCATION & CERTIFICATIONS</p><h2>Academic foundation. <em>Applied expertise.</em></h2></div></div>
        <div className="case-grid">
          <article className="case"><div className="case-top"><span>EDUCATION</span></div><h3>MBA & Engineering (Operational Excellence)</h3><dl><div><dt>Institution</dt><dd>Hof University of Applied Sciences, Germany</dd></div><div><dt>Period</dt><dd>October 2022 – May 2025</dd></div><div><dt>Thesis</dt><dd>Master’s thesis grade: 1.3</dd></div></dl></article>
          <article className="case"><div className="case-top"><span>CREDENTIALS</span></div><h3>Certifications</h3><dl><div><dt>Certified</dt><dd>Lean Six Sigma Green Belt<br/>Atlassian Agile Project Management Professional Certificate<br/>Google Project Management Professional Certificate — Google</dd></div><div><dt>Professional Training</dt><dd>SAP S/4HANA — University coursework covering MM, PM, SD, PP and CO<br/>PMI Agile Certified Practitioner (PMI-ACP)® Exam Preparation — LinkedIn Learning<br/>ISTQB® Certified Tester Foundation Level (CTFL) — Planned</dd></div></dl></article>
        </div>
      <BackToTop/>
   </section>


   <ProfessionalResources assets={assets} onExplore={target => setShowcaseRequest({ target })}/>
   <section className="section opportunities" id="opportunities" aria-labelledby="opportunities-title" tabIndex={-1}>
    <div className="opportunities-panel">
     <h2 id="opportunities-title">Open to my next opportunity</h2>
     <p className="availability-summary">{careerAvailability.summary}</p>
     <p>Actively exploring new professional opportunities in enterprise testing, QA governance, technical coordination and automation. Open to hands-on specialist positions as well as consulting and coordination responsibilities.</p>
     <p className="opportunities-strengths">Enterprise Test Management · Stakeholder coordination · Jira/Xray governance · Python/API automation</p>
     <ul className="opportunity-roles" aria-label="Roles of interest">{opportunityRoles.map(role=><li key={role}>{role}</li>)}</ul>
     <dl className="career-mobility-details">
      <div><dt><CalendarDays size={17} aria-hidden="true"/> Availability</dt><dd>{careerAvailability.date}</dd></div>
      <div><dt><MapPin size={17} aria-hidden="true"/> Location &amp; Relocation</dt><dd>{careerAvailability.relocationDetail}</dd></div>
      <div><dt><Plane size={17} aria-hidden="true"/> Business Travel</dt><dd>{careerAvailability.travelDetail}</dd></div>
     </dl>
     <div className="language-development" role="group" aria-labelledby="languages-title">
      <h3 id="languages-title">Languages &amp; Development</h3>
      <dl className="language-grid">
       <div><dt>English <span>— Fluent</span></dt><dd>Professional working language.</dd></div>
       <div><dt>German <span>— B1 Certified</span></dt><dd>Actively improving German proficiency through continued learning and speaking practice, with the goal of progressing beyond B1.</dd></div>
      </dl>
     </div>
    </div>
   <BackToTop/>
   </section>
   <section className="contact section" id="contact" tabIndex={-1}><div className="contact-glow"/><p className="kicker">CONTACT</p><h2>Let’s discuss <em>your transformation.</em></h2><p>Enterprise Test Management, UAT governance, Jira/Xray configuration and business readiness — supported by practical automation.</p><p className="availability-summary">{careerAvailability.summary}</p><div className="contact-actions"><a className="button primary" href="mailto:akshaysipune15@gmail.com">Email / Request CV <ArrowRight size={17}/></a><a className="button secondary" href="#resources">CV &amp; Presentation <ArrowRight size={17}/></a></div><BackToTop/>
   </section>
  </main>
  <FloatingBackToTop menuOpen={open}/>
  <footer><a className="brand" href="#top" aria-label="Back to home"><span>AP</span><i/></a><p>© {new Date().getFullYear()} Akshay Panchawate.<span className="footer-availability">{careerAvailability.summary}</span></p><a href="#top" onClick={event => handleSectionLink(event, 'top')}>Back to top ↑</a></footer>
 </div>}</Localized>
}
export default App
