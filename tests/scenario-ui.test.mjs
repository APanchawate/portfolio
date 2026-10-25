import {test,before,after} from 'node:test'
import assert from 'node:assert/strict'
import {createServer} from 'vite'
import React from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
let server,Centre,App,engine,ui,MetricHelp,ScenarioProvider,useScenario,ScenarioControls,SiteNavigation,ExploreDetails,content,caseContent,ProfessionalResources,HeroActions
before(async()=>{
  server=await createServer({configFile:'vite.config.ts',server:{middlewareMode:true,hmr:false,ws:false},appType:'custom',plugins:[{name:'scenario-render-initial-view',enforce:'pre',transform(source,id){
    if(id.endsWith('/DecisionCentre.tsx'))return source.replace('const [active, setActive] = useState(0)','const [active, setActive] = useState(globalThis.__testMainModule ?? 0)').replace('const [executionView, setExecutionView] = useState(0)','const [executionView, setExecutionView] = useState(globalThis.__testSubView ?? 0)').replace('const [riskView, setRiskView] = useState(0)','const [riskView, setRiskView] = useState(globalThis.__testSubView ?? 0)').replace('const [readinessView, setReadinessView] = useState(0)','const [readinessView, setReadinessView] = useState(globalThis.__testSubView ?? 0)')
    if(id.endsWith('/ScenarioContext.tsx'))return source.replace('() => createScenario()', '() => globalThis.__testScenario ?? createScenario()')
    if(id.endsWith('/MarketGovernance.tsx'))return source.replace('const [active,setActive]=useState(0)','const [active,setActive]=useState(globalThis.__testSubView ?? 0)')
  }}]})
  Centre=(await server.ssrLoadModule('/src/decision-centre/DecisionCentre.tsx')).default
  App=(await server.ssrLoadModule('/src/App.tsx')).default
  SiteNavigation=(await server.ssrLoadModule('/src/navigation/SiteNavigation.tsx')).default
  ProfessionalResources=(await server.ssrLoadModule('/src/ProfessionalResources.tsx')).default
  HeroActions=(await server.ssrLoadModule('/src/DocumentActions.tsx')).default
  ExploreDetails=(await server.ssrLoadModule('/src/ExploreDetails.tsx')).default
  content=await server.ssrLoadModule('/src/enterpriseContent.ts')
  caseContent=await server.ssrLoadModule('/src/portfolioCases.ts')
  engine=await server.ssrLoadModule('/src/decision-centre/scenario/engine.ts')
  ui=await server.ssrLoadModule('/src/decision-centre/scenario/SharedUi.tsx')
  ScenarioControls=(await server.ssrLoadModule('/src/decision-centre/scenario/ScenarioControls.tsx')).default
  MetricHelp=(await server.ssrLoadModule('/src/decision-centre/scenario/MetricHelp.tsx')).default
  ;({ScenarioProvider,useScenario}=await server.ssrLoadModule('/src/decision-centre/scenario/ScenarioContext.tsx'))
})
after(async()=>{delete globalThis.__testScenario;delete globalThis.__testMainModule;delete globalThis.__testSubView;await server?.close()})
test('all twelve gadget views render under the real shared provider with unique IDs and valid tab relationships',()=>{
  const views=[['UAT Execution Forecast &amp; Schedule Intelligence','UAT Scope Change Intelligence','Planned and actual active tester capacity','UAT Planning, Execution &amp; Readiness'],['Defect Intelligence','Test Execution Evidence Compliance','Test Data Readiness &amp; Execution Blockers','Business-Process Risk Heatmap'],['Shared-Scenario Readiness Assessment','Release Readiness Risk Drivers'],['International UAT Control Tower','Dependencies &amp; Escalation Coordination']]
  for(let module=0;module<views.length;module++)for(let view=0;view<views[module].length;view++){
    globalThis.__testMainModule=module;globalThis.__testSubView=view
    const html=renderToStaticMarkup(React.createElement(Centre,{}))
    assert(html.includes(views[module][view]),`${module}/${view}`)
    assert(html.includes('Interactive demonstration · Synthetic data'));assert(html.includes('not actual client or programme performance.'))
    const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size)
    for(const [,id]of html.matchAll(/aria-controls="([^"]+)"/g))assert(ids.includes(id),id)
    assert(html.includes('Advanced Simulation Settings'));assert(!html.includes('Undo last change'));assert(!html.includes('Reset to Default Scenario'));assert(html.includes('Business Product')===false)
    const mainTabs=html.slice(html.indexOf('aria-label="Decision Centre modules"'),html.indexOf('<h3 class="dc-module-title"'))
    assert.equal((mainTabs.match(/role="tab"/g)||[]).length,4)
  }
})
test('Phase 1 navigation, case studies and real-document resource infrastructure remain intact',()=>{
  globalThis.__testMainModule=0;globalThis.__testSubView=0
  const html=renderToStaticMarkup(React.createElement(App))
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size)
  for(const [,id]of html.matchAll(/href="#([^"]+)"/g))assert(ids.includes(id),id)
  assert.equal((html.match(/class="case featured-case"/g)||[]).length,4)
  assert.equal((html.match(/class="stage-number"/g)||[]).length,5)
  assert.equal((html.match(/class="floating-to-top"/g)||[]).length,1)
  assert.equal((html.match(/class="section-return"/g)||[]).length,16)
  assert.equal((html.match(/class="expertise-navigation-card"/g)||[]).length,9)
  assert(!/href="[^\"]*linkedin/i.test(html));assert(!/\bFRZ\b/.test(html))
  for(const text of ['Available from 1 January 2027','Up to 50% business travel','B1 Certified','Test Management Automation Impact Explorer','International SAP S/4HANA UAT Rollout Experience'])assert(html.includes(text),text)
})

