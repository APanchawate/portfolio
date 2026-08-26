import { useState } from 'react'
import { ArrowDown, ArrowRight, BarChart3, Bot, Braces, CheckCircle2, ChevronRight, CircleDot, Code2, MapPin, Menu, Network, ShieldCheck, Sparkles, Target, X } from 'lucide-react'

const metrics = [
  ['7,000+', 'Test Cases Governed'], ['30+', 'Automation Solutions', 'Bulk Custom-Field Updates • Test-Evidence Management • Reporting Dashboards'], ['20+', 'Company Codes'],
  ['22', 'Finance Product Teams'], ['400+', 'Test Plans / Test Executions'], ['100+', 'Jira/Xray dashboards'],
  ['≈100%', 'Dashboard Setup Automation', 'Jira/Xray • Python • REST APIs'], ['1,500+', 'Defects Tracked'],
]

const capabilities = [
  { icon: Target, title: 'Test Strategy & Planning', text: 'Translating market scope into executable approaches, timelines, responsibilities, dependencies and Jira/Xray structures across Acceptance Testing, Pre-UAT, UAT and Regression Testing.' },
  { icon: ShieldCheck, title: 'Readiness & Quality Gates', text: 'Coordinating scope, test-case readiness, tester availability, environments, authorisations and blockers using structured assessments and measurable entry/exit criteria.' },
  { icon: CheckCircle2, title: 'Resource & Execution Control', text: 'Mapping testers to scope, defining tester-level deadlines and ramp-up curves, and monitoring planned-versus-actual execution across international markets.' },
  { icon: CircleDot, title: 'Defect Lifecycle Coordination', text: 'Defect-quality review, triage coordination, ageing and ownership tracking, escalation, retesting and management decision support.' },
  { icon: BarChart3, title: 'Reporting & KPI Ownership', text: 'Designing decision-ready KPI frameworks, automated dashboards and management reporting across markets, Product Teams, workstreams and testing statuses.' },
  { icon: Network, title: 'Recovery & Escalation', text: 'Analysing schedule deviations and blockers, defining recovery actions, adjusting operational targets and supporting testing-window extension recommendations.' },
  { icon: Bot, title: 'Training & Stakeholder Enablement', text: 'Training market testers on Jira/Xray execution, evidence, defects and governance standards while coordinating Product Teams and support partners.' },
  { icon: Braces, title: 'Automation & Continuous Improvement', text: 'Converting recurring Test Management problems into reusable Python/API workflows, standardised reporting, repository controls and self-service tools.' },
]

