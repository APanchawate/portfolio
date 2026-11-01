import { useEffect, useRef, useState } from 'react'

export default function ChapterTransition({ number, label, title, accent, detail }: { number: string; label: string; title: string; accent: string; detail: string }) {
  const root = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = root.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .38 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return <section id={`chapter-${number}`} ref={root} className={`chapter-transition${visible ? ' is-visible' : ''}`} aria-label={`${label}: ${title} ${accent}`}>
    <div className="chapter-signals" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index}/>)}</div>
    <div className="chapter-orbit" aria-hidden="true"><span/><span/><span/></div>
    <div className="chapter-copy">
      <p>CHAPTER {number} / {label}</p>
      <h2>{title}<br/><em>{accent}</em></h2>
      <span>{detail}</span>
    </div>
  </section>
}
