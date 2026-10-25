# Shorter recruiter-first portfolio

Implemented locally on 26 October 2026. No commit, push or deployment.

## Visibility changes

- Reused the existing ExploreDetails component. Native summary controls retain keyboard and expanded/collapsed semantics, content IDs, chevrons, Show Less labels and reduced-motion behavior.
- The professional overview's three supporting cards and original context are now inside Explore Professional Profile. The six Explore My Expertise cards remain immediately visible.
- The operating model shows central project leadership, Rollout Management and the Central Test Management contribution in a compact diagram. A short decision-rights distinction remains visible. All original context, role and stakeholder detail is retained in Explore Detailed Operating Model.
- Four governance capability summaries remain visible, now with icons. Detailed Jira/Xray ownership is under Explore Jira/Xray Technical Details.
- The scope preview now has five compact stages: the former quality/readiness and execution-preparation steps are grouped in the final preview. All six original stage descriptions and the complete workbook remain in one Explore Scope Engineering Methodology disclosure. No original scope methodology was deleted.
- Regional names and completed/ongoing/preparation statuses remain visible. Original descriptions, all activity wording and the existing phase chart are consolidated into Explore International Delivery Details. The chart was reused rather than recreated.
- Case studies retain Challenge → My Contribution → Business Value in short previews. Their original full fields, technical approaches, architecture, report framework and supporting projects remain in the existing main disclosure. Several nested project/report/automation disclosures were flattened.
- All five UAT recipe names and their one-sentence purposes remain visible. Detailed outputs, activities and responsibility boundaries remain under Explore Complete UAT Methodology. The monitoring/reporting connection and report link remain visible.
- The Decision Centre shows its heading, synthetic disclaimer, three executive KPIs, compact current-scenario context, selected primary chart and essential chart controls. Its four category selectors and configuration are inside Explore Advanced Decision Centre. Additional execution KPIs have a separate, clearly labelled disclosure. The selected chart remains outside that configuration disclosure and is rendered only once.
- Employer names, roles, existing period labels and two/three available key achievements remain visible for BMW/Bosch; UNR retains its original concise history rather than invented achievements. Original summaries and full responsibilities remain in the existing disclosures.
- Six skill categories retain short representative technologies, with the original summaries/lists available on demand. All six AI capability cards remain visible; longer AI context is optional. Azure remains exploring/planned.
- Hero, capability line, enterprise metrics, document actions, all four Resource cards, contact information, location and availability remain visible. No document was changed.

## Spacing and state

Supporting sections have less vertical padding; section returns and headings have smaller gaps while retaining practical touch targets. Governance, case-study and AI cards use tighter internal spacing. Hero spacing and the existing colors, typography, navigation and hover behavior are preserved.

Tabs received one optional navigation-wrapper prop so the original tab list can live inside the existing disclosure system while its active panel stays outside. ScenarioControls can render embedded settings without another nested accordion. Configuration and chart data remain mounted; opening/closing native details does not create a new scenario or reset its filters. SVG viewBox charts have no cached hidden-container width to recalculate.

## Modified files

- `src/RecruiterOverview.tsx`
- `src/EnterpriseContext.tsx`
- `src/FeaturedCaseStudies.tsx`
- `src/portfolioCases.ts`
- `src/App.tsx`
- `src/AiExperience.tsx`
- `src/AutomationImpactExplorer.tsx`
- `src/ReportingFramework.tsx`
- `src/decision-centre/DecisionCentre.tsx`
- `src/decision-centre/DueDateExecution.tsx`
- `src/decision-centre/Tabs.tsx`
- `src/decision-centre/scenario/ScenarioControls.tsx`
- `src/styles.css`
- `src/i18n/en.ts`, `src/i18n/de.ts`
- `tests/scenario-ui.test.mjs`, `tests/i18n.test.mjs`
- `README.md` and this report

## Validation and measurement

- `npm test`: **40 passed, 0 failed**. Original scenario, calculation, preset/filter, undo/reset, document, translation and navigation tests remain passing. New checks cover the five-stage scope preview, retained regional descriptions, one primary chart, accessible configuration placement and translated compact labels.
- `npm run build`: **passed**, including TypeScript checks. `git diff --check`: **passed**.
- Before/after rendered-content audit retains **158 original paragraph texts**, normalized for whitespace, plus the same **16 section IDs in the same order**. Existing tests also retain every full case-study field and all original scope and collaboration descriptions.
- Hash comparisons confirm `engine.ts`, `types.ts` and `ScenarioContext.tsx` are unchanged. No synthetic data-generation or calculation logic was edited.
- EN is still the default; new text has paired German dictionary entries. Document URLs remain shared English-only assets.
- Default-visible main-content words in server-rendered markup dropped **2,514 → 1,880 (25.2%)**. The audit excludes closed disclosure bodies, hidden tab panels, screen-reader-only text and unselected options. This is a content-visibility proxy, **not a page-height measurement**.

## Remaining review

No browser session was available. Actual desktop/mobile page height, visual overflow, screen-reader behavior and live interaction after opening charts were not browser-tested. Consequently, the requested 35–50% scrolling-height reduction is not claimed as measured. Lower visible text and tighter spacing produce a substantially denser initial layout, while the protected conversion content is retained. Final browser review should compare page heights and inspect charts, focus and EN/DE layout at representative desktop and mobile widths before publication.