test('metric explanations are keyboard-operable native disclosures and missing values are explicit',()=>{
  for(const label of ['Execution variance','Evidence compliance','Scope change','Forecast completion','Data-blocked cases','Test-data blocker','Readiness threshold']){
    const html=renderToStaticMarkup(React.createElement(MetricHelp,{label}))
    assert(html.includes('<details'));assert(html.includes(`aria-label="Explain ${label}"`));assert(html.includes('<summary'))
  }
  for(const value of [null,NaN,Infinity,-Infinity])assert.equal(ui.percent(value),'N/A')
  assert.equal(ui.percent(12.5),'12.5%')
  const table=renderToStaticMarkup(React.createElement(ui.ScenarioTable,{caption:'Empty example',headers:['Case','Status'],children:[]}))
  assert(table.includes('No matching records'));assert(table.includes('colSpan="2"')||table.includes('colspan="2"'))
  const bars=renderToStaticMarkup(React.createElement(ui.GroupBars,{title:'Empty breakdown',items:[{label:'None',count:0}]}))
  assert(bars.includes('No records in this breakdown'));assert(!/NaN|Infinity/.test(bars))
})
test('empty shared scenarios remain readable across execution, evidence, defects, data, markets and readiness',()=>{
  const seed=engine.createScenario();globalThis.__testScenario={...seed,cases:[],defects:[]}
  try {
    for(const [module,view,text] of [[0,0,'No in-scope cases'],[1,0,'No defects match'],[1,1,'No executed cases'],[1,2,'No unexecuted test-data blockers'],[2,0,'No applicable scope'],[3,0,'No applicable scope']]){
      globalThis.__testMainModule=module;globalThis.__testSubView=view
      const html=renderToStaticMarkup(React.createElement(Centre))
      assert(html.includes(text),`${module}/${view}: ${text}`);assert(!/NaN|Infinity/.test(html))
      if(module===3)for(const [,content] of html.matchAll(/<button[^>]*aria-pressed="[^"]*"[^>]*>([\s\S]*?)<\/button>/g))assert(!/<(?:dl|h[1-6])\b/.test(content))
    }
  } finally {delete globalThis.__testScenario}
})
test('scenario consumers share one coherent metric snapshot and future chart tooltips respect the cutoff',()=>{
  const received=[]
  function Consumer(){received.push(useScenario().metrics);return null}
  renderToStaticMarkup(React.createElement(ScenarioProvider,null,React.createElement(Consumer),React.createElement(Consumer)))
  assert.equal(received.length,2);assert.equal(received[0],received[1])
  globalThis.__testMainModule=0;globalThis.__testSubView=0
  const html=renderToStaticMarkup(React.createElement(Centre))
  assert(html.includes('actual not reported at the current cutoff'));assert(!html.includes('onPointerEnter'))
})

test('executive overview has three KPIs, a single four-card module navigation and collapsed advanced settings',()=>{
  globalThis.__testMainModule=0;globalThis.__testSubView=0
  const html=renderToStaticMarkup(React.createElement(Centre))
  const overview=html.slice(html.indexOf('class="dc-overview-kpis"'),html.indexOf('aria-label="Decision Centre modules"'))
  for(const label of ['Execution Progress','Open Defects','Test Scope'])assert(overview.includes(`<dt>${label}</dt>`))
  assert.equal((overview.match(/<dd>/g)||[]).length,3)
  assert.equal((html.match(/aria-label="Decision Centre modules"/g)||[]).length,1)
  for(const label of ['UAT Execution','Defect &amp; Quality Risks','Release Readiness','International Rollouts'])assert(html.includes(`class="dc-navigation-title">${label}`))
  const accordion=html.match(/<details class="explore-details dc-advanced-exploration"([^>]*)>([\s\S]*?)<\/details>/)
  assert(accordion);assert(!accordion[1].includes('open'))
  for(const label of ['Scenario preset','Market','Finance Product','Reporting date','Scenario assumptions'])assert(accordion[2].includes(label))
  const status=html.match(/<div class="scenario-state-line"><p role="status">([\s\S]*?)<\/p>/)[1]
  assert(status.includes('Unmodified preset'));assert(!/executed|in scope|open defects/.test(status))
})
test('Undo and Reset appear only for applicable changes, including filter and gadget settings',()=>{
  const seed=engine.createScenario()
  globalThis.__testMainModule=0;globalThis.__testSubView=0
  const render=()=>renderToStaticMarkup(React.createElement(Centre))
  try {
    globalThis.__testScenario={...seed,filters:{...seed.filters,market:'Canada'}}
    let html=render();assert(html.includes('Reset to Default Scenario'));assert(!html.includes('Undo last change'))
    delete globalThis.__testScenario
    html=renderToStaticMarkup(React.createElement(ScenarioProvider,null,React.createElement(ScenarioControls,{hasGadgetChanges:true})))
    assert(html.includes('Reset to Default Scenario'));assert(!html.includes('Undo last change'))
    globalThis.__testScenario=engine.scenarioReducer(seed,{type:'add',quantity:10})
    html=render();assert(html.includes('Reset to Default Scenario'));assert(html.includes('Undo last change'))
    globalThis.__testScenario=engine.scenarioReducer(globalThis.__testScenario,{type:'reset'})
    html=render();assert(!html.includes('Reset to Default Scenario'));assert(!html.includes('Undo last change'))
  } finally { delete globalThis.__testScenario }
})

test('one five-stage UAT recipe links to one integrated reporting framework with accurate report definitions',()=>{
  globalThis.__testMainModule=0;globalThis.__testSubView=0
  const html=renderToStaticMarkup(React.createElement(App))
  assert.equal((html.match(/id="approach"/g)||[]).length,1)
  assert.equal((html.match(/id="reporting-transformation"/g)||[]).length,1)
  assert.equal((html.match(/id="reporting-framework-title"/g)||[]).length,1)
  assert.equal((html.match(/class="reporting-view-card"/g)||[]).length,4)
  assert(!html.includes('15–20-page'))
  const recipe=html.slice(html.indexOf('id="approach"'),html.indexOf('id="decision-centre"'))
  let previous=-1
  for(const title of ['Scope Preparation','Business Validation','Execution Readiness','UAT Execution Monitoring','Reporting &amp; Stakeholder Follow-up']){const next=recipe.indexOf(title);assert(next>previous,title);previous=next}
  assert(recipe.includes('href="#reporting-transformation"'));assert(recipe.includes('formal')||recipe.includes('Formal business acceptance'))
  for(const text of ['15-Page Enterprise UAT KPI Reporting Framework','Four key management views within an automated reporting package.','Failed test cases / Total test cases × 100','It is not failed/executed','Critical, High, Medium and Low','To Do, Pass, Fail, Executing, Blocked and Total','Confluence Publication','The other eleven pages are not specified here'])assert(html.includes(text),text)
  assert(html.includes('This synthetic demonstration does not model them separately'))
  assert(!/<img/.test(html.slice(html.indexOf('id="reporting-transformation"'),html.indexOf('id="technical-projects"'))))
})

test('public rollout experience uses four regional groups and general phases without country or entity detail',()=>{
  globalThis.__testMainModule=0;globalThis.__testSubView=0
  const html=renderToStaticMarkup(React.createElement(App))
  assert.equal((html.match(/id="rollouts"/g)||[]).length,1)
  const region=html.slice(html.indexOf('id="rollouts"'),html.indexOf('id="expertise"'))
  assert.equal((region.match(/<article>/g)||[]).length,4)
  for(const label of ['Europe','North &amp; South America','East Asia','Western Europe','Completed UAT Experience','Ongoing UAT Support','Rollout Preparation / Ongoing Support','Scope Preparation','Execution Readiness','Ongoing UAT','Completed UAT'])assert(region.includes(label),label)
  assert(!/United States|Canada|China|Benelux|Mexico|Germany|company codes|Period [1-6]|20\d{2}|FRZ/.test(region.replace(/<[^>]+>/g, ' ')))
  assert(region.includes('not all simultaneously executing UAT'));assert(region.includes('formal UAT sign-off and go-live authorization remain'))
  for(const text of ['20+ company codes','22','7,000+','400+'])assert(html.includes(text),text)
  assert(!html.includes('30+ company codes'))
})

test('AI experience stays integrated, navigable and explicit about implemented use versus the Azure roadmap',()=>{
  globalThis.__testMainModule=0;globalThis.__testSubView=0
  const html=renderToStaticMarkup(React.createElement(App))
  assert.equal((html.match(/id="ai-engineering"/g)||[]).length,1)
  assert.equal((html.match(/AI-Assisted Engineering &amp; Delivery<\/h3>/g)||[]).length,1)
  assert.equal((html.match(/class="ai-experience-card"/g)||[]).length,6)
  assert(html.includes('href="#ai-engineering"'));assert(html.includes('AI knowledge agents, Python development, GitHub Copilot, Playwright, debugging and intelligent workflow support.'))
  const hero=html.slice(html.indexOf('id="top"'),html.indexOf('id="about"'))
  assert(hero.includes('hands-on Python automation and AI-assisted engineering'));assert.equal((hero.match(/class="hero-text"/g)||[]).length,1);assert(!hero.includes('class="hero-ai"'))
  assert(hero.includes('Enterprise Test Management &amp; <em>Automation Specialist'))
  const ai=html.slice(html.indexOf('id="ai-engineering"'),html.indexOf('id="education"'))
  for(const title of ['Python &amp; API Development','Enterprise AI Knowledge Agents','Debugging &amp; Playwright','GitHub Copilot &amp; Development','Business Productivity','Cloud Automation Roadmap','Programme Knowledge Assistant','Test Management Knowledge Assistant'])assert(ai.includes(title),title)
  assert(ai.includes('Exploring / Planned'));assert(ai.includes('is not deployed'));assert(ai.includes('existing AI platform'))
  assert(html.includes('AI-Assisted Development Approach'));assert(html.includes('Python/FastAPI and REST APIs perform the automation'))
  for(const heading of ['Hands-on AI Applications','Engineering Technologies','Learning &amp; Exploration'])assert(html.includes(heading),heading)
})

test('recruiter navigation keeps six desktop routes, mobile Resources and secure document actions',()=>{
  const props={open:true,onToggle(){},onClose(){},cv:'available',presentation:'available'}
  const html=renderToStaticMarkup(React.createElement(SiteNavigation,props))
  const nav=html.slice(html.indexOf('<nav'),html.indexOf('</nav>'))
  for(const [label,id] of [['Overview','about'],['Expertise','explore-expertise'],['Case Studies','projects'],['Live Demo','decision-centre'],['Experience','experience'],['Contact','contact']])assert(nav.includes(`href="#${id}"`)&&nav.includes(`>${label}</a>`),label)
  assert(nav.includes('class="nav-mobile-only" href="#resources"'))
  assert(nav.includes('View Presentation'));assert(!nav.includes('>Projects</a>'));assert(!nav.includes('>Decision Centre</a>'))
  assert(html.includes('/portfolio/resources/enterprise-test-management.pdf'));assert(html.includes('target="_blank" rel="noopener noreferrer"'))
  assert(html.includes('download="Akshay-Panchawate-CV.pdf"'));assert(html.includes('aria-expanded="true" aria-controls="primary-nav"'))
  const pending=renderToStaticMarkup(React.createElement(SiteNavigation,{...props,presentation:'unavailable'}))
  assert(!pending.includes('enterprise-test-management.pdf'));assert(pending.includes('Presentation PDF unavailable'))
})

test('hero uses the requested single introduction and concise Hub metric; floating return has visible text',()=>{
  globalThis.__testMainModule=0;globalThis.__testSubView=0
  const html=renderToStaticMarkup(React.createElement(App))
  const hero=html.slice(html.indexOf('id="top"'),html.indexOf('id="about"'))
  assert(hero.includes('I combine enterprise Test Management governance with hands-on Python automation and AI-assisted engineering, supporting international SAP S/4HANA Finance rollouts through UAT coordination, Jira/Xray technical ownership, automated reporting and knowledge-driven workflows.'))
  assert(hero.includes('Integrated Jira/Xray automation for test management, dashboards and reporting.'))
  assert.equal((hero.match(/class="hero-text"/g)||[]).length,1);assert(!hero.includes('class="hero-ai"'))
  const floating=html.match(/<button[^>]*class="floating-to-top"[^>]*>[\s\S]*?<\/button>/)[0]
  assert(floating.includes('<span>Back to Top</span>'));assert(floating.includes('aria-label="Back to Top"'))
})

function closedAncestorsAt(html, index) {
  const stack=[]
  for(const match of html.slice(0,index).matchAll(/<\/?details\b[^>]*>/g)){
    if(match[0].startsWith('</'))stack.pop();else stack.push(!/\sopen(?:=|\s|>)/.test(match[0]))
  }
  return stack.filter(Boolean).length
}
const escapedText=text=>renderToStaticMarkup(React.createElement('p',null,text)).slice(3,-4)
test('optional details collapse by default while diagrams, summaries, AI cards and primary dashboards stay visible',()=>{
  globalThis.__testMainModule=0;globalThis.__testSubView=0
  const html=renderToStaticMarkup(React.createElement(App))
  for(const match of html.matchAll(/<details\b[^>]*>/g))assert(!/\sopen(?:=|\s|>)/.test(match[0]))
  for(const marker of ['class="hero-copy','class="expertise-navigation-grid"','class="collaboration-model"','class="scope-process"','class="lifecycle uat-recipe"','class="rollout-market-cards regional-rollout-cards"','class="ai-experience-grid"','class="uat-chart due-chart"','class="dc-overview-kpis"','id="education"','id="resources"','id="contact"']){
    const index=html.indexOf(marker);assert(index>=0,marker);assert.equal(closedAncestorsAt(html,index),0,marker)
  }
  for(const match of html.matchAll(/class="stage-number"/g))assert.equal(closedAncestorsAt(html,match.index),0)
  for(const text of ['Repository Governance','Test Execution Governance','Reporting &amp; Dashboards','Regression Management'])assert.equal(closedAncestorsAt(html,html.indexOf(`>${text}</h3>`)),0,text)
  assert(closedAncestorsAt(html,html.indexOf('id="defect-classification"'))>0)
  assert(closedAncestorsAt(html,html.indexOf('id="reporting-framework-title"'))>0)
  for(const heading of ['Explore Detailed Operating Model','Explore Scope Engineering Methodology','Explore International Delivery Details','Explore Jira/Xray Technical Details','Explore Complete UAT Methodology','Explore Responsibilities &amp; Achievements'])assert(html.includes(heading),heading)
})
test('detailed source content remains available without duplicating the reporting or AI showcase',()=>{
  globalThis.__testMainModule=0;globalThis.__testSubView=0
  const html=renderToStaticMarkup(React.createElement(App))
  for(const stage of content.scopeEngineeringStages)assert(html.includes(escapedText(stage.text)),stage.title)
  for(const [,description]of content.collaborationPartners)assert(html.includes(escapedText(description)),description)
  for(const item of caseContent.featuredCases)for(const key of ['challenge','role','approach','value','technical','stakeholders'])assert(html.includes(escapedText(item[key])),`${item.title}: ${key}`)
  for(const item of caseContent.originalCases)for(const key of ['challenge','role','approach','tech','scale','impact'])assert(html.includes(escapedText(item[key])),`${item.title}: ${key}`)
  assert.equal((html.match(/id="reporting-framework-title"/g)||[]).length,1)
  assert.equal((html.match(/id="ai-engineering"/g)||[]).length,1)
})
test('ExploreDetails uses a native summary with a stable content relationship and both disclosure labels',()=>{
  const html=renderToStaticMarkup(React.createElement(ExploreDetails,{heading:'Explore Test Detail',summary:'Short context',icon:React.createElement('span',null,'Icon')},React.createElement('p',null,'Preserved detail')))
  assert(html.startsWith('<details class="explore-details">'));assert(!html.includes(' open'))
  const id=html.match(/aria-controls="([^"]+)"/)[1];assert(html.includes(`id="${id}"`))
  for(const text of ['Explore Test Detail','Show Less','Short context','Preserved detail'])assert(html.includes(text))
  assert(html.includes('aria-hidden="true"'))
})

