import Localized from './i18n/Localized'
import ExploreDetails from './ExploreDetails'
import { Bot, Bug, Cloud, Code2, FileText, Sparkles } from 'lucide-react'

const applications = [
  { title: 'Python & API Development', icon: Code2, text: 'Use AI coding assistance for Python development, REST API integrations, refactoring and repetitive automation tasks.' },
  { title: 'Enterprise AI Knowledge Agents', icon: Bot, text: 'Configured two internal AI knowledge assistants for programme knowledge and Test Management guidance.' },
  { title: 'Debugging & Playwright', icon: Bug, text: 'Use AI to analyze errors, troubleshoot automation workflows and assist with Playwright test-script development.' },
  { title: 'GitHub Copilot & Development', icon: Sparkles, text: 'Use GitHub Copilot within VS Code for code suggestions, implementation assistance and development productivity.' },
  { title: 'Business Productivity', icon: FileText, text: 'Use AI to prepare presentations, draft and read professional emails, develop project timelines and support structured documentation and communication.' },
  { title: 'Cloud Automation Roadmap', icon: Cloud, text: 'Exploring Azure-based options for scheduled KPI reporting workflows, alongside GitHub Actions and self-hosted runners.', planned: true },
] as const

export default function AiExperience() {
  return <Localized>{<div className="ai-experience" id="ai-engineering" tabIndex={-1} role="group" aria-labelledby="ai-experience-title">
    <h3 id="ai-experience-title">AI-Assisted Engineering &amp; Delivery</h3>
    <p>Practical AI applications across development, testing, knowledge management and business operations.</p>
    <div className="ai-experience-grid">{applications.map((item, index) => <article className="ai-experience-card" key={item.title}>
      <item.icon size={21} aria-hidden="true"/><h4>{item.title}</h4>{'planned' in item && <p className="ai-roadmap-status">Exploring / Planned</p>}<p>{item.text}</p>
      {index === 1 && <ExploreDetails heading="Assistants & My Contribution">
        <dl><div><dt>Programme Knowledge Assistant</dt><dd>Configured to help retrieve and explain information from approved programme knowledge sources.</dd></div><div><dt>Test Management Knowledge Assistant</dt><dd>Configured to support Test Management questions, methodology guidance and knowledge access.</dd></div></dl>
        <p>My contribution: knowledge-source organization, agent instruction configuration, prompt design, testing and refinement, and practical application in daily work. Configuration uses an existing AI platform; foundation models and AI infrastructure are provided by that platform. The assistants support knowledge access and leave enterprise decisions with accountable stakeholders.</p>
      </ExploreDetails>}
    </article>)}</div>
    <ExploreDetails heading="Explore AI Engineering Context"><p className="ai-experience-note">The first five areas reflect implemented and used applications. Azure reporting orchestration is being explored and is not deployed. Engineering tools provide implementation, execution, storage and testing; AI assistants support development and knowledge access.</p></ExploreDetails>
  </div>}</Localized>
}
