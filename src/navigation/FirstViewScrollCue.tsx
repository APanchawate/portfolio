import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { goToSection } from './sectionNavigation'

export default function FirstViewScrollCue() {
  const [visible, setVisible] = useState(true)
  const [aurora, setAurora] = useState(() => document.documentElement.dataset.theme === 'aurora')
  useEffect(() => {
    const update = () => setVisible(window.scrollY < 80)
    const themeObserver = new MutationObserver(() => setAurora(document.documentElement.dataset.theme === 'aurora'))
    update()
    window.addEventListener('scroll', update, { passive: true })
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => {
      window.removeEventListener('scroll', update)
      themeObserver.disconnect()
    }
  }, [])
  const label = aurora ? 'Explore My Approach' : 'See how I deliver'
  return <button className="scroll-cue" type="button" hidden={!visible} aria-label={label} onClick={() => goToSection('enterprise-scope')}><span>{label}</span><i><ChevronDown size={18} aria-hidden="true"/></i></button>
}