test('verified presentation assets give direct consistent PDF actions and a separate PowerPoint download',()=>{
  const assets={cv:'available',presentation:'available',powerpoint:'available'}
  const resources=renderToStaticMarkup(React.createElement(ProfessionalResources,{assets,onExplore(){}}))
  const hero=renderToStaticMarkup(React.createElement(HeroActions,{assets}))
  const nav=renderToStaticMarkup(React.createElement(SiteNavigation,{cv:assets.cv,presentation:assets.presentation,open:true,onClose(){},onToggle(){}}))
  assert(resources.includes('PDF and PowerPoint versions available.'))
  assert(resources.includes('A concise overview of my enterprise UAT management methodology, international testing governance, automated KPI reporting, Automation Hub and practical AI-assisted engineering experience.'))
  for(const html of [resources,hero,nav]){
    const links=[...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>[\s\S]*?<\/a>/g)].filter(match=>/View Presentation|>Presentation</.test(match[0]))
    assert(links.length>0)
    for(const match of links){assert.equal(match[1],'/portfolio/resources/enterprise-test-management.pdf');assert(match[0].includes('target="_blank"'));assert(match[0].includes('rel="noopener noreferrer"'))}
    assert(!/PDF.*pending|PDF.*unavailable/.test(html))
  }
  assert(resources.includes('href="/portfolio/resources/enterprise-test-management.pptx" download="Akshay-Panchawate-Test-Management.pptx"'))
  assert(resources.includes('Download PowerPoint'));assert(!resources.includes('presentation-options'))
})

