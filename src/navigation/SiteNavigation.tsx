import LanguageSwitcher from '../i18n/LanguageSwitcher'
import Localized from '../i18n/Localized'
import { useEffect, useState } from 'react'
import { Download, Menu, Presentation, X } from 'lucide-react'
import { resourceFiles, resourceUrl } from '../resourceAssets'
import type { AssetState } from '../resourceAssets'
import { handleSectionLink } from './sectionNavigation'

export const navigationItems = [['Overview', 'about'], ['Expertise', 'explore-expertise'], ['Case Studies', 'projects'], ['Live Demo', 'decision-centre'], ['Experience', 'experience'], ['Contact', 'contact']] as const
const menuItems = [...navigationItems.slice(0, 5), ['Resources', 'resources'] as const, ...navigationItems.slice(5)]
const navigationGroup: Record<string, string> = { top: 'about', about: 'about', 'explore-expertise': 'explore-expertise', 'operating-model': 'explore-expertise', projects: 'projects', 'scope-engineering': 'projects', rollouts: 'projects', expertise: 'explore-expertise', approach: 'explore-expertise', 'decision-centre': 'decision-centre', experience: 'experience', stack: 'explore-expertise', education: 'experience', resources: 'resources', opportunities: 'contact', contact: 'contact' }

export default function SiteNavigation({ open, onToggle, onClose, cv, presentation = 'unavailable' }: { open: boolean; onToggle: () => void; onClose: () => void; cv: AssetState; presentation?: AssetState }) {
  const [active, setActive] = useState('about')
  useEffect(() => {
    let frame = 0
    const sections = [...document.querySelectorAll<HTMLElement>('main > section[id]')]
    const update = () => { frame = 0; let current = 'about'; for (const section of sections) if (section.getBoundingClientRect().top <= 115) current = navigationGroup[section.id] ?? current; setActive(current) }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    update(); window.addEventListener('scroll', schedule, { passive: true }); window.addEventListener('resize', schedule)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule) }
  }, [])
  const presentationAvailable = presentation === 'available'
  function presentationLink(mobile: boolean) {
    return <Localized>{<a className={mobile ? 'nav-mobile-only nav-mobile-presentation' : 'nav-presentation'} href={presentationAvailable ? resourceUrl(resourceFiles.presentation) : '#resources'}
      target={presentationAvailable ? '_blank' : undefined} rel={presentationAvailable ? 'noopener noreferrer' : undefined}
      aria-label={presentationAvailable ? 'View Presentation (PDF, opens in a new tab)' : 'Presentation PDF unavailable — view available presentation resources'}
      onClick={event => { onClose(); if (!presentationAvailable) handleSectionLink(event, 'resources') }}>
      {!mobile && <Presentation size={16} aria-hidden="true"/>}{mobile ? 'View Presentation' : 'Presentation'}
      {!presentationAvailable && <span className="uat-sr-only"> — PDF temporarily unavailable; see available resources</span>}
    </a>}</Localized>
  }
  return <Localized>{<header className="nav-wrap" onBlurCapture={event => { if (open && !event.currentTarget.contains(event.relatedTarget)) onClose() }} onKeyDown={event => { if (event.key === 'Escape' && open) { onClose(); document.getElementById('menu-toggle')?.focus() } }}>
    <a className="brand" href="#top" aria-label="Akshay Panchawate — Home" onClick={event => { onClose(); handleSectionLink(event, 'top') }}><span>AP</span><i/></a>
    <nav id="primary-nav" className={open ? 'nav open' : 'nav'} aria-label="Primary navigation">{menuItems.map(([label, id]) => <a className={id === 'resources' ? 'nav-mobile-only' : undefined} key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined} onClick={event => { onClose(); handleSectionLink(event, id) }}>{label}</a>)}{presentationLink(true)}</nav>
    <LanguageSwitcher/>
    <div className="nav-document-actions">{presentationLink(false)}
    {cv === 'available' && <a className="nav-cv" href={resourceUrl(resourceFiles.cv)} download="Akshay-Panchawate-CV.pdf" aria-label="Download CV" onClick={onClose}><Download size={16} aria-hidden="true"/><span className="nav-doc-full">Download CV</span><span className="nav-doc-short" data-i18n-ignore="true" aria-hidden="true">CV</span></a>}
    </div>
    <button id="menu-toggle" className="menu" onClick={() => { onToggle(); if (!open) requestAnimationFrame(() => document.getElementById('primary-nav')?.querySelector<HTMLAnchorElement>('a')?.focus()) }} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="primary-nav">{open ? <X aria-hidden="true"/> : <Menu aria-hidden="true"/>}</button>
  </header>}</Localized>
}
