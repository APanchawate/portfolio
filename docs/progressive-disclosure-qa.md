# Progressive disclosure refinement

Implemented locally on 25 October 2026. No commit, push or deployment.

## Default experience

The hero, six expertise navigation cards, collaboration diagram and role distinction, six-stage scope diagram, regional rollout cards, four concise platform capabilities, five-stage UAT recipe and its outputs, six AI application cards, education, resources and contact remain visible. Employment organizations, titles, existing period labels, brief summaries and the first three existing key responsibilities remain visible; the complete original employer narrative and remaining points are optional.

Case studies show Challenge, My Contribution and Business Value. The Automation Hub and all its capabilities, architecture, supporting projects and effort simulator remain available. Reporting framework cards and workflows now sit inside the reporting case study's technical disclosure.

The Decision Centre retains its executive KPIs, four navigation cards and selected primary visualization/KPIs. Longer process narratives, formulas, management explanations and secondary reconciliation tables are expandable. Applicable Undo/Reset actions now sit with their existing controls inside Advanced Simulation Settings. No scenario calculation was changed.

## Modified files

- `src/ExploreDetails.tsx` — new reusable native details/summary component, with custom labels, short context, optional icon, Show Less state, stable content IDs and default-collapsed behavior.
- `src/App.tsx` — concise capability summaries; preserved technical ownership details, one methodology disclosure, experience/skills disclosures, and initial/hash/history anchor reveal.
- `src/EnterpriseContext.tsx` — collaboration, scope and international delivery disclosures; the existing regional phase disclosure remains independently accessible.
- `src/FeaturedCaseStudies.tsx` — consistent business-first cards and Explore Technical Approach disclosures.
- `src/AiExperience.tsx` — shared disclosure for assistant details; all six cards remain visible.
- `src/AutomationImpactExplorer.tsx` — optional assumptions start collapsed.
- `src/styles.css` — integrated disclosure styles, touch targets, narrow-screen containment and restrained reduced-motion-aware opening feedback.
- `src/decision-centre/DecisionCentre.tsx` — optional management interpretation.
- `src/decision-centre/DueDateExecution.tsx` — optional longer interpretation and workstream reconciliation; chart, reporting controls and metrics remain visible.
- `src/decision-centre/scenario/ScenarioControls.tsx` — conditional actions moved inside the existing advanced accordion; compact context remains outside.
- `src/decision-centre/scenario/ScenarioReadiness.tsx` — visible assessment and primary KPIs; detailed criteria remain available on demand.
- `src/decision-centre/scenario/RiskHeatmap.tsx` — visible heatmap, optional calculation explanation.
- `src/decision-centre/scenario/EvidenceMonitor.tsx` — optional counting/role explanation.
- `src/decision-centre/scenario/DataReadiness.tsx` — optional blocker counting/rules explanation.
- `src/decision-centre/scenario/ScopeChanges.tsx` — optional detailed scope-counting/reset explanation.
- `src/decision-centre/scenario/ControlTower.tsx` — optional longer market context/risk rules; market selection and primary views remain visible.
- `tests/navigation.test.mjs` — refresh, encoded hashes, malformed hashes and back/forward reveal checks added to existing lightweight navigation tests.
- `tests/scenario-ui.test.mjs` — default visibility, collapsed disclosure relationships and source-content preservation checks.
- `README.md` and this report — current UX and validation documentation.

## Validation

- `npm test`: **27 passed, 0 failed**. All existing scenario/preset/filter/scope/execution/evidence/defect/readiness/reset/formula tests remain passing.
- `npm run build`: **passed**, including TypeScript project checks.
- `git diff --check`: **passed**.
- The same **16 major section IDs**, in the same order, are retained. Existing section returns, the single labelled floating Back to Top, navigation routes, hero and document actions remain intact.
- A before/after rendered-text audit retained **164 original paragraph texts**, normalized for whitespace. Source-content tests additionally verify all case-study fields, stakeholder descriptions and scope-stage explanations.
- Hash comparisons confirm the scenario engine, types, provider and source datasets are unchanged.
- Native summary controls provide built-in keyboard and expanded/collapsed semantics. Closed/open text labels follow the native `open` attribute; anchor reveal does not conflict with controlled React state. Reduced-motion rules disable opening feedback.

## Limits and review items

No real browser executed: browser discovery reported no available session. Responsive CSS and server-rendered structure were reviewed, but desktop/mobile visual layout, computed contrast, native toggle behavior, screen-reader behavior and real-browser interaction journeys still need human/browser verification. Lightweight navigation tests use mocked effects/DOM, not a real browser.

The existing presentation PDF remains missing at `public/resources/enterprise-test-management.pdf`; existing safe Resources fallback and PowerPoint download are preserved. No document asset or confidential screenshot was added or edited. No new section, dashboard gadget or dependency was introduced.
