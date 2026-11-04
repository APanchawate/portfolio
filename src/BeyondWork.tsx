import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, BookOpen, Footprints, Map, MessageCircle, Music2, Trophy } from 'lucide-react'
import { useLanguage } from './i18n/LanguageContext'
import SiteNavigation from './navigation/SiteNavigation'
import FloatingBackToTop from './navigation/FloatingBackToTop'
import { usePortfolioResources } from './resourceAssets'

const copy = {
  en: {
    eyebrow: 'BEYOND WORK', title: 'Curious by nature.', accent: 'Energised by people and new perspectives.',
    intro: 'Outside work, you will often find me talking about football, discovering a new place, heading outdoors or learning something new. These interests keep me curious, open-minded and connected to different people and perspectives.',
    football: ['Football', 'For me, football is about much more than the result—it is community, shared energy and conversations that can easily last for hours.'],
    travel: ['Travel', 'I enjoy discovering places on foot, experiencing different cultures and seeing everyday life from a new perspective.'],
    outdoors: ['Outdoors', 'Lakes, trails and time outside help me reset, stay grounded and enjoy the journey as much as the destination.'],
    learning: ['Always learning', 'I enjoy learning through technology, AI, languages, music and the people around me. Curiosity keeps me moving forward.'],
    current: 'Currently learning', german: 'Improving my German',
    germanText: 'I am currently improving my German because meaningful integration goes beyond the workplace. My goal is to communicate more confidently, connect with people more naturally and participate fully in professional and everyday life in Germany.',
    values: 'What these interests say about me', valuesText: 'Curious enough to keep learning. Open enough to seek different perspectives. Dependable enough to follow through. And always happy to connect over a good football conversation.',
    prompt: 'Conversation starters', promptText: 'Ask me about football, discovering Germany, practical uses of AI, or the best view I have found while exploring.',
    back: 'Back to professional portfolio', contact: 'Start a conversation',
  },
  de: {
    eyebrow: 'ABSEITS DER ARBEIT', title: 'Von Natur aus neugierig.', accent: 'Menschen und neue Perspektiven geben mir Energie.',
    intro: 'Außerhalb der Arbeit spreche ich gerne über Fußball, entdecke neue Orte, bin draußen unterwegs oder lerne etwas Neues. Diese Interessen halten mich neugierig, offen und mit unterschiedlichen Menschen und Perspektiven verbunden.',
    football: ['Fußball', 'Fußball bedeutet für mich weit mehr als das Ergebnis – Gemeinschaft, gemeinsame Energie und Gespräche, die leicht stundenlang dauern können.'],
    travel: ['Reisen', 'Ich entdecke Orte gerne zu Fuß, lerne unterschiedliche Kulturen kennen und betrachte den Alltag aus neuen Perspektiven.'],
    outdoors: ['Draußen unterwegs', 'Seen, Wanderwege und Zeit in der Natur helfen mir, neue Energie zu tanken, geerdet zu bleiben und den Weg genauso zu genießen wie das Ziel.'],
    learning: ['Immer am Lernen', 'Ich lerne gerne durch Technologie, KI, Sprachen, Musik und die Menschen um mich herum. Neugier bringt mich weiter.'],
    current: 'Was ich aktuell lerne', german: 'Mein Deutsch verbessern',
    germanText: 'Ich verbessere derzeit aktiv mein Deutsch, weil echte Integration über den Arbeitsplatz hinausgeht. Mein Ziel ist es, sicherer zu kommunizieren, natürlicher mit Menschen in Kontakt zu treten und am beruflichen sowie alltäglichen Leben in Deutschland umfassend teilzunehmen.',
    values: 'Was diese Interessen über mich sagen', valuesText: 'Neugierig genug, um weiterzulernen. Offen genug für andere Perspektiven. Verlässlich genug, um Dinge umzusetzen. Und immer bereit für ein gutes Gespräch über Fußball.',
    prompt: 'Gesprächseinstiege', promptText: 'Fragen Sie mich nach Fußball, dem Entdecken Deutschlands, praktischen KI-Anwendungen oder der schönsten Aussicht, die ich unterwegs gefunden habe.',
    back: 'Zurück zum beruflichen Portfolio', contact: 'Gespräch beginnen',
  },
} as const

