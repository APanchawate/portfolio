# Akshay Panchawate — Professional Portfolio

A business-oriented portfolio positioning Akshay Panchawate as an Enterprise Test Management & Automation Specialist. Business value comes first, followed by governance, delivery and technical enablers.

The single-page experience connects enterprise metrics and a collaboration operating model to four case-study categories including the integrated Test Management Automation Hub, market-specific scope engineering, parallel rollout coordination, Jira/Xray governance, the five-stage Enterprise UAT Management Recipe and the interactive Decision Centre. Experience, skills, education, resources and opportunities follow. Technical project examples remain available within the case-study disclosures rather than in a repeated standalone project list.

`src/EnterpriseContext.tsx` and `src/enterpriseContent.ts` contain the operating model, scope example and parallel-rollout overview. The model is explicitly about collaboration, not reporting lines. The scope workbook uses fictional records. Market descriptions and company-code counts were supplied by the portfolio owner. Mexico is presented separately as historical UAT support without a company-code count or active timeline bands; relative timeline bands are illustrative and contain no internal dates. `src/FeaturedCaseStudies.tsx` and `src/portfolioCases.ts` organize the four case categories and preserve supporting implementation examples.

Metrics distinguish programme scope from personal contributions, including 200+ dashboards created through automation. FIT/GAP decisions, final release approvals and Tosca development remain with the responsible stakeholders and teams.

The fourth hero metric highlights the Automation Hub instead of a script count. `src/AutomationHubArchitecture.tsx` explains its UI, services, API integrations, SQLite data/state support and delivery/testing tools within the existing case-study disclosure. Script-based delivery and AI assistants remain supporting technical experience.

## Availability and mobility

`src/careerAvailability.json` is the single source for the public availability date, preferred city, relocation country and maximum business travel. React copy is derived in `src/careerAvailability.ts`; the Vite HTML transform uses the same JSON for SEO and Open Graph descriptions. Edit the JSON and rebuild to keep page content and metadata aligned. These career facts are separate from historical employment dates and synthetic project timelines.

## Recruiter navigation (Phase 1)

The hero provides the available CV and presentation actions plus a route to the six-card expertise explorer. A three-card overview precedes the explorer; detailed professional context remains expandable. The operating model separates technical ownership from delivery coordination.

`src/resourceAssets.ts` checks each document once from App and shares availability with the hero, header and resources cards. The supplied master CV is copied unchanged to `public/resources/cv.pdf`; the supplied seven-slide AI-updated presentation PDF and PPTX are copied unchanged to `public/resources/enterprise-test-management.pdf` and `public/resources/enterprise-test-management.pptx`. All View Presentation actions open that PDF in a new tab. Professional Resources provides a separate Download PowerPoint action without a format menu.

`src/navigation/` contains the sticky header, reduced-motion-aware section navigation, reusable Back to Top links and one floating return control. The floating control appears after 600px only when its footprint does not cover controls or legends, and stays hidden while the mobile menu is open. Every major content section has its own return link. Section IDs and the four Decision Centre modules are preserved; no dashboard data or calculations were changed in Phase 1.

## Professional resources

The Professional Resources & Project Showcase follows skills and education, before opportunities and contact. It provides document actions, expandable links to existing illustrative reporting views, and a conceptual automation flow that distinguishes separate solution patterns.

Place the final user-supplied documents at these paths:

- `public/resources/cv.pdf`
- `public/resources/enterprise-test-management.pdf`
- `public/resources/enterprise-test-management.pptx` (optional)

No CV or presentation is generated. If a file is unavailable, the cards show an accurate availability message rather than a broken file link. The CV also has an email-request fallback. After adding files, reload the page; rebuild before any future publication. The site uses Vite's base URL, producing `/portfolio/resources/...` paths for GitHub Pages. It checks file signatures to avoid treating a missing-file HTML fallback as an available document.

CV PDFs offer separate View (new tab) and Download actions. Presentation PDFs open in a new tab; the original PowerPoint download appears only when present. Reporting examples select the matching existing Decision Centre module without embedding another dashboard.

## Interactive Decision Centre

The section after the testing methodology contains four selectable modules: UAT Execution Control, Risk & Defect Intelligence, Release Readiness and Multi-Market Governance. All interactive data is synthetic and clearly labelled; it is not client or programme information.

Components and datasets live in `src/decision-centre/`; reusable execution charts, the timeline and defect flow are in `src/UatVisuals.tsx`. Charts support weekly value selection, tabs support arrow keys and Home/End, and wide data tables scroll within their own regions on small screens. No charting dependency is required.

Release-readiness thresholds are editable demonstration settings. Assessments show reasons and never grant release approval; real decisions require programme-specific criteria, business acceptance and accountable stakeholders.

## Tech stack

- React + TypeScript
- Vite
- CSS (responsive layouts, glass surfaces and reduced-motion support)
- GitHub Actions + GitHub Pages

## Local development

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Production build

```bash
npm run build
npm run preview
```

The static production output is generated in `dist/`. Vite is configured with the `/portfolio/` base path for the final URL:

https://apanchawate.github.io/portfolio/

## Deployment

The workflow at `.github/workflows/deploy.yml` builds and deploys the site whenever changes are pushed to `main`. In the GitHub repository, set **Settings → Pages → Source** to **GitHub Actions** before the first deployment.

## Content and privacy

