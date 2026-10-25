import type { MouseEvent } from 'react'

export function goToSection(id: string, expandCase = false) {
  const target = document.getElementById(id)
  if (!target) return false
  let parent: HTMLElement | null = target
  while (parent) {
    if (parent instanceof HTMLDetailsElement) parent.open = true
    parent = parent.parentElement
  }
  if (expandCase) {
    const details = target.closest('article')?.querySelector<HTMLDetailsElement>('details.case-technical')
    if (details) details.open = true
  }
  const hash = `#${id}`
  if (window.location.hash !== hash) window.history.pushState(null, '', hash)
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
  target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
  target.focus({ preventScroll: true })
  return true
}
export function handleSectionLink(event: MouseEvent<HTMLAnchorElement>, id: string, expandCase = false) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.defaultPrevented) return
  if (document.getElementById(id)) {
    event.preventDefault()
    goToSection(id, expandCase)
  }
}
