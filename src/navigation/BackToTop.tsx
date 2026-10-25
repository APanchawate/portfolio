import Localized from '../i18n/Localized'
import { ArrowUp } from 'lucide-react'
import { handleSectionLink } from './sectionNavigation'

export default function BackToTop() {
  return <Localized>{<div className="section-return"><a href="#top" onClick={event => handleSectionLink(event, 'top')}><ArrowUp size={15} aria-hidden="true"/>Back to Top</a></div>}</Localized>
}
