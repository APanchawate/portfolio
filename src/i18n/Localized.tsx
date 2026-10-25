import { cloneElement, isValidElement, Fragment, Children } from 'react'
import type { ReactElement, ReactNode } from 'react'
import { useLanguage } from './LanguageContext'
import { translateMessage } from './translate'
import type { Language } from './LanguageContext'
const translatedAttributes = ['aria-label', 'aria-description', 'title', 'alt', 'placeholder'] as const
/** Translate presentation only. IDs, hrefs, keys, event handlers and model values stay intact. */
export function localizeTree(node: ReactNode, language: Language): ReactNode {
  if (typeof node === 'string') return translateMessage(node, language)
  if (typeof node === 'number') return language === 'de' ? new Intl.NumberFormat('de-DE').format(node) : node
  if (Array.isArray(node)) return Children.map(node, child => localizeTree(child, language))
  if (!isValidElement(node)) return node
  // Each portfolio component localizes its own returned DOM; never translate its input data.
  if (typeof node.type !== 'string' && node.type !== Fragment) return node
  const element = node as ReactElement<Record<string, unknown>>
  if (element.props['data-i18n-ignore']) return node
  const props: Record<string, unknown> = {}
  for (const attr of translatedAttributes) if (typeof element.props[attr] === 'string') props[attr] = translateMessage(element.props[attr] as string, language)
  const children = element.props.children as ReactNode
  const primitiveChildren = typeof children === 'string' || typeof children === 'number' || Array.isArray(children) && children.every(child => typeof child === 'string' || typeof child === 'number')
  const source = primitiveChildren && (!Array.isArray(children) || ['option','title','desc'].includes(String(node.type))) ? (Array.isArray(children) ? children.join('') : String(children)) : null
  if (node.type === 'option' && element.props.value === undefined && source !== null) props.value = source
  props.children = source !== null ? translateMessage(source, language) : localizeTree(children, language)
  return cloneElement(element, props)
}
export default function Localized({ children }: { children: ReactNode }) {
  const { language } = useLanguage()
  return localizeTree(children, language)
}