const cases = [
  { n:'01', title:'Jira/Xray Test Management Automation', challenge:'High-volume test administration created repetitive work and inconsistent setup.', role:'Automation concept, process design and implementation.', approach:'Converted repeatable Jira/Xray activities into governed API workflows with validation and audit-friendly outputs.', tech:'Python · REST APIs · Jira · Xray · JSON', scale:'Enterprise test cycles spanning multiple teams and entities.', impact:'Faster setup, reduced manual effort and more consistent execution readiness.' },
  { n:'02', title:'Market Testing and Management Analytics', challenge:'Distributed market activity required one dependable view of progress, risk and readiness.', role:'Test management coordination, reporting design and stakeholder management.', approach:'Delivered daily market-testing reporting for management and market leadership, including CFO stakeholders, combining overall and workstream/product-level test execution, all test statuses, defects and key testing KPIs using Jira/Xray filter and API-driven data.', tech:'Jira · Xray · JQL · REST APIs · Excel · Power Query · Power BI', scale:'20+ company codes and cross-functional market teams.', impact:'Enabled daily management visibility into testing progress, defects, risks and market readiness through consistent, data-driven reporting.' },
  { n:'03', title:'Test Management Automation Hub', challenge:'Useful automation existed as separate scripts without a unified user experience.', role:'Product concept, solution architecture and full-stack delivery.', approach:'Created a modular hub that makes repeatable test-management workflows accessible through one interface.', tech:'React · TypeScript · FastAPI · Python · SQLite', scale:'Reusable workflows across test preparation, execution and reporting.', impact:'A scalable foundation for self-service operations and continuous process improvement.' },
  { n:'04', title:'Automated Test-Case Creation', challenge:'Manual case creation was time intensive and vulnerable to formatting inconsistencies.', role:'Workflow analysis, automation design and quality controls.', approach:'Developed Python/API-driven workflows to extract test information from Confluence pages and generate structured Jira/Xray Test Cases, alongside bulk test-case creation and cloning from Excel-based inputs.', tech:'Python · REST APIs · Jira · Xray · Confluence · Excel · JSON', scale:'Thousands of structured test artifacts.', impact:'Accelerated test preparation while improving consistency and traceability.' },
  { n:'05', title:'Test Repository Governance and Dashboard Automation', challenge:'Repository growth and dashboard demand made manual governance difficult to sustain.', role:'Governance model, automation strategy and rollout support.', approach:'Defined reusable structures, automated dashboard provisioning and introduced health checks for repository quality.', tech:'Jira · Xray · Python · JQL · REST APIs', scale:'7,000+ master cases and 100+ dashboards.', impact:'Approximately 100% automated dashboard setup and stronger portfolio-wide standards.' },
  { n:'06', title:'GenAI Knowledge and Test Management Assistant', challenge:'Teams needed quicker access to process knowledge without losing control or context.', role:'Use-case design, AI-agent configuration, knowledge grounding and implementation.', approach:'Built and implemented two project-specific AI agents for the team using BMW’s internal GenAI platform: one providing access to broader GFBB project knowledge and another focused on Test Management processes, status and updates. Both agents were grounded in project documentation to provide relevant and context-aware information.', tech:'Generative AI · AI Agents · Enterprise Knowledge Grounding · BMW GAIA', scale:'Two working AI agents supporting team members, management stakeholders and new joiners across project knowledge and Test Management use cases.', impact:'Improved access to project timelines, rollout information, UAT updates and Test Management knowledge, reducing dependency on manual Confluence searches and supporting faster onboarding and decision-making.' },
  { n:'07', title:'Confluence Live Dashboard Automation', challenge:'Testing KPI and management views required continuous manual updates across Jira and Confluence.', role:'Automation design, API integration and reporting workflow implementation.', approach:'Automated the creation and updating of Confluence reporting pages using Python and REST APIs, dynamically integrating Jira filter/JQL data to create live testing dashboards and continuously updated testing KPI and management views.', tech:'Python · REST APIs · Jira · JQL · Confluence', scale:'Reusable reporting pages connected to live Jira testing data.', impact:'Reduced manual reporting effort while keeping testing KPI and management views continuously current.' },
  { n:'08', title:'Market UAT Planning, Readiness & Execution Control', challenge:'International rollout markets required a structured operating model to prepare and complete UAT within fixed programme timelines.', role:'Test planning, readiness coordination, tester-capacity planning, execution control and management decision support.', approach:'Translated market scope into executable test structures, mapped testers to business processes and test cases, established tester-level deadlines and expected ramp-up curves, and monitored planned-versus-actual progress. Coordinated blockers, defects, support requirements and recovery actions across markets, Product Teams, Workstream Leads, the BMW South Africa testing hub and technical partners.', tech:'Jira · Xray · JQL · Confluence · Excel · Power Query · Python · REST APIs', scale:'International SAP S/4HANA market rollouts across 20+ company codes and 22 Finance Product Teams.', impact:'Improved transparency of readiness, capacity, execution progress and emerging risks, enabling timely recovery actions and informed management decisions.' },
]

const experience = [
  { period:'Current', company:'BMW Group — Group Finance Backbone (GFBB)', subtitle:'', role:'Test Management, Automation & Reporting', text:'Driving and coordinating operational Test Management activities across Finance Product Teams, business testers, rollout markets and management stakeholders within a global SAP S/4HANA Finance transformation. Supporting the complete testing lifecycle from Acceptance Testing and Pre-UAT through UAT and Regression Testing, including planning, readiness, execution control, tester coordination, defect governance, escalation, reporting and automation.', points:['Developing market- and release-specific testing plans, execution structures, responsibilities and ramp-up curves.','Coordinating tester assignments, training, availability and coverage gaps.','Monitoring planned versus actual execution and defining recovery actions.','Establishing repository, evidence, traceability, dashboard and reporting standards.','Providing management and market leadership with decision-ready testing, defect and readiness reporting.','Supporting conditional-start and go-live-with-conditions recommendations through testing evidence and risk analysis.'] },
  { period:'Previous', company:'Bosch Powertrain Solutions', subtitle:'International Programs', role:'Project Management & SAP Processes', text:'Supported international project coordination and enterprise processes across SAP-enabled product and operational landscapes.' },
  { period:'Foundation', company:'UNR Engineering Technologies', subtitle:'Technology Delivery', role:'Junior IT Project Engineer', text:'Built an early foundation in technical project delivery, stakeholder support and structured problem solving.' },
]

const stack = [
  ['Test & Project Management', 'Jira · Xray · JQL · Confluence · Tosca · UAT · Regression Testing · Test Readiness · Test Planning · Quality Gates · Resource Planning · Defect Triage · Management Reporting · Stakeholder Coordination · Continuous Improvement'],
  ['Automation & Backend', 'Python · REST APIs · FastAPI · SQL · SQLite · JSON'],
  ['Frontend & Testing', 'React · Next.js · TypeScript · Playwright'],
  ['DevOps & Development', 'GitHub · GitHub Actions · GitHub Copilot · CI/CD'],
  ['Data & Reporting', 'Power BI · Excel · Power Query · VBA · JQL'],
  ['Enterprise Transformation', 'SAP S/4HANA · SAP MM · SAP SD · SAP PP · SAP PLM/ECR'],
  ['AI & Emerging Technologies', 'Generative AI · AI Agents'],
]

