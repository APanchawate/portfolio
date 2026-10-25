import Localized from './i18n/Localized'
import ExploreDetails from './ExploreDetails'
import BackToTop from './navigation/BackToTop'
import { collaborationPartners, rolloutRegions, rolloutStages, scopeEngineeringStages, syntheticScopeRows } from './enterpriseContent'

export function OperatingModel() {
  return <Localized>{<section className="section operating-model" id="operating-model" tabIndex={-1} aria-labelledby="operating-title">
    <div className="section-head"><div><p className="kicker">BMW GROUP — GROUP FINANCE BACKBONE (GFBB)</p><h2 id="operating-title">Enterprise Test Management Operating Model</h2></div><p>Coordinating complex international testing operations across business, technology and rollout stakeholders.</p></div>
    <div className="collaboration-model" role="group" aria-label="Collaboration model; connections are not reporting lines">
      <div className="collaboration-lead">Central project leadership</div>
      <div className="collaboration-central"><div><h3>Central Rollout Management</h3><p>Overall rollout activities, process topics and stakeholder alignment.</p></div><div className="collaboration-primary"><p className="kicker">MY PRIMARY CONTRIBUTION</p><h3>Central Test Management</h3><p>Preparation, quality, timing, communication, execution monitoring and reporting.</p></div></div>
      <div className="collaboration-partners">{collaborationPartners.map(([title]) => <div key={title}><h4>{title}</h4></div>)}</div>
    </div>
    <p className="context-note">A collaboration model, not a formal reporting hierarchy. Finance Product Teams and markets determine business scope and test-case relevance. I do not manage Rollout Managers, Product Teams or implementation partners, or approve business scope, UAT sign-off or go-live.</p>
    <div className="operating-role"><h3>My role: technical ownership &amp; delivery coordination</h3><p>Core member of a two-person internal Central Test Management team, with primary technical responsibility for testing-specific Jira/Xray configuration and automation.</p><ExploreDetails heading="Explore Collaboration Details"><dl className="disclosure-definition-list">{collaborationPartners.map(([title,text])=><div key={title}><dt>{title}</dt><dd>{text}</dd></div>)}</dl><div className="operating-role-grid"><div><h4>Technical Ownership</h4><ul><li>Testing-specific Jira/Xray configuration and custom fields</li><li>Test Management Automation Hub</li><li>Dashboard and filter engineering</li><li>Master repository governance and quality standards</li><li>Regression testing infrastructure</li></ul></div><div><h4>Delivery Coordination</h4><ul><li>Market-specific UAT scope mapping</li><li>Product and market validation coordination</li><li>Tester readiness and execution planning</li><li>Defect and evidence follow-up</li><li>Cross-market reporting and stakeholder alignment</li></ul></div></div></ExploreDetails></div>
    <BackToTop/>
  </section>}</Localized>
}

