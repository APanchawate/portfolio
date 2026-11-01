import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { goToSection } from './sectionNavigation'

export default function FirstViewScrollCue() {
  const [visible, setVisible] = useState(() => window.scrollY < 80)
  useEffect(() => {
    const update = () => setVisible(window.scrollY < 80)
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  return <button className="scroll-cue" type="button" hidden={!visible} aria-label="Scroll to explore the portfolio" onClick={() => goToSection('enterprise-scope')}><span>Scroll to explore</span><i><ChevronDown size={18} aria-hidden="true"/></i></button>
}