Project descriptions are intentionally high-level and confidentiality-safe. No proprietary source code, internal identifiers or company assets are included.

## Phase 2 interactive scenarios

The four Decision Centre categories share an in-memory, deterministic synthetic scenario through `src/decision-centre/scenario/ScenarioContext.tsx`. Types and pure calculations live in `types.ts` and `engine.ts`; gadget components cover scope changes, evidence, data readiness, defects, risk, readiness and the international control tower. The existing execution chart, phase timeline, resource navigation and case studies remain available. Automation effort assumptions are explored separately within the Automation Hub case study.

Market, Finance Product, reporting date and scenario presets apply across gadgets. Scope, evidence, data and defect edits are dated; earlier reporting snapshots retain their recorded values. Execution-timing controls are explicitly counterfactual and recalculate the demonstration history. Undo restores up to 25 edits; Reset restores default data, filters and gadget settings. Nothing is persisted or sent to an external service.

Counting rules:

- Count distinct current in-scope test cases, never retest attempts. First qualifying Passed/Failed execution establishes execution; a Blocked-only case remains unexecuted. Scope equals Passed + Failed + Blocked + Not executed; executed equals Passed + Failed.
- Planned counts use agreed due dates known at the reporting cutoff. Scope and due-date changes use dated histories. Actuals exclude future records and require Ready data at the recorded execution date where applicable.
- Evidence compliance uses executed cases only; zero execution yields N/A. Evidence completeness is separate from execution and does not establish acceptance or attachment quality.
- Defects have explicit many-to-many case links. Classification alone cannot resolve data readiness. Making data ready never manufactures an execution result; later recorded execution is still required.
- Forecasts use distinct eligible first executions over the latest five reporting days, projected over remaining scope. Insufficient history or zero throughput yields N/A. Weekly reporting selects Friday snapshots plus the selected partial-week date; it does not sum cumulative values.
- Readiness uses six visible, editable illustrative thresholds, not an approval score. Market company-code context describes experience separately from synthetic performance. Mexico has no invented company-code count.
- Automation effort is quantity × per-item time; automated effort adds setup time. Savings can be negative, and reduction is N/A when manual effort is zero. These estimates are not verified project results.

Run `npm test` for lightweight calculation, scenario and server-rendered interface checks, and `npm run build` for TypeScript and production validation. No additional runtime dependencies were introduced. Browser-based visual and interaction review remains a separate local QA step.

## Phase 3 polish and QA

Recruiter summaries, case-study disclosures, Decision Centre guidance, accessible metric explanations, empty states and metadata have been refined. Shared current-scenario metrics are calculated once per provider update. Scenario business rules are unchanged.

See [Phase 3 QA report](docs/phase3-qa.md) for changed files, 17 passing tests, production asset checks, measured bundle sizes and the outstanding real-browser review. The presentation PDF availability issue has since been resolved; both formats are now supplied. Verify the Green Belt credential wording against the CV before publication. Nothing has been committed, pushed or deployed by this phase.

## UAT recipe and reporting framework

The existing methodology now connects Scope Preparation, Business Validation, Execution Readiness, UAT Execution Monitoring and Reporting & Stakeholder Follow-up. The existing Reporting Transformation case study describes one automated 15-page package through four representative management views; it does not invent the remaining eleven pages or reproduce client charts. Source workstream failure rates retain Failed / Total test cases as the denominator. Decision Centre calculations remain unchanged, with small copy notes clarifying status terminology differences.

The [seven-slide presentation outline](docs/uat-methodology-presentation-outline.md) supports later reuse; no PowerPoint or PDF was generated. Validation: 20 tests and the TypeScript/production build pass. Responsive CSS was reviewed; real-browser visual QA remains outstanding.

## Practical AI experience

The existing engineering section now includes one compact AI-Assisted Engineering & Delivery showcase, linked directly from AI & Engineering. Implemented AI applications, conventional engineering infrastructure and the exploring/planned Azure reporting roadmap are distinguished. The Hub architecture and scenario engine remain unchanged.

The served presentation now matches the user-supplied seven-slide `Akshay_Panchawate_Portfolio_Presentation.pptx`, including its dedicated AI slide. The matching PDF is now available at `public/resources/enterprise-test-management.pdf`, with the dedicated AI-assisted delivery slide verified on page 6 of 7. No slides were generated or edited. Validation: 22 tests and the TypeScript/production build pass; real-browser visual review remains outstanding.

## Progressive disclosure

The default view keeps business summaries, methodology diagrams, expertise/AI cards and primary Decision Centre visualizations visible. Native Explore Details controls preserve technical explanations, full responsibilities, supporting workflows and secondary tables for optional exploration. URL fragments, refresh and history navigation reveal hidden targets before focus/scroll transfer. See [the disclosure QA report](docs/progressive-disclosure-qa.md) for changed files, preservation checks, 27 passing tests and outstanding real-browser review.

## English and German

The navbar now offers EN / DE. English is the first-visit default; a stored German preference persists where localStorage is available. Central, type-checked dictionaries in `src/i18n/` translate presentation text, dynamic messages and accessibility labels while retaining English scenario identifiers, control values and all original English documents. Resources explicitly identifies document language. The [language-switcher QA report](docs/language-switcher-qa.md) describes maintenance, changed files, 37 passing tests and the outstanding browser visual/state-switch review.
