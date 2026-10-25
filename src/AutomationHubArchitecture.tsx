import Localized from './i18n/Localized'
import { useId } from 'react'

const administration = ['Test Plan and Test Execution creation', 'Test-case creation and cloning', 'Jira filter creation and configuration', 'Dashboard creation, configuration and KPI gadgets', 'Reusable dashboard and filter workflows']
const reporting = ['Jira/Xray data extraction through filters and APIs', 'Reporting data transformation', 'KPI dashboard generation', 'Automated reporting workflows', 'Confluence reporting integration']

export default function AutomationHubArchitecture() {
  const id = useId()
  return <Localized>{<div className="hub-architecture" role="group" aria-labelledby={`${id}-title`}>
    <h4 id={`${id}-title`}>Integrated Test Management Automation Hub</h4>
    <div className="hub-capabilities"><div><h5>Jira/Xray administration automation</h5><ul>{administration.map(text => <li key={text}>{text}</li>)}</ul></div><div><h5>Reporting automation</h5><ul>{reporting.map(text => <li key={text}>{text}</li>)}</ul></div></div>
    <ol className="hub-service-flow" aria-label="Automation Hub architectural roles">{[
      ['User Interface', 'React / TypeScript', 'A central interface for repeatable test-management workflows.'],
      ['Automation Services', 'FastAPI / Python', 'Workflow orchestration, validation and reporting data processing.'],
      ['Jira/Xray REST APIs', 'Jira REST APIs v2/v3 · Xray APIs', 'Integration with the testing platform and its data.'],
      ['Managed testing artefacts', 'Test Plans · Test Executions · Test Cases · Filters · Dashboards', 'Consistent setup and relevant reporting views for stakeholders.'],
    ].map(([title, technology, text]) => <li key={title}><h5>{title}</h5><strong>{technology}</strong><p>{text}</p></li>)}</ol>
    <dl className="hub-support"><div><dt>Application data & workflow state</dt><dd>SQLite supports local application data and workflow state where relevant.</dd></div><div><dt>Execution, CI/CD & testing</dt><dd>GitHub Actions and self-hosted runners support automation execution and CI/CD where configured. Playwright supports automated browser testing.</dd></div></dl>
    <div className="hub-ai-approach"><h5>AI-Assisted Development Approach</h5><p>AI coding assistants support development and maintenance of Python automation, REST API workflows, error handling and Playwright scripts. The solutions are implemented, validated and maintained through conventional software engineering practices. Python/FastAPI and REST APIs perform the automation; GitHub Actions and runners support execution and orchestration, SQLite stores application data, and Playwright supports browser automation and testing.</p></div>
    <p className="context-note">The Hub integrates repeatable administration and reporting capabilities. Individual workflows use the services and tools they need; not every workflow uses every technology. AI knowledge assistants remain complementary solutions.</p>
  </div>}</Localized>
}
