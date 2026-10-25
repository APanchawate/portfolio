import { useTranslation } from './LanguageContext'
export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useTranslation()
  return <div className="language-switcher" role="group" aria-label={t('Website language')}>
    <button type="button" lang="en" aria-label="English" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>EN</button><span aria-hidden="true">|</span>
    <button type="button" lang="de" aria-label="Deutsch" aria-pressed={language === 'de'} onClick={() => setLanguage('de')}>DE</button>
  </div>
}
