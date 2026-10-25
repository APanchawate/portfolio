export const originalCases = [
  { n:'03', title:'Test Management Automation Hub', challenge:'Enterprise Jira/Xray administration and reporting needed an integrated, reusable interface.', role:'Product concept, solution architecture and full-stack delivery.', approach:'Designed and developed a centralized automation solution to streamline repetitive Jira/Xray administration, reporting and test-management workflows across enterprise testing activities.', tech:'React/TypeScript interface · FastAPI/Python services · Jira REST APIs v2/v3 · Xray APIs · SQLite application data · GitHub Actions/self-hosted runners · Playwright testing', scale:'Reusable workflows across test preparation, execution and reporting.', impact:'A scalable foundation for self-service operations and continuous process improvement.' },
  { n:'04', title:'Automated Test-Case Creation', challenge:'Manual case creation was time intensive and vulnerable to formatting inconsistencies.', role:'Workflow analysis, automation design and quality controls.', approach:'Developed Python/API-driven workflows to extract test information from Confluence pages and generate structured Jira/Xray Test Cases, alongside bulk test-case creation and cloning from Excel-based inputs.', tech:'Python · REST APIs · Jira · Xray · Confluence · Excel · JSON', scale:'Thousands of structured test artefacts.', impact:'Accelerated test preparation while improving consistency and traceability.' },
  { n:'06', title:'Enterprise AI Knowledge Assistants', challenge:'Teams needed quicker access to process knowledge without losing control or context.', role:'Knowledge-source organization, instruction configuration, prompt design, testing and refinement.', approach:'Configured two internal AI knowledge assistants on an existing enterprise platform: a Programme Knowledge Assistant and a Test Management Knowledge Assistant, supporting approved knowledge retrieval and methodology guidance in daily work.', tech:'Existing enterprise AI platform · Knowledge-source organization · Agent instructions · Prompt design · Testing and refinement', scale:'Two working AI agents supporting team members, management stakeholders and new joiners across project knowledge and Test Management use cases.', impact:'Improved access to relevant programme and Test Management guidance, supporting onboarding and reducing repetitive knowledge searches; accountable stakeholders retain enterprise decisions.' },
  { n:'07', title:'Confluence Live Dashboard Automation', challenge:'Testing KPI and management views required continuous manual updates across Jira and Confluence.', role:'Automation design, API integration and reporting workflow implementation.', approach:'Automated the creation and updating of Confluence reporting pages using Python and REST APIs, dynamically integrating Jira filter/JQL data to create live testing dashboards and continuously updated testing KPI and management views.', tech:'Python · REST APIs · Jira · JQL · Confluence', scale:'Reusable reporting pages connected to live Jira testing data.', impact:'Reduced manual reporting effort while keeping testing KPI and management views continuously current.' },
]

export interface FeaturedCase {
  title: string
  challenge: string
  role: string
  approach: string
  value: string
  technical: string
  stakeholders: string
  supportingProjects: readonly string[]
  link?: { href: string; label: string }
}
export const featuredCases: readonly FeaturedCase[] = [
  {
    title: 'Enterprise UAT Governance',
    challenge: 'Parallel international SAP S/4HANA Finance rollouts need consistent scope, readiness and execution visibility.',
    role: 'Supported Central and Market Rollout Managers with delivery planning, stakeholder alignment, scope preparation, execution readiness and follow-up across international UAT activities.',
    approach: 'Aligned testers and WS Leads on due dates, monitored cumulative execution and scope changes, and coordinated cross-functional follow-up on blockers, risks and dependencies.',
    value: 'Shared visibility of commitments, evidence and residual risks helps management and markets coordinate support, prioritize recovery actions and maintain execution readiness.',
    technical: 'Jira/Xray · Confluence · Excel · Power Query · Python · REST APIs',
    stakeholders: 'Rollout Managers, Market CFOs, Finance Product Teams, WS Leads, business testers and technical partners. Rollout Management coordinates the overall rollout; authorized stakeholders retain scope and release decisions.',
    supportingProjects: [], link: { href: '#scope-engineering', label: 'Explore UAT scope engineering' },
  },
  {
    title: 'Jira/Xray Platform & Repository Governance',
    challenge: 'A reusable enterprise test repository needs consistent configuration, quality standards and scalable execution setup.',
    role: 'Primary technical owner of testing-specific Jira/Xray configuration, custom fields, dashboards, filters and automation; maintain the central master repository.',
    approach: 'Reviewed case quality, organized labels and regression scope, configured Defect Classification and automated Jira/Xray preparation and dashboard provisioning.',
    value: 'Consistent structures, reusable cases and relevant reporting views support parallel market testing with less repetitive administration.',
    technical: '7,000+ reusable master cases supported, not all authored by me. 200+ dashboards personally created through automation. Jira REST APIs v2/v3 · Xray APIs · Python · JQL.',
    stakeholders: 'Central Finance Product Teams and markets determine relevance; Product Teams or implementation partners create required GAP cases. I coordinate quality and technical preparation.',
    supportingProjects: ['04'], link: { href: '#expertise', label: 'Explore platform governance' },
  },
  {
    title: 'Reporting Transformation',
    challenge: 'International UAT needs consistent visibility into execution, workstream performance, defects and remaining workload. Manual consolidation creates repetitive preparation effort.',
    role: 'Identified repetitive reporting preparation, designed automation solutions and developed an automated 15-page UAT KPI reporting workflow that I maintain for structured management visibility.',
    approach: 'Integrated overall execution progress, workstream failure analysis, defect evolution and workstream execution performance into one reporting package, aligning operational data with stakeholder reporting needs.',
    value: 'More consistent reporting, less repetitive preparation and clearer workstream-level information support progress tracking, risk visibility and structured stakeholder follow-up.',
    technical: 'Technical enablers: Jira/Xray filters and APIs, Excel Power Query, VBA/macros, Python, SQLite, automated PDF reporting and Confluence. AI assistance supports scripting, troubleshooting and workflow refinement. Power BI also supports other reporting solutions.',
    stakeholders: 'Central management, market leadership including CFO stakeholders, Product Teams and testing coordinators.',
    supportingProjects: ['07'],
  },
  {
    title: 'Automation Engineering & AI',
    challenge: 'Recurring Jira/Xray administration and reporting needed an integrated solution for enterprise testing activities.',
    role: 'Translated operational requirements into technical workflows, coordinated their implementation with users and stakeholders, and developed the Test Management Automation Hub for repeatable Jira/Xray administration and reporting.',
    approach: 'Integrated plan, execution, test-case, filter and dashboard automation through a React/TypeScript interface and FastAPI/Python services, connecting operational requirements with reusable technical workflows and API-driven reporting.',
    value: 'A central interface and reusable workflows connect business needs with technical delivery, supporting consistent testing setup, clearer reporting and less repetitive administration.',
    technical: 'Python and REST API delivery includes 30+ scripts supporting the integrated Hub and related automation workflows. FastAPI services, React/TypeScript, SQLite, GitHub Actions, self-hosted runners and Playwright have distinct architectural roles. AI-assisted Python development and debugging support delivery; two configured AI knowledge assistants complement the Hub.',
    stakeholders: 'Test Management teams, business testers, reporting users, management stakeholders and new joiners.',
    supportingProjects: ['03', '06'],
  },
]