const photos = [
  ['budapest.jpg', 'Travel portrait by the illuminated Hungarian Parliament in Budapest', 'feature'],
  ['football-v2.jpg', 'Akshay at a football match in Munich', 'football'],
  ['lakeside-v2.jpg', 'Akshay exploring a sunny lakeside in Germany', 'lakeside'],
  ['ukulele.jpg', 'Akshay playing the ukulele outdoors', 'ukulele'],
  ['exploring-v2.jpg', 'Akshay exploring a historic stone arch and village', 'exploring'],
  ['celebration.jpg', 'Akshay celebrating in traditional Indian clothing', 'celebration'],
] as const

export default function BeyondWork() {
  const [open, setOpen] = useState(false)
  const { language } = useLanguage()
  const c = copy[language]
  const assets = usePortfolioResources()
  useEffect(() => { const previous = document.title; document.title = `Beyond Work · Akshay Panchawate`; window.scrollTo(0, 0); return () => { document.title = previous } }, [])
  const interests = [[Trophy, c.football], [Map, c.travel], [Footprints, c.outdoors], [BookOpen, c.learning]] as const
  return <div className="app beyond-work-page">
    <a className="skip-link" href="#main">Skip to content</a>
    <div className="ambient one"/><div className="ambient two"/><div className="ambient three"/>
    <SiteNavigation open={open} onToggle={() => setOpen(!open)} onClose={() => setOpen(false)} cv={assets.cv} presentation={assets.presentation} context="beyond-work"/>
    <main id="main" tabIndex={-1}>
      <section className="beyond-hero" id="top">
        <div className="beyond-hero-copy"><p className="kicker">{c.eyebrow}</p><h1>{c.title}<br/><em>{c.accent}</em></h1><p>{c.intro}</p></div>
        <figure className="beyond-feature"><img src="/beyond-work/budapest.jpg" alt={photos[0][1]} width="1350" height="1800" fetchPriority="high"/><figcaption>Travel · Curiosity · New perspectives</figcaption></figure>
      </section>
      <section className="beyond-section interests-section" aria-labelledby="interests-title"><div className="beyond-section-heading"><p className="kicker">WHAT KEEPS ME CURIOUS</p><h2 id="interests-title">The person <em>beyond the role.</em></h2></div><div className="interest-grid">{interests.map(([Icon, [title, text]]) => <article key={title}><Icon size={23} aria-hidden="true"/><h3>{title}</h3><p>{text}</p></article>)}</div></section>
      <section className="beyond-gallery" aria-label="Personal moments beyond work">{photos.slice(1).map(([file, alt, name]) => <figure className={`gallery-${name}`} key={file}><img src={`/beyond-work/${file}`} alt={alt} width="1350" height="1800" loading="lazy"/></figure>)}</section>
      <section className="beyond-section learning-panel" aria-labelledby="learning-title"><div><p className="kicker">{c.current}</p><h2 id="learning-title">{c.german}</h2></div><p>{c.germanText}</p><span lang="de">DE</span></section>
      <section className="beyond-section beyond-values"><div><p className="kicker">CHARACTER IN PRACTICE</p><h2>{c.values}</h2><p>{c.valuesText}</p></div><aside><MessageCircle size={24} aria-hidden="true"/><h3>{c.prompt}</h3><p>{c.promptText}</p></aside></section>
      <section className="beyond-closing"><Music2 size={26} aria-hidden="true"/><p>Football. Travel. Outdoors. Learning.<br/><strong>Always curious about what comes next.</strong></p><div><a className="button secondary" href="/"><ArrowLeft size={17}/>{c.back}</a><a className="button primary" href="mailto:akshaysipune15@gmail.com">{c.contact}<ArrowRight size={17}/></a></div></section>
    </main>
    <FloatingBackToTop menuOpen={open}/>
    <footer><a className="brand" href="/" aria-label="Akshay Panchawate — Professional portfolio"><span>AP</span><i/></a><p>© {new Date().getFullYear()} Akshay Panchawate.</p></footer>
  </div>
}
