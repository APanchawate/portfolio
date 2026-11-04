import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LanguageProvider } from './i18n/LanguageContext'
import App from './App'
import BeyondWork from './BeyondWork'
import './styles.css'

const Page = window.location.pathname.replace(/\/+$/, '') === '/beyond-work' ? BeyondWork : App
createRoot(document.getElementById('root')!).render(
  <StrictMode><LanguageProvider><Page /></LanguageProvider></StrictMode>,
)
