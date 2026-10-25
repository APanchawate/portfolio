import Localized from './i18n/Localized'
import { Compass, Download, FileText, Presentation } from 'lucide-react'
import { resourceFiles, resourceUrl } from './resourceAssets'
import type { ResourceAvailability } from './resourceAssets'
import { handleSectionLink } from './navigation/sectionNavigation'

export function PresentationAction({ assets, showPowerPointDownload = true }: { assets: ResourceAvailability; showPowerPointDownload?: boolean }) {
  const pdf = assets.presentation === 'available'
  const pptx = assets.powerpoint === 'available'
  if (!showPowerPointDownload) return <Localized>{pdf
    ? <a className="button secondary" href={resourceUrl(resourceFiles.presentation)} target="_blank" rel="noopener noreferrer" aria-label="View Presentation (PDF, opens in a new tab)"><Presentation size={16} aria-hidden="true"/>View Presentation</a>
    : <a className="button secondary" href="#resources" aria-label="Presentation PDF unavailable — view available presentation resources" onClick={event => handleSectionLink(event, 'resources')}><Presentation size={16} aria-hidden="true"/>View Presentation<span className="uat-sr-only"> — PDF temporarily unavailable; see available resources</span></a>}</Localized>
  return <Localized>{<>
    {pdf && <a className="button primary" href={resourceUrl(resourceFiles.presentation)} target="_blank" rel="noopener noreferrer" aria-label="View Presentation (PDF, opens in a new tab)"><Presentation size={16} aria-hidden="true"/>View Presentation</a>}
    {pptx && <a className="button secondary" href={resourceUrl(resourceFiles.powerpoint)} download="Akshay-Panchawate-Test-Management.pptx">Download PowerPoint <Download size={16} aria-hidden="true"/></a>}
    {!pdf && !pptx && <span className="document-unavailable"><Presentation size={16} aria-hidden="true"/>{assets.presentation === 'checking' || assets.powerpoint === 'checking' ? 'Checking presentation…' : 'Presentation temporarily unavailable'}</span>}
  </>}</Localized>
}
export default function HeroActions({ assets }: { assets: ResourceAvailability }) {
  return <Localized>{<div className="actions hero-actions">{assets.cv === 'available' ? <a className="button primary" href={resourceUrl(resourceFiles.cv)} download="Akshay-Panchawate-CV.pdf"><Download size={16} aria-hidden="true"/>Download CV</a> : <span className="document-unavailable"><FileText size={16} aria-hidden="true"/>{assets.cv === 'checking' ? 'Checking CV…' : 'CV not yet available'}</span>}
    <PresentationAction assets={assets} showPowerPointDownload={false}/>
    <a className="button ghost" href="#explore-expertise" onClick={event => handleSectionLink(event, 'explore-expertise')}><Compass size={16} aria-hidden="true"/>Explore Portfolio</a>
  </div>}</Localized>
}