function App() {
  const [open, setOpen] = useState(false)
  const nav = ['About', 'Expertise', 'Projects', 'Experience', 'Stack', 'Contact']
  const close = () => setOpen(false)
  return <div className="app">
    <div className="ambient one" /><div className="ambient two" />
    <header className="nav-wrap">
      <a className="brand" href="#top" aria-label="Home"><span>AP</span><i /></a>
      <nav className={open ? 'nav open' : 'nav'} aria-label="Primary navigation">
        {nav.map(x => <a key={x} href={`#${x.toLowerCase()}`} onClick={close}>{x}</a>)}
      </nav>
      <a className="nav-cta" href="https://www.linkedin.com/in/akshaypanchawate/" target="_blank" rel="noreferrer">Let’s connect <ArrowRight size={15}/></a>
      <button className="menu" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X/> : <Menu/>}</button>
    </header>

    <main id="top">
      <section className="hero section">
        <div className="hero-copy reveal">
          <div className="eyebrow"><span className="pulse"/> Available for transformative challenges</div>
          <p className="intro">HELLO, I’M</p>
          <h1>Akshay<br/><em>Panchawate.</em></h1>
          <h2>Driving Enterprise Test Management <span>Through Governance, Data & Automation</span></h2>
          <p className="hero-text">Test Management <b>•</b> SAP S/4HANA <b>•</b> Python/API Automation <b>•</b> Analytics <b>•</b> GenAI</p>
          <p className="location"><MapPin size={17}/> Munich, Germany</p>
          <div className="actions">
            <a className="button primary" href="#projects">View projects <ArrowDown size={17}/></a>
            <a className="button secondary" href="https://www.linkedin.com/in/akshaypanchawate/" target="_blank" rel="noreferrer"><svg width="23" height="23" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect width="24" height="24" rx="3" fill="#0A66C2"/><path fill="#fff" d="M7.1 20.45H3.54V8.98H7.1v11.47zM5.32 7.41a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V8.98h3.42v1.57h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.29z"/></svg> LinkedIn</a>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="orbit orbit-a"/><div className="orbit orbit-b"/>
          <div className="core"><div className="core-logo">AP</div><span>TRANSFORM</span></div>
          <div className="node n1"><Braces/>AUTOMATE</div><div className="node n2"><BarChart3/>ANALYZE</div><div className="node n3"><Bot/>AUGMENT</div>
          <div className="code-card"><span>workflow.status</span><b>OPTIMIZED</b><i>100%</i></div>
        </div>
      </section>

      <section className="section" id="about">
        <div className="section-head"><div><p className="kicker">ABOUT ME</p><h2>Connecting delivery, data and <em>automation.</em></h2></div><p>I combine hands-on Test Management, cross-functional coordination and software automation to support large-scale SAP S/4HANA transformation programmes. I coordinate and operationalise end-to-end testing activities across stakeholders, Finance Product Teams and international rollout markets—covering planning, readiness, execution control, defect coordination, reporting and automation. I translate complex Jira/Xray processes and testing data into reliable workflows, transparent governance and decision-ready management insights.</p></div>
      </section>

      <section className="story-band">
        <p>MY PROFESSIONAL EVOLUTION</p>
        <div className="story-flow">{['Test Leadership & Governance','Reporting & Analytics','Automation','Digital Transformation','GenAI'].map((x,i)=><div key={x}><span>0{i+1}</span><strong>{x}</strong>{i<4&&<ChevronRight/>}</div>)}</div>
      </section>

      <section className="section snapshot">
        <div className="section-head"><div><p className="kicker">PROFESSIONAL SNAPSHOT</p><h2>Enterprise scale. <em>Measurable impact.</em></h2></div><p>Verified scope across test management, analytics and automation — translated into dependable delivery systems.</p></div>
        <div className="metrics">{metrics.map(([v,l,supporting],i)=><div className="metric" key={l}><span>0{i+1}</span><strong>{v}</strong><p>{l}</p>{supporting && <small>{supporting}</small>}</div>)}</div>
      </section>

      <section className="section command" id="expertise">
        <div className="section-head"><div><p className="kicker">TEST MANAGEMENT COMMAND CENTER</p><h2>Control complexity.<br/><em>Enable confident decisions.</em></h2></div><p>A connected operating model covering governance, delivery, insights and automation.</p></div>
        <div className="cap-grid">{capabilities.map(({icon:Icon,title,text},i)=><article className="cap-card" key={title}><div className="cap-number">0{i+1}</div><Icon className="cap-icon"/><h3>{title}</h3><p>{text}</p><div className="line"/></article>)}</div>
      </section>

      <section className="leadership section">
        <div className="leadership-icon"><Network/></div><div><p className="kicker">TESTING LEADERSHIP & STAKEHOLDER COORDINATION</p><blockquote>Coordinating daily test execution across market testers, Finance Product Teams, Workstream Leads, rollout organisations and technical partners—driving proactive follow-ups, blocker resolution, recovery actions and transparent reporting to maintain delivery momentum.</blockquote><p className="leadership-support">I independently organise cross-functional testing and defect meetings, prepare status material, document actions, track owners and deadlines, and escalate overdue items.</p></div>
      </section>

      <section className="section projects" id="projects">
        <div className="section-head"><div><p className="kicker">SELECTED PORTFOLIO</p><h2>Systems built to <em>move work forward.</em></h2></div><p>Confidentiality-safe case studies focused on transferable challenges, approaches and outcomes.</p></div>
        <div className="case-grid">{cases.map(c=><article className="case" key={c.title}><div className="case-top"><span>{c.n}</span><Sparkles size={18}/></div><h3>{c.title}</h3><dl><div><dt>Challenge</dt><dd>{c.challenge}</dd></div><div><dt>My role</dt><dd>{c.role}</dd></div><div><dt>Approach</dt><dd>{c.approach}</dd></div><div><dt>Technology</dt><dd>{c.tech}</dd></div><div><dt>Scale</dt><dd>{c.scale}</dd></div><div><dt>Impact</dt><dd>{c.impact}</dd></div></dl></article>)}</div>
      </section>

      <section className="section experience" id="experience">
        <div className="section-head"><div><p className="kicker">EXPERIENCE</p><h2>From engineering delivery to <em>enterprise transformation.</em></h2></div></div>
        <div className="timeline">{experience.map((e,i)=><article key={e.company}><div className="time-marker"><span>{String(i+1).padStart(2,'0')}</span></div><div className="exp-period">{e.period}</div><div className="exp-main">{e.subtitle && <p>{e.subtitle}</p>}<h3>{e.company}</h3><h4>{e.role}</h4><div>{e.text}</div>{'points' in e && <ul className="exp-points">{e.points?.map(point=><li key={point}>{point}</li>)}</ul>}</div></article>)}</div>
      </section>

      <section className="section" id="education">
        <div className="section-head"><div><p className="kicker">EDUCATION & CERTIFICATIONS</p><h2>Academic foundation. <em>Applied expertise.</em></h2></div></div>
        <div className="case-grid">
          <article className="case"><div className="case-top"><span>EDUCATION</span></div><h3>MBA & Engineering (Operational Excellence)</h3><dl><div><dt>Institution</dt><dd>Hof University of Applied Sciences, Germany</dd></div><div><dt>Period</dt><dd>October 2022 – May 2025</dd></div><div><dt>Thesis</dt><dd>Master’s thesis grade: 1.3</dd></div></dl></article>
          <article className="case"><div className="case-top"><span>CREDENTIALS</span></div><h3>Certifications</h3><dl><div><dt>Certified</dt><dd>Lean Six Sigma Green Belt<br/>Atlassian Agile Project Management Professional Certificate<br/>Google Project Management Professional Certificate — Google</dd></div><div><dt>Professional Training</dt><dd>SAP S/4HANA — University coursework covering MM, PM, SD, PP and CO<br/>PMI Agile Certified Practitioner (PMI-ACP)® Exam Preparation — LinkedIn Learning<br/>ISTQB® Certified Tester Foundation Level (CTFL) — Planned</dd></div></dl></article>
        </div>
      </section>

      <section className="section tech" id="stack">
        <div className="section-head"><div><p className="kicker">TECHNOLOGY STACK</p><h2>Tools selected for <em>real outcomes.</em></h2></div><p>Enterprise platforms, engineering tools and emerging technologies connected into pragmatic solutions.</p></div>
        <div className="stack-grid">{stack.map(([title,items],i)=><article key={title}><div><Code2 size={18}/><span>0{i+1}</span></div><h3>{title}</h3><p>{items}</p></article>)}</div>
      </section>

      <section className="contact section" id="contact">
        <div className="contact-glow"/><p className="kicker">LET’S BUILD WHAT’S NEXT</p><h2>Turning complex test-management processes into <em>automated, scalable and data-driven solutions.</em></h2><p>Interested in enterprise test transformation, intelligent automation or applied GenAI? Let’s connect.</p>
      </section>
    </main>
    <footer><a className="brand" href="#top"><span>AP</span><i/></a><p>© {new Date().getFullYear()} Akshay Panchawate. Built with intent in Munich.</p><a href="#top">Back to top ↑</a></footer>
  </div>
}

export default App
