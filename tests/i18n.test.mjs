import {test,before,after} from 'node:test'
import assert from 'node:assert/strict'
import {createServer} from 'vite'
import React from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import fs from 'node:fs'
import crypto from 'node:crypto'
let server,App,Centre,Provider,initialLanguage,translateMessage,localizeTree,en,de,engine,Hero,Resources,Nav
before(async()=>{
 server=await createServer({configFile:'vite.config.ts',server:{middlewareMode:true,hmr:false,ws:false},appType:'custom',plugins:[{name:'i18n-view-fixtures',enforce:'pre',transform(source,id){
  if(id.endsWith('/ScenarioContext.tsx'))return source.replace('() => createScenario()','() => globalThis.__i18nScenario ?? createScenario()')
  if(id.endsWith('/DecisionCentre.tsx'))return source.replace('const [active, setActive] = useState(0)','const [active, setActive] = useState(globalThis.__i18nModule ?? 0)').replace('const [executionView, setExecutionView] = useState(0)','const [executionView, setExecutionView] = useState(globalThis.__i18nView ?? 0)').replace('const [riskView, setRiskView] = useState(0)','const [riskView, setRiskView] = useState(globalThis.__i18nView ?? 0)').replace('const [readinessView, setReadinessView] = useState(0)','const [readinessView, setReadinessView] = useState(globalThis.__i18nView ?? 0)')
  if(id.endsWith('/MarketGovernance.tsx'))return source.replace('const [active,setActive]=useState(0)','const [active,setActive]=useState(globalThis.__i18nView ?? 0)')
 }}]})
 App=(await server.ssrLoadModule('/src/App.tsx')).default
 Hero=(await server.ssrLoadModule('/src/DocumentActions.tsx')).default
 Resources=(await server.ssrLoadModule('/src/ProfessionalResources.tsx')).default
 Nav=(await server.ssrLoadModule('/src/navigation/SiteNavigation.tsx')).default
 Centre=(await server.ssrLoadModule('/src/decision-centre/DecisionCentre.tsx')).default
 const context=await server.ssrLoadModule('/src/i18n/LanguageContext.tsx');Provider=context.LanguageProvider;initialLanguage=context.initialLanguage
 ;({translateMessage}=await server.ssrLoadModule('/src/i18n/translate.ts'))
 ;({localizeTree}=await server.ssrLoadModule('/src/i18n/Localized.tsx'))
 en=(await server.ssrLoadModule('/src/i18n/en.ts')).default;de=(await server.ssrLoadModule('/src/i18n/de.ts')).default
 engine=await server.ssrLoadModule('/src/decision-centre/scenario/engine.ts')
})
after(async()=>{delete globalThis.window;delete globalThis.__i18nScenario;delete globalThis.__i18nModule;delete globalThis.__i18nView;await server?.close()})
const setLocale=language=>{globalThis.window={localStorage:{getItem:()=>language},navigator:{language:'de-DE'}}}
const render=(Component,language,props={})=>{setLocale(language);return renderToStaticMarkup(React.createElement(Provider,null,React.createElement(Component,props)))}
test('English is the first-visit default; only a stored DE preference opts into German',()=>{
 setLocale(null);assert.equal(initialLanguage(),'en')
 setLocale('de');assert.equal(initialLanguage(),'de')
 setLocale('en');assert.equal(initialLanguage(),'en')
 setLocale('fr');assert.equal(initialLanguage(),'en')
 globalThis.window={get localStorage(){throw Error('blocked')}};assert.equal(initialLanguage(),'en')
 delete globalThis.window;assert.equal(initialLanguage(),'en')
})
test('complete typed dictionaries preserve English fallback and translate dynamic counts, dates and actions',()=>{
 assert.deepEqual(Object.keys(de).sort(),Object.keys(en).sort())
 for(const [key,value]of Object.entries(de))assert.equal(typeof value,'string',key)
 assert.equal(translateMessage('Download CV','de'),'Lebenslauf herunterladen')
 assert.equal(translateMessage('View Presentation','de'),'Präsentation ansehen')
 assert.equal(translateMessage('Documents available in English.','de'),'Dokumente sind auf Englisch verfügbar.')
 assert.equal(translateMessage('7,000+','de'),'7.000+')
 assert.equal(translateMessage('1 January 2027','de'),'1. Januar 2027')
 assert.equal(translateMessage('12 local changes','de'),'12 lokale Änderungen')
 assert.equal(translateMessage('Evidence missing for SIM-UAT-1000','de'),'Nachweise fehlend für SIM-UAT-1000')
 assert.equal(translateMessage('Unknown new copy','de'),'Unknown new copy')
 assert.equal(translateMessage('SIM-UAT-1000','de'),'SIM-UAT-1000')
 assert.equal(translateMessage('95.5%','de'),'95,5%')
 assert.equal(translateMessage('Download CV','en'),'Download CV')
})
test('presentation translation retains stable element keys, controls, values and English-only document URLs',()=>{
 const click=()=>{},original=React.createElement('div',{id:'stable',key:'root'},React.createElement('select',{value:'Canada',onChange:click},React.createElement('option',null,'Canada')),React.createElement('details',null,React.createElement('summary',null,'Explore Details'),React.createElement('p',null,'Preserved detail')),React.createElement('a',{href:'/portfolio/resources/cv.pdf',download:'Akshay-Panchawate-CV.pdf',onClick:click},'Download CV'))
 const english=localizeTree(original,'en'),german=localizeTree(original,'de')
 assert.equal(english.key,german.key);assert.equal(english.type,german.type);assert.equal(german.props.id,'stable')
 const ec=english.props.children,gc=german.props.children
 for(let i=0;i<ec.length;i++){assert.equal(ec[i].key,gc[i].key);assert.equal(ec[i].type,gc[i].type)}
 assert.equal(gc[0].props.value,'Canada');assert.equal(gc[0].props.onChange,click)
 assert.equal(gc[0].props.children.props.value,'Canada');assert.equal(gc[0].props.children.props.children,'Kanada')
 assert.equal(gc[1].props.open,undefined)
 assert.equal(gc[2].props.href,ec[2].props.href);assert.equal(gc[2].props.download,ec[2].props.download);assert.equal(gc[2].props.onClick,click)
})
test('both languages render all sections with the same anchors and appropriate document language note',()=>{
 const english=render(App,'en'),german=render(App,'de')
 const ids=html=>[...html.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map(m=>m[1])
 assert.deepEqual(ids(english),ids(german));assert.equal(ids(german).length,16)
 for(const phrase of ['Enterprise-Testmanagement','Überblick','Mein Enterprise-UAT-Vorgehensmodell','KI-gestützte Softwareentwicklung','Dokumente sind auf Englisch verfügbar.','B1-zertifiziert'])assert(german.includes(phrase),phrase)
 assert(english.includes('Documents available in English.'));assert(!english.includes('Dokumente sind auf Englisch'))
 assert(!german.includes('B2'));assert(!german.includes('cv-de.pdf'))
 assert(english.includes('aria-label="Website language"'));assert(german.includes('aria-label="Sprache der Website"'))
 const idsAll=[...german.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(idsAll.length,new Set(idsAll).size)
 for(const [,id]of german.matchAll(/aria-controls="([^"]+)"/g))assert(idsAll.includes(id),id)
})
test('all twelve German gadgets retain the same synthetic values, identifiers and controls',()=>{
 let scenario=engine.createScenario('At Risk');scenario=engine.scenarioReducer(scenario,{type:'add',quantity:10});scenario=engine.scenarioReducer(scenario,{type:'timing',days:3})
 globalThis.__i18nScenario=scenario;const baseline=JSON.stringify(scenario)
 try {
  for(let module=0;module<4;module++)for(let view=0;view<[4,4,2,2][module];view++){
   globalThis.__i18nModule=module;globalThis.__i18nView=view
   const english=render(Centre,'en'),german=render(Centre,'de')
   assert.equal(JSON.stringify(scenario),baseline)
   assert(german.includes('Interaktive Demonstration'));assert(german.includes('Synthetische Daten'))
   assert(german.includes('Erweiterte Simulationseinstellungen'));assert(!german.includes('Shared-Scenario Readiness Assessment'))
   const values=html=>[...html.matchAll(/<option\b[^>]*value="([^"]*)"/g)].map(m=>m[1])
   assert.deepEqual(values(english),values(german),`${module}/${view}`)
   const links=html=>[...html.matchAll(/href="([^"]+)"/g)].map(m=>m[1]);assert.deepEqual(links(english),links(german))
  }
 }finally{delete globalThis.__i18nScenario;delete globalThis.__i18nModule;delete globalThis.__i18nView}
})
test('English presentation and CV files retain their original supplied contents',()=>{
 for(const [source,served]of [['Akshay_Panchawate_CV.pdf','cv.pdf'],['Akshay_Panchawate_Portfolio_Presentation.pdf','enterprise-test-management.pdf'],['Akshay_Panchawate_Portfolio_Presentation.pptx','enterprise-test-management.pptx']]){
  const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
  assert.equal(hash(source),hash(`public/resources/${served}`))
 }
})

test('German CV and presentation actions use exactly the same supplied English documents',()=>{
 const assets={cv:'available',presentation:'available',powerpoint:'available'}
 for(const [Component,props] of [[Hero,{assets}],[Resources,{assets,onExplore(){}}],[Nav,{...assets,open:true,onClose(){},onToggle(){}}]]){
  const english=render(Component,'en',props),german=render(Component,'de',props)
  const documents=html=>[...html.matchAll(/(?:href|download)="([^"]+\.(?:pdf|pptx))"/g)].map(m=>m[1])
  assert.deepEqual(documents(english),documents(german))
  assert(german.includes('Präsentation ansehen'));assert(german.includes('Lebenslauf herunterladen'))
  if(Component===Resources){assert(german.includes('PowerPoint herunterladen'));assert(german.includes('Dokumente sind auf Englisch verfügbar.'))}
 }
})
test('German empty states remain understandable without changing the scenario',()=>{
 const seed=engine.createScenario();globalThis.__i18nScenario={...seed,cases:[],defects:[]}
 try{for(const [module,view,expected]of [[0,0,'Keine enthaltenen Fälle'],[1,0,'Keine Fehler entsprechen'],[1,1,'Keine durchgeführten Fälle'],[1,2,'Keine undurchgeführten Testdatenblockaden'],[2,0,'Kein anwendbarer Umfang']]){
  globalThis.__i18nModule=module;globalThis.__i18nView=view;const html=render(Centre,'de');assert(html.includes(expected),expected);assert(!/NaN|Infinity/.test(html))
 }}finally{delete globalThis.__i18nScenario;delete globalThis.__i18nModule;delete globalThis.__i18nView}
})

test('coordination and transformation positioning is visible in both languages without adding cards or changing roles',()=>{
 const english=render(App,'en'),german=render(App,'de')
 for(const html of [english,german]){
  assert.equal((html.match(/class="hero-capabilities"/g)||[]).length,1)
  assert.equal((html.match(/class="expertise-navigation-card"/g)||[]).length,9)
  assert.equal((html.match(/class="case featured-case"/g)||[]).length,4)
  assert(html.includes('BMW Group'));assert(html.includes('Bosch Powertrain Solutions'))
  assert(html.includes('id="decision-centre"'));assert(html.includes('id="rollouts"'))
 }
 assert(english.includes('Enterprise Test Management · IT Project Coordination · Process Automation · AI-Assisted Engineering'))
 assert(german.includes('Enterprise-Testmanagement · IT-Projektkoordination · Prozessautomatisierung · KI-gestützte Softwareentwicklung'))
 assert(english.includes('IT Project Coordination &amp; Digital Transformation'));assert(german.includes('IT-Projektkoordination &amp; digitale Transformation'))
 const expertise=english.slice(english.indexOf('id="explore-expertise"'),english.indexOf('id="operating-model"'))
 assert(expertise.includes('href="#experience"'));assert(expertise.includes('International stakeholder coordination, delivery planning, risk and dependency tracking, management reporting and process modernization.'))
 const history=english.slice(english.indexOf('id="experience"'),english.indexOf('id="stack"'))
 assert(history.includes('Test Management, Automation &amp; Reporting'));assert(history.includes('Project Management &amp; SAP Processes'));assert(history.includes('Junior IT Project Engineer'))
 for(const period of ['Current','Previous','Foundation'])assert(history.includes(period))
 for(const phrase of ['execution commitments','risks and dependencies','business/IT alignment','Explore Responsibilities &amp; Achievements'])assert(history.includes(phrase),phrase)
 assert(german.includes('Meilenstein- und Risikoverfolgung'))
})

test('shorter-view disclosure labels and case summaries are translated without altering document access',()=>{
 const english=render(App,'en'),german=render(App,'de')
 for(const [en,de]of [['Explore Advanced Decision Centre','Erweiterte Funktionen des Decision Centre'],['Explore Detailed Operating Model','Detailliertes Betriebsmodell ansehen'],['Explore Complete UAT Methodology','Vollständige UAT-Methodik ansehen'],['Explore Execution KPI Breakdown','Detaillierte Durchführungskennzahlen ansehen'],['Developed an integrated Hub to centralize repeatable testing workflows.','Einen integrierten Hub zur Bündelung wiederholbarer Testmanagement-Workflows entwickelt.']]){assert(english.includes(en),en);assert(german.includes(de),de)}
 for(const html of [english,german]){assert.equal((html.match(/class="ai-experience-card"/g)||[]).length,6);assert.equal((html.match(/class="stage-number"/g)||[]).length,5)}
})
