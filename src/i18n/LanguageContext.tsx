import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { translateMessage } from './translate'
export type Language = 'en' | 'de'
export const languageStorageKey = 'portfolio-language'
export function initialLanguage(): Language {
  try { return typeof window !== 'undefined' && window.localStorage.getItem(languageStorageKey) === 'de' ? 'de' : 'en' } catch { return 'en' }
}
const LanguageContext = createContext<{ language: Language; setLanguage: (language: Language) => void }>({ language: 'en', setLanguage() {} })
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(initialLanguage)
  useEffect(() => {
    document.documentElement.lang = language
    try { window.localStorage.setItem(languageStorageKey, language) } catch { /* Storage is optional. */ }
  }, [language])
  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>
}
export const useLanguage = () => useContext(LanguageContext)
export const useTranslation = () => { const value = useLanguage(); return { ...value, t: (text: string) => translateMessage(text, value.language) } }
