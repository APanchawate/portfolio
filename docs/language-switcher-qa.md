# English / German portfolio translation

Implemented locally on 25 October 2026. No commit, push or deployment.

## Behavior

The navbar offers EN / DE without flags. English is the first-visit default regardless of browser language. A valid stored German choice opts into German on refresh. The selected language is saved under `portfolio-language` when localStorage is available; blocked storage safely falls back to English. The provider updates `document.documentElement.lang` to en/de. No additional language routes, translation APIs, external translation services or dependencies were introduced. Existing title, description, canonical URL and Open Graph metadata remain unchanged.

Both languages use the exact same English CV PDF, seven-page presentation PDF and seven-slide PowerPoint. Buttons and accessibility labels translate; hrefs and download filenames do not. Resources states “Documents available in English.” / “Dokumente sind auf Englisch verfügbar.” No German document was created. Original/public document hashes match.

## Translation structure and maintenance

- `src/i18n/en.ts` and `src/i18n/de.ts`: 1,422 matching stable message keys, including dynamic-message templates. The German file is checked against the English key type at build time. Product/technology names, official credential names and synthetic identifiers intentionally retain their original form where appropriate.
- `src/i18n/translate.ts`: exact-copy lookup, parameterized messages, composed UI labels and display-only German date/number formatting. The typed `t` helper and unknown messages retain English fallback. No numerical scenario value or timestamp is edited.
- `src/i18n/LanguageContext.tsx`: default selection, safe persistence, language state and document language.
- `src/i18n/LanguageSwitcher.tsx`: native keyboard-operable buttons, active cyan state and accessible group/button labels.
- `src/i18n/Localized.tsx`: a React render adapter for existing component copy. It localizes native rendered text and presentation attributes, not custom component input data. IDs, keys, links, event handlers, refs and control values are preserved. Option values remain English even when their displayed labels are German. Both languages retain the same element types and keys; there are no locale-dependent subtree keys or DOM-mutation translation observers.

For new copy, add the English source and German equivalent under the same stable key in both dictionaries. Include parameter placeholders for generated messages. Keep document filenames, CSS classes, element IDs, source enums and scenario records outside translation. Test the affected English and German view. The existing English wording remains in the source components so the render adapter can provide a gradual, centralized translation layer without rewriting business logic.

## Modified files

New: the six files in `src/i18n/` above; `tests/i18n.test.mjs`; `tests/language-persistence.test.mjs`; this report.

Integration: `src/main.tsx` supplies the provider; `src/navigation/SiteNavigation.tsx` adds the switcher and preserves the compact CV label; `src/ProfessionalResources.tsx` adds the document-language note; `src/styles.css` handles active language, longer German labels, compact headers and word wrapping; `vite.config.ts` places dictionaries in a separately cached translation chunk.

Presentation-only Localized boundaries were added to:

- `src/App.tsx`, `AiExperience.tsx`, `AutomationHubArchitecture.tsx`, `AutomationImpactExplorer.tsx`, `DocumentActions.tsx`, `EnterpriseContext.tsx`, `ExploreDetails.tsx`, `FeaturedCaseStudies.tsx`, `ProfessionalResources.tsx`, `RecruiterOverview.tsx`, `ReportingFramework.tsx`, `UatVisuals.tsx`.
- `src/navigation/BackToTop.tsx`, `FloatingBackToTop.tsx`, `SiteNavigation.tsx`.
- `src/decision-centre/DecisionCentre.tsx`, `DueDateExecution.tsx`, `ExecutionEvidenceRisks.tsx`, `MarketGovernance.tsx`, `ReadinessSimulator.tsx`, `RiskIntelligence.tsx`, `Tabs.tsx`, `TestDataBlockers.tsx`, `UatPhaseTimeline.tsx`.
- `src/decision-centre/scenario/ControlTower.tsx`, `DataReadiness.tsx`, `DefectIntelligence.tsx`, `EvidenceMonitor.tsx`, `MetricHelp.tsx`, `RiskHeatmap.tsx`, `ScenarioControls.tsx`, `ScenarioReadiness.tsx`, `ScopeChanges.tsx`, `SharedUi.tsx`.

`tests/navigation.test.mjs` was adapted to ignore the presentation adapter in its pre-existing lightweight English navigation harness. Its existing behavior checks remain. README links to this report.

## Coverage and validation

- All website sections and expandable material, navigation, hero, operating model, case studies, scope engineering, regional experience, Jira/Xray governance, UAT methodology, Decision Centre, AI/skills, experience, education, resources, opportunities, contact and Back to Top are covered.
- Chart titles, axes, legends, KPI descriptions, tooltips, scenario settings, generated change messages, empty states and accessible labels are translated. German terminology maintains responsibility and approval boundaries; B1 certification is preserved without claiming B2 or practical German fluency.
- All twelve Decision Centre views were rendered in German, including an altered scenario, without React render warnings. A prose review found no remaining English explanatory text in those checked views; identifiers and established names are intentional exceptions. This is a rendering/copy audit, not browser visual proof.
- `npm test`: **37 passed, 0 failed**. Tests cover English-first selection, stored choice, storage denial, HTML language and persistence effects, matching dictionary keys, dynamic translation, unknown-copy fallback, stable native element keys, retained controls/option values/handlers/links, unchanged document hashes, all section IDs, German document actions, German empty states, all twelve translated scenario views and the original scenario/navigation/regression checks.
- Hash checks confirm the scenario engine, types, provider and source datasets remain unchanged. Scenario JSON and identifiers remain unchanged during translated rendering. Actual UI-state preservation follows stable types/keys and unchanged control values; a mounted browser journey remains outstanding.
- TypeScript checks and production build: passed. Whitespace checks: passed. No new runtime dependency.
- Dictionaries are split into a dedicated build chunk. Final production sizes are recorded in the build output; no Lighthouse or timing score is claimed.

## Remaining review

No browser session was available. No desktop/tablet/mobile viewport screenshots, computed-layout/overflow pass, screen-reader check or live language-switch journey is claimed. Static responsive rules and rendered markup were reviewed, including the longer German navigation; a real-browser check at 1440, 1024, 768, 390 and 320 px remains the final visual review step.

No known missing translations remain in the checked views. New future text must receive dictionary entries; unknown messages have English fallback. LocalStorage restrictions intentionally prevent persistence without blocking navigation or language changes in the current session.
