import {createServer} from 'vite';
import {test} from 'node:test';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
import fs from 'node:fs';
test('navigation, resource states, reduced motion and floating-control collision handling',async()=>{
const rootDir=fileURLToPath(new URL('../',import.meta.url));
const server=await createServer({root:rootDir,configFile:path.join(rootDir,'vite.config.ts'),server:{middlewareMode:true,hmr:false,ws:false},appType:'custom',plugins:[{name:'phase1-ui-hooks',enforce:'pre',transform(source,id){if(id.endsWith('/App.tsx'))return source.replace("import { useEffect, useState } from 'react'",'const {useEffect,useState}=globalThis.__uxHooks');if(id.endsWith('/Tabs.tsx'))return source.replace("import { useId } from 'react'","const useId = () => 'test-tabs'");if(id.endsWith('/resourceAssets.ts')||id.endsWith('/SiteNavigation.tsx')||id.endsWith('/FloatingBackToTop.tsx'))return source.replace("import { useEffect, useState } from 'react'",'const {useEffect,useState}=globalThis.__uxHooks').replace("import { useEffect, useRef, useState } from 'react'",'const {useEffect,useRef,useState}=globalThis.__uxHooks')}}]});
let state=[],cursor=0,effectIndex=0,deps=[],pending=[],dirty=false,frames=[],cleanup=[];
const listeners=new Map();let reduced=false,colliders=[];const focused=[],scrolled=[];
globalThis.__uxHooks={useState(initial){const i=cursor++;if(state[i]===undefined)state[i]=initial;return[state[i],value=>{const next=typeof value==='function'?value(state[i]):value;if(next!==state[i]){state[i]=next;dirty=true}}]},useEffect(fn,values){const i=effectIndex++;if(!deps[i]||values.some((v,j)=>v!==deps[i][j])){deps[i]=values;pending.push(fn)}},useRef(){return{current:{offsetWidth:164,offsetHeight:44}}}};
const reset=()=>{cleanup.forEach(fn=>fn());cleanup=[];state=[];cursor=0;effectIndex=0;deps=[];pending=[];dirty=false;frames=[];listeners.clear()};
const render=fn=>{cursor=0;effectIndex=0;dirty=false;let node=fn();while(node?.type?.name==='Localized')node=node.props.children;return node};
const settle=async fn=>{let root;for(let i=0;i<15;i++){root=render(fn);const work=pending;pending=[];for(const effect of work){const fn=effect();if(typeof fn==='function')cleanup.push(fn)}const callbacks=frames;frames=[];callbacks.forEach(fn=>fn());await new Promise(resolve=>setImmediate(resolve));if(!dirty&&!pending.length&&!frames.length)return root}throw Error('Unsettled effect')};
const flatten=node=>node==null||typeof node==='boolean'?[]:Array.isArray(node)?node.flatMap(flatten):typeof node==='object'?typeof node.type==='function'?node.type.name==='Localized'?flatten(node.props.children):node.type.name==='LanguageSwitcher'?[]:flatten(node.type(node.props)):[node,...flatten(node.props?.children)]:[];
const text=node=>node==null||typeof node==='boolean'?'':Array.isArray(node)?node.map(text).join(''):typeof node==='object'?text(node.props?.children):String(node);
const originalFetch=globalThis.fetch;
globalThis.requestAnimationFrame=fn=>{frames.push(fn);return frames.length};globalThis.cancelAnimationFrame=()=>{};
globalThis.getComputedStyle=()=>({right:'16px',bottom:'20px'});
globalThis.HTMLDetailsElement=class {open=false;parentElement=null};
const nodesById=new Map();const details=new HTMLDetailsElement();const childDetails=new HTMLDetailsElement();
function target(id,position=0){const element={id,parentElement:null,hasAttribute:()=>true,setAttribute(){},getBoundingClientRect:()=>({top:position-window.scrollY}),scrollIntoView:options=>scrolled.push({id,...options,expanded:details.open&&childDetails.open}),focus:()=>focused.push(id),closest:()=>({querySelector:()=>childDetails})};nodesById.set(id,element);return element}
const sections=[target('top',0),target('about',800),target('explore-expertise',1400),target('projects',2200),target('decision-centre',3200),target('experience',4200),target('resources',5200),target('contact',6200)];target('menu-toggle');const hub=target('automation-hub');hub.parentElement=details;
const add=(type,fn)=>listeners.set(type,fn),remove=type=>listeners.delete(type);
globalThis.document={getElementById:id=>nodesById.get(id)??null,querySelectorAll:selector=>selector.includes('main > section')?sections:colliders,addEventListener:add,removeEventListener:remove};
globalThis.window={scrollY:0,innerWidth:1024,innerHeight:768,location:{hash:''},history:{pushState(a,b,hash){window.location.hash=hash}},matchMedia:()=>({matches:reduced}),addEventListener:add,removeEventListener:remove};
try{
 const assets=await server.ssrLoadModule('/src/resourceAssets.ts');
 globalThis.fetch=async url=>{try{return new Response(fs.readFileSync(path.join(rootDir,'public/resources',String(url).split('/').at(-1))))}catch{return new Response('',{status:404})}};
 reset();const loaded=await settle(()=>assets.usePortfolioResources());assert.deepEqual(loaded,{cv:'available',presentation:'available',powerpoint:'available'});assert.equal(assets.resourceUrl(assets.resourceFiles.cv),'/portfolio/resources/cv.pdf');
 const {default:Hero,PresentationAction}=await server.ssrLoadModule('/src/DocumentActions.tsx');
 let root=Hero({assets:{...loaded,presentation:'unavailable'}});let nodes=flatten(root);assert(nodes.some(n=>n.type==='a'&&n.props.download&&text(n).includes('Download CV')));assert(nodes.some(n=>n.type==='a'&&text(n).includes('View Presentation')&&n.props.href==='#resources'));assert(!nodes.some(n=>n.type==='a'&&n.props.download?.endsWith('.pptx')));assert(!nodes.some(n=>n.type==='a'&&n.props.target==='_blank'));assert(nodes.some(n=>n.type==='a'&&n.props.href==='#explore-expertise'));
 nodes=flatten(Hero({assets:{...loaded,presentation:'available'}}));assert(nodes.some(n=>n.type==='a'&&n.props.href==='/portfolio/resources/enterprise-test-management.pdf'&&n.props.target==='_blank'&&n.props.rel==='noopener noreferrer'));
 nodes=flatten(PresentationAction({assets:{...loaded,presentation:'available'}}));assert.equal(nodes.filter(n=>n.type==='details').length,0);assert(nodes.some(n=>n.type==='a'&&text(n).includes('View Presentation')&&n.props.target==='_blank'));assert(nodes.some(n=>n.type==='a'&&text(n).trim()==='Download PowerPoint'));
 nodes=flatten(Hero({assets:{cv:'unavailable',presentation:'unavailable',powerpoint:'unavailable'}}));assert.equal(nodes.filter(n=>n.type==='a').length,2);assert(!nodes.some(n=>n.type==='button'&&n.props.disabled));
 const {goToSection,handleSectionLink}=await server.ssrLoadModule('/src/navigation/sectionNavigation.ts');
 reduced=false;assert(goToSection('automation-hub',true));assert(details.open&&childDetails.open);assert.equal(scrolled.at(-1).expanded,true);assert.equal(scrolled.at(-1).behavior,'smooth');assert.equal(focused.at(-1),'automation-hub');
 reduced=true;assert(goToSection('top'));assert.equal(scrolled.at(-1).behavior,'auto');assert.equal(window.location.hash,'#top');assert.equal(goToSection('missing'),false);
 let prevented=false;handleSectionLink({button:0,metaKey:true,preventDefault(){prevented=true}},'top');assert(!prevented);handleSectionLink({button:0,preventDefault(){prevented=true}},'top');assert(prevented);
 const {default:Nav}=await server.ssrLoadModule('/src/navigation/SiteNavigation.tsx');let closed=0;const navProps={open:false,onClose:()=>closed++,onToggle(){},cv:'available'};
 reset();window.scrollY=0;root=await settle(()=>Nav(navProps));assert(flatten(root).some(n=>n.type==='a'&&n.props.download));
 window.scrollY=1450;listeners.get('scroll')();root=await settle(()=>Nav(navProps));assert(flatten(root).some(n=>n.type==='a'&&n.props.href==='#explore-expertise'&&n.props['aria-current']==='location'));
 root=render(()=>Nav({...navProps,open:true,cv:'unavailable'}));const header=flatten(root).find(n=>n.type==='header');header.props.onKeyDown({key:'Escape'});assert.equal(closed,1);assert.equal(focused.at(-1),'menu-toggle');assert(!flatten(root).some(n=>n.type==='a'&&n.props.download));
 root=render(()=>Nav({...navProps,open:true,presentation:'available'}));nodes=flatten(root);
 const documentLinks=nodes.filter(n=>n.type==='a'&&n.props.href==='/portfolio/resources/enterprise-test-management.pdf');assert.equal(documentLinks.length,2);for(const link of documentLinks){assert.equal(link.props.target,'_blank');assert.equal(link.props.rel,'noopener noreferrer')}
 const cvLink=nodes.find(n=>n.type==='a'&&n.props.download);assert.equal(cvLink.props.href,'/portfolio/resources/cv.pdf');assert.equal(cvLink.props.download,'Akshay-Panchawate-CV.pdf');
 const mobileToggle=nodes.find(n=>n.type==='button');assert.equal(mobileToggle.props['aria-expanded'],true);assert.equal(mobileToggle.props['aria-controls'],'primary-nav');
 const primary=nodes.find(n=>n.type==='nav');const primaryLinks=flatten(primary).filter(n=>n.type==='a'&&!n.props.className?.includes('nav-mobile-only'));assert.deepEqual(primaryLinks.map(text),['Overview','Expertise','Case Studies','Live Demo','Experience','Contact']);
 for(const link of primaryLinks){const beforeClose=closed;link.props.onClick({button:0,preventDefault(){}});assert.equal(closed,beforeClose+1)}
 const beforeBlur=closed;root.props.onBlurCapture({currentTarget:{contains:()=>false},relatedTarget:{}});assert.equal(closed,beforeBlur+1);root.props.onBlurCapture({currentTarget:{contains:()=>true},relatedTarget:{}});assert.equal(closed,beforeBlur+1);
 root=render(()=>Nav({...navProps,open:true,presentation:'unavailable'}));nodes=flatten(root);const pending=nodes.find(n=>n.props?.className==='nav-presentation');assert.equal(pending.props.href,'#resources');assert.equal(pending.props.target,undefined);assert(pending.props['aria-label'].includes('PDF unavailable'));pending.props.onClick({button:0,preventDefault(){}});assert.equal(focused.at(-1),'resources');
 let toggled=0;const menuTarget=target('primary-nav');menuTarget.querySelector=()=>nodesById.get('about');root=render(()=>Nav({...navProps,onToggle:()=>toggled++}));flatten(root).find(n=>n.type==='button').props.onClick();for(const callback of frames.splice(0))callback();assert.equal(toggled,1);assert.equal(focused.at(-1),'about','Opening the mobile menu focuses the first route');
 const {default:Floating}=await server.ssrLoadModule('/src/navigation/FloatingBackToTop.tsx');
 reset();window.scrollY=599;root=await settle(()=>Floating({menuOpen:false}));assert(root.props.hidden);
 window.scrollY=700;listeners.get('scroll')();root=await settle(()=>Floating({menuOpen:false}));assert(!root.props.hidden);
 colliders=[{getBoundingClientRect:()=>({left:970,right:1000,top:710,bottom:740,width:30,height:30})}];listeners.get('scroll')();root=await settle(()=>Floating({menuOpen:false}));assert(root.props.hidden,'Floating control avoids underlying controls');
 colliders=[{getBoundingClientRect:()=>({left:850,right:870,top:710,bottom:740,width:20,height:30})}];listeners.get('scroll')();root=await settle(()=>Floating({menuOpen:false}));assert(root.props.hidden,'Collision check uses the full measured label width');
 colliders=[];listeners.get('scroll')();root=await settle(()=>Floating({menuOpen:false}));assert(!root.props.hidden);assert(text(root).includes('Back to Top'));
 colliders=[];root=await settle(()=>Floating({menuOpen:true}));assert(root.props.hidden);
 root=await settle(()=>Floating({menuOpen:false}));root.props.onClick();assert.equal(focused.at(-1),'top');
 const {default:Tabs}=await server.ssrLoadModule('/src/decision-centre/Tabs.tsx');
 const labels=['UAT Execution','Defect & Quality Risks','Release Readiness','International Rollouts'];let selected=0,activated=0;
 for(let i=0;i<4;i++)target(`test-tabs-tab-${i}`);
 const tabProps={labels,active:0,onChange:value=>selected=value,label:'Decision Centre modules',cards:labels.map(()=>({description:'Synthetic view',icon:null})),onActivate:()=>activated++,children:'Dashboard content'};
 root=Tabs(tabProps);nodes=flatten(root);const cards=nodes.filter(n=>n.props?.role==='tab');assert.equal(cards.length,4);
 for(let i=0;i<4;i++){cards[i].props.onClick();assert.equal(selected,i);assert.equal(activated,i+1)}
 for(const [key,expected]of [['ArrowRight',1],['ArrowLeft',3],['Home',0],['End',3]]){let prevented=false;cards[0].props.onKeyDown({key,preventDefault(){prevented=true}});assert(prevented);assert.equal(selected,expected);assert.equal(focused.at(-1),`test-tabs-tab-${expected}`)}
 assert.equal(activated,4,'Arrow navigation keeps focus on tabs rather than scrolling away');
 root=Tabs({...tabProps,active:3});nodes=flatten(root);assert.equal(nodes.filter(n=>n.props?.role==='tab'&&n.props['aria-selected']).length,1);assert.equal(nodes.find(n=>n.props?.role==='tabpanel'&&!n.props.hidden).props['aria-labelledby'],'test-tabs-tab-3');
 const {default:App}=await server.ssrLoadModule('/src/App.tsx');
 reset();const hidden=target('defect-classification');hidden.parentElement=details;details.parentElement=childDetails;details.open=false;childDetails.open=false;
 window.location.hash='#defect-classification';await settle(()=>App());assert(details.open&&childDetails.open,'Refreshed hash opens all disclosure ancestors');assert.equal(focused.at(-1),'defect-classification');
 details.open=false;childDetails.open=false;window.location.hash='#defect%2Dclassification';listeners.get('hashchange')();assert(details.open&&childDetails.open);assert.equal(focused.at(-1),'defect-classification');
 details.open=false;window.location.hash='#defect-classification';listeners.get('popstate')();assert(details.open,'Back/forward navigation reveals hidden content');
 window.location.hash='#%E0%A4%A';assert.doesNotThrow(()=>listeners.get('hashchange')());
 console.log('PASS: real CV/PPTX availability and correct base paths; hero CV/PPTX and both-format menu states; missing assets without fake actions; accordion expansion before scrolling; reduced-motion focus transfer; modified-click preservation; active header tracking and Escape; floating 600px threshold, collision avoidance and menu suppression.');
}finally{reset();await server.close();globalThis.fetch=originalFetch;delete globalThis.__uxHooks;delete globalThis.window;delete globalThis.document;delete globalThis.HTMLDetailsElement;delete globalThis.getComputedStyle;delete globalThis.requestAnimationFrame;delete globalThis.cancelAnimationFrame}

})
