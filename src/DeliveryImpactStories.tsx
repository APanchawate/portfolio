import ExploreDetails from './ExploreDetails'
import Localized from './i18n/Localized'
import BackToTop from './navigation/BackToTop'

const stories = [
  {
    title: 'UAT Setup Automation — 75–83% Less Setup Time',
    challenge: 'Preparing a company-code UAT required Test Plans, Test Executions, due dates, filters and nine workstream dashboards. Manual setup took around 2–3 hours.',
    contribution: 'Designed Python/Jira REST API and Playwright workflows to standardize repeatable setup and dashboard creation.',
    impact: 'Reduced preparation to approximately 30 minutes (1.5–2.5 hours saved per setup). Created 200+ dashboards through automation across broader programme work, including workstream-lead views.',
    details: 'Python · Jira REST APIs · Xray · Playwright · JQL. Estimates reflect reported manual and automated setup times, not a controlled benchmark.',
  },
  {
    title: 'Defect Classification & Triage',
    challenge: 'UAT failures required consistent categorization to distinguish implementation issues from test-data, training, migration and other causes.',
    contribution: 'Created a Jira Defect Classification dropdown with seven categories: Partner system, Training, Test Data, Implementation, New requirement, New minor requirement and Migration. Supported triage, ageing, escalation and retest follow-up.',
    impact: 'Provided a shared classification vocabulary for routing and management reporting within a programme environment tracking 1,500+ defects. No unverified resolution-time reduction is claimed.',
    details: 'Jira custom fields · Jira/Xray · JQL · Defect governance · Stakeholder coordination.',
  },
  {
    title: 'AI Knowledge Assistants for Test Management',
    challenge: 'International teams needed easier access to programme and testing guidance spread across approved documentation.',
    contribution: 'Configured and refined two assistants on an existing enterprise AI platform: a Programme Knowledge Assistant and a Test Management Knowledge Assistant.',
    impact: 'Supported onboarding, knowledge discovery and recurring process questions while keeping approvals and decisions with responsible stakeholders.',
    details: 'Knowledge-source organization · Agent instructions · Prompt design · Testing and refinement. These were configured assistants, not custom-trained foundation models.',
  },
] as const

export default function DeliveryImpactStories() {
  return <Localized>{<section className="section projects" id="delivery-impact" tabIndex={-1} aria-labelledby="delivery-impact-title">
    <div className="section-head">
      <div><p className="kicker">ADDITIONAL DELIVERY IMPACT</p><h2 id="delivery-impact-title">Business outcomes.<br/><em>Practical implementation.</em></h2></div>
      <p>Three focused examples complementing the enterprise case studies above.</p>
    </div>
    <div className="case-grid">{stories.map((story, index) => <article className="case featured-case" key={story.title}>
      <div className="case-top"><span>IMPACT {String(index + 1).padStart(2, '0')}</span></div>
      <h3>{story.title}</h3>
      <dl>
        <div><dt>Challenge</dt><dd>{story.challenge}</dd></div>
        <div><dt>My Contribution</dt><dd>{story.contribution}</dd></div>
        <div><dt>Business Value</dt><dd>{story.impact}</dd></div>
      </dl>
      <ExploreDetails className="case-technical" heading="Explore Technical Approach"><p>{story.details}</p></ExploreDetails>
    </article>)}</div>
    <BackToTop/>
  </section>}</Localized>
}
