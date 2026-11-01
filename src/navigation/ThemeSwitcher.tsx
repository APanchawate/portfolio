import { useLayoutEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'

type Theme = 'executive' | 'aurora'

const storageKey = 'portfolio-theme'

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>(() => {
    try { return localStorage.getItem(storageKey) === 'aurora' ? 'aurora' : 'executive' }
    catch { return 'executive' }
  })

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem(storageKey, theme) } catch { /* Preferences still work for this visit. */ }
  }, [theme])

  const nextTheme: Theme = theme === 'executive' ? 'aurora' : 'executive'
  return <button className="theme-switcher" type="button" aria-label={`Switch to ${nextTheme} theme`} aria-pressed={theme === 'aurora'} onClick={() => setTheme(nextTheme)}>
    <Sparkles size={15} aria-hidden="true"/><span>{theme === 'executive' ? 'Aurora' : 'Executive'}</span>
  </button>
}
