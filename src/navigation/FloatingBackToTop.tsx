import Localized from '../i18n/Localized'
import { useEffect, useRef, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { goToSection } from './sectionNavigation'

export default function FloatingBackToTop({ menuOpen }: { menuOpen: boolean }) {
  const [visible, setVisible] = useState(false)
  const control = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      if (window.scrollY < 600 || menuOpen || !control.current) { setVisible(false); return }
      // Reserve the floating control's footprint: hide it rather than cover an interactive control or legend.
      const style = getComputedStyle(control.current)
      const right = window.innerWidth - (parseFloat(style.right) || 16)
      const bottom = window.innerHeight - (parseFloat(style.bottom) || 20)
      const width = control.current.offsetWidth || 132
      const height = control.current.offsetHeight || 44
      const left = right - width, top = bottom - height
      const overlap = [...document.querySelectorAll<HTMLElement>('main a, main button, main input, main select, main summary, main [role="tablist"], main .uat-legend, main .phase-legend, main p, main h1, main h2, main h3, main h4, main h5, main dt, main dd, main caption, main th, main td')].some(element => {
        const rect = element.getBoundingClientRect()
        return rect.width > 0 && rect.height > 0 && rect.left < right + 6 && rect.right > left - 6 && rect.top < bottom + 6 && rect.bottom > top - 6
      })
      setVisible(!overlap)
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    const sizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null
    if (control.current) sizeObserver?.observe(control.current)
    schedule(); window.addEventListener('scroll', schedule, { passive: true }); window.addEventListener('resize', schedule); document.addEventListener('focusin', schedule); document.addEventListener('toggle', schedule, true)
    return () => { sizeObserver?.disconnect(); cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); document.removeEventListener('focusin', schedule); document.removeEventListener('toggle', schedule, true) }
  }, [menuOpen])
  return <Localized>{<button ref={control} className="floating-to-top" type="button" hidden={!visible} aria-label="Back to Top" onClick={() => goToSection('top')}><ArrowUp size={18} aria-hidden="true"/><span>Back to Top</span></button>}</Localized>
}
