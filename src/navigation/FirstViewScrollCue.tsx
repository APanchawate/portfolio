import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { goToSection } from './sectionNavigation'

export default function FirstViewScrollCue() {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const update = () => setVisible(window.scrollY < 80)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  return <button className="scroll-cue" type="button" hidden={!visible} aria-label="See how I deliver" onClick={() => goToSection('enterprise-scope')}><span>See how I deliver</span><i><ChevronDown size={18} aria-hidden="true"/></i></button>
}
