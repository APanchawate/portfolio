import Localized from './i18n/Localized'
import { useId } from 'react'
import type { ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

/** Native disclosure keeps hidden content in the DOM for search and anchor reveal. */
export default function ExploreDetails({ heading = 'Explore Details', summary, icon, children, className = '', id }: {
  heading?: string; summary?: string; icon?: ReactNode; children: ReactNode; className?: string; id?: string
}) {
  const contentId = `${useId()}-details-content`
  return <Localized>{<details id={id} className={`explore-details${className ? ` ${className}` : ''}`}>
    <summary aria-controls={contentId}>
      {icon && <span className="explore-details-icon" aria-hidden="true">{icon}</span>}
      <span className="explore-details-copy"><span className="explore-details-closed">{heading}</span><span className="explore-details-open">Show Less<span className="uat-sr-only"> — {heading}</span></span>{summary && <span className="explore-details-summary">{summary}</span>}</span>
      <ChevronDown className="explore-details-chevron" size={16} aria-hidden="true"/>
    </summary>
    <div className="explore-details-content" id={contentId}>{children}</div>
  </details>}</Localized>
}
