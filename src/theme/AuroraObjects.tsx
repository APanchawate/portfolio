import { useEffect, useRef } from 'react'

const objects = [['PMO', 'orbit-pmo'], ['AI', 'orbit-ai'], ['UAT', 'orbit-uat'], ['DATA', 'orbit-data']] as const

export default function AuroraObjects() {
  const layer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = layer.current
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const nodes = [...root.querySelectorAll<HTMLElement>('.aurora-object')]
    let pointerX = -1000
    let pointerY = -1000
    let frame = 0
    const render = () => {
      frame = 0
      for (const node of nodes) {
        const rect = node.getBoundingClientRect()
        const dx = rect.left + rect.width / 2 - pointerX
        const dy = rect.top + rect.height / 2 - pointerY
        const distance = Math.max(Math.hypot(dx, dy), 1)
        const force = Math.max(0, (190 - distance) / 190) * 38
        node.style.setProperty('--push-x', `${dx / distance * force}px`)
        node.style.setProperty('--push-y', `${dy / distance * force}px`)
      }
    }
    const move = (event: PointerEvent) => {
      pointerX = event.clientX
      pointerY = event.clientY
      if (!frame) frame = requestAnimationFrame(render)
    }
    const reset = () => {
      pointerX = pointerY = -1000
      if (!frame) frame = requestAnimationFrame(render)
    }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('blur', reset)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('blur', reset)
    }
  }, [])

  return <div ref={layer} className="aurora-objects" aria-hidden="true">
    {objects.map(([label, className]) => <div className={`aurora-object ${className}`} key={label}><span>{label}</span></div>)}
  </div>
}