export function ScopeEngineering() {
  return <Localized>{<section className="section scope-engineering" id="scope-engineering" tabIndex={-1} aria-labelledby="scope-engineering-title">
    <div className="section-head"><div><p className="kicker">FEATURED DELIVERY PROCESS</p><h2 id="scope-engineering-title">Market-Specific UAT Scope Engineering</h2></div><p>Transforming market requirements into structured, validated and execution-ready UAT test scopes.</p></div>
    <ol className="scope-process">{scopeEngineeringStages.map((stage, i) => <li key={stage.title}><span>0{i + 1}</span><h3>{stage.title}</h3></li>)}</ol>
    <p className="context-note">My role is preparation, mapping, quality review and coordination. Central Finance Product Teams and market stakeholders validate relevance and business scope; I do not decide or approve it unilaterally.</p>
    <ExploreDetails heading="Explore Scope Engineering Methodology"><dl className="disclosure-definition-list">{scopeEngineeringStages.map(stage => <div key={stage.title}><dt>{stage.title}</dt><dd>{stage.text}</dd></div>)}</dl>
    <details className="scope-example"><summary>Inspect an illustrative scope workbook</summary><p className="uat-data-note">Illustrative example — not client production data.</p><div className="uat-scroll" role="region" aria-label="Synthetic scope workbook; scroll horizontally on narrow screens" tabIndex={0}><table className="scope-workbook"><caption>Fictional company codes, cases, testers and relative due dates</caption><thead><tr>{['Market', 'Company Code', 'Finance Product', 'Test Case ID', 'Test Case Description', 'Scope Validation Status', 'Tester', 'Planned Execution Due Date'].map(label => <th scope="col" key={label}>{label}</th>)}</tr></thead><tbody>{syntheticScopeRows.map(row => <tr key={row.id}><th scope="row">{row.market}</th><td>{row.companyCode}</td><td>{row.product}</td><td>{row.id}</td><td>{row.description}</td><td>{row.validation}</td><td>{row.tester}</td><td>{row.due}</td></tr>)}</tbody></table></div></details>
    </ExploreDetails>
    <p className="scope-value"><strong>Business value:</strong> clearer scope transparency, cross-product coordination, consistent test-case quality and reuse of master cases support more structured UAT preparation.</p>
    <BackToTop/>
  </section>}</Localized>
}

export function ParallelRollouts() {
  return <Localized>{<section className="section parallel-rollouts" id="rollouts" tabIndex={-1} aria-labelledby="rollouts-title">
    <div className="section-head"><div><p className="kicker">INTERNATIONAL DELIVERY EXPERIENCE</p><h2 id="rollouts-title">International SAP S/4HANA UAT Rollout Experience</h2></div><p>Supported completed and ongoing enterprise UAT activities across European, North American, South American and Asian markets, coordinating testing preparation, execution monitoring and stakeholder reporting across multiple rollout streams.</p></div>
    <p className="context-note">Worked across different market testing phases, connecting Central Test Management, Finance Product Teams, market representatives and implementation partners to improve testing transparency, execution readiness and issue follow-up.</p>
    <div className="rollout-market-cards regional-rollout-cards">{rolloutRegions.map(region => <article key={region.name}><span>{region.status}</span><h3>{region.name}</h3><p>{region.activity}</p></article>)}</div>
    <details className="rollout-timeline-details"><summary>Explore regional testing phases</summary><div className="uat-scroll" role="region" aria-label="Regional testing phase overview; scroll horizontally on narrow screens" tabIndex={0}>
      <div className="rollout-time-chart regional-phase-chart"><div className="rollout-time-header"><span>Region</span><div>{rolloutStages.map(phase => <span key={phase}>{phase}</span>)}</div></div>
        {rolloutRegions.map(region => <div className="rollout-time-row" key={region.name}><strong>{region.name}</strong><ol aria-label={`${region.name}: ${region.phases.join(' and ')}`}>{region.phases.map(phase => <li key={phase} style={{ gridColumn: rolloutStages.indexOf(phase) + 1 }}><span>{phase}</span></li>)}</ol></div>)}
      </div></div><p className="context-note">General experience categories, not a dated rollout schedule. Completed UAT, ongoing execution and preparation are distinct; these regions are not all simultaneously executing UAT. Western Europe is shown separately to distinguish preparation and ongoing support from completed European UAT experience.</p></details>
    <ExploreDetails heading="Explore International Delivery Approach">
    <p className="rollout-coordination">My contribution spans market-specific scope preparation, reusable master test-case mapping, business validation coordination and test-case quality reviews; Jira/Xray Test Plan and Test Execution preparation, tester readiness, execution monitoring, defect and evidence follow-up, automated KPI reporting and international stakeholder alignment.</p>
    </ExploreDetails>
    <p className="context-note">Finance Product Teams and market stakeholders determine business-scope relevance. I coordinate preparation, governance and follow-up; formal UAT sign-off and go-live authorization remain with accountable stakeholders.</p>
    <BackToTop/>
  </section>}</Localized>
}
