import Localized from '../i18n/Localized'
import { ArrowUp } from 'lucide-react'
import { goToSection } from './sectionNavigation'

export default function FloatingBackToTop({ menuOpen: _menuOpen }: { menuOpen: boolean }) {
  return <Localized>{<button className="floating-to-top" type="button" aria-label="Back to Top" onClick={() => goToSection('top')}><ArrowUp size={18} aria-hidden="true"/><span>Back to Top</span></button>}</Localized>
}
