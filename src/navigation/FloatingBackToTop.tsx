import { useEffect, useState } from 'react'
import Localized from '../i18n/Localized'
import { ArrowUp } from 'lucide-react'
import { goToSection } from './sectionNavigation'

export default function FloatingBackToTop({ menuOpen: _menuOpen }: { menuOpen: boolean }) {
  const [expanded, setExpanded] = useState(false)
  useEffect(() => {
    const update = () => setExpanded(window.scrollY > 160)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  return <Localized>{<button className={`floating-to-top ${expanded ? 'is-expanded' : 'is-compact'}`} type="button" aria-label="Back to Top" onClick={() => goToSection('top')}><ArrowUp size={18} aria-hidden="true"/><span>Back to Top</span></button>}</Localized>
}