test('shorter defaults retain five scope stages, all original detail and direct access to the primary chart',()=>{
 globalThis.__testMainModule=0;globalThis.__testSubView=0
 const html=renderToStaticMarkup(React.createElement(App))
 const scope=html.slice(html.indexOf('class="scope-process"'),html.indexOf('Explore Scope Engineering Methodology'))
 assert.equal((scope.match(/<li>/g)||[]).length,5)
 for(const marker of ['class="expertise-navigation-grid"','class="ai-experience-grid"','class="dc-overview-kpis"','class="uat-chart due-chart"','class="due-toolbar"','id="resources"','id="contact"'])assert.equal(closedAncestorsAt(html,html.indexOf(marker)),0,marker)
 assert(closedAncestorsAt(html,html.indexOf('class="overview-card-grid"'))>0)
 assert(closedAncestorsAt(html,html.indexOf('class="uat-tabs dc-navigation-cards"'))>0)
 assert(closedAncestorsAt(html,html.indexOf('class="due-metrics"'))>0)
 for(const region of content.rolloutRegions)assert(html.includes(escapedText(region.activity)),region.name)
 assert.equal((html.match(/class="case featured-case"/g)||[]).length,4)
 assert(!/<details[^>]*class="case-supporting-project"/.test(html))
 assert(!/<details[^>]*class="scope-example"/.test(html))
 const centre=html.slice(html.indexOf('id="decision-centre"'),html.indexOf('id="experience"'))
 assert.equal((centre.match(/Scenario preset<select/g)||[]).length,1)
 assert.equal((centre.match(/class="uat-chart due-chart"/g)||[]).length,1)
 assert(centre.includes('Explore Advanced Decision Centre'))
})
