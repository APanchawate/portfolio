import Localized from '../i18n/Localized'
import { useId } from 'react'
import type { ReactNode } from 'react'

export default function Tabs({ labels, active, onChange, label, children, cards, onActivate, navigationWrapper }: {
  labels: readonly string[]; active: number; onChange: (index: number) => void; label: string; children: ReactNode; cards?: readonly { description: string; icon: ReactNode }[]; onActivate?: () => void; navigationWrapper?: (navigation: ReactNode) => ReactNode
}) {
  const id = useId()
  const navigation = <div className={cards ? 'uat-tabs dc-navigation-cards' : 'uat-tabs'} role="tablist" aria-label={label}>{labels.map((text, i) => <button
      key={text} type="button" id={`${id}-tab-${i}`} role="tab" aria-selected={active === i}
      aria-controls={`${id}-panel-${i}`} tabIndex={active === i ? 0 : -1} onClick={() => { onChange(i); onActivate?.() }}
      onKeyDown={event => {
        const next = event.key === 'ArrowRight' ? (i + 1) % labels.length
          : event.key === 'ArrowLeft' ? (i + labels.length - 1) % labels.length
          : event.key === 'Home' ? 0 : event.key === 'End' ? labels.length - 1 : null
        if (next === null) return
        event.preventDefault(); onChange(next); document.getElementById(`${id}-tab-${next}`)?.focus()
      }}>{cards ? <><span className="dc-navigation-icon" aria-hidden="true">{cards[i].icon}</span><span className="dc-navigation-title">{text}</span><span className="dc-navigation-description">{cards[i].description}</span></> : text}</button>)}</div>
  return <Localized>{<>
    {navigationWrapper ? navigationWrapper(navigation) : navigation}
    {labels.map((_, i) => <div key={i} id={`${id}-panel-${i}`} role="tabpanel" aria-labelledby={`${id}-tab-${i}`} hidden={active !== i} tabIndex={0}>{active === i && children}</div>)}
  </>}</Localized>
}
