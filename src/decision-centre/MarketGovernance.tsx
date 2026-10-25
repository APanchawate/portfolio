import Localized from '../i18n/Localized'
import { useState } from 'react'
import { markets } from './data'
import Tabs from './Tabs'
import ControlTower from './scenario/ControlTower'

function LegacyDependencies() {
  const [selected, setSelected] = useState(2)
  const market = markets[selected]
  const high = markets.filter(item => item.priority === 'High')
  const blocked = markets.filter(item => item.blocker !== 'None recorded in this example')
  return <Localized>{<>
    <p className="dc-market-summary"><strong>Illustrative portfolio:</strong> {markets.length} fictional markets · {blocked.length} with open blockers · {high.length} high-priority escalations. Immediate follow-up: {high.map(item => item.name).join(', ')}.</p>
    <div className="uat-scroll" role="region" aria-label="Fictional market status matrix; scroll horizontally on narrow screens" tabIndex={0}>
      <table className="dc-market-table"><caption>Fictional markets · independent parallel workstreams</caption><thead><tr>{['Market', 'Current phase', 'Dependency', 'Open blocker', 'Escalation'].map(label => <th scope="col" key={label}>{label}</th>)}</tr></thead><tbody>{markets.map((item, i) => <tr key={item.name} className={i === selected ? 'dc-market-selected' : ''}><th scope="row"><button type="button" aria-pressed={i === selected} onClick={() => setSelected(i)} title={item.action}>{item.name}</button></th><td>{item.phase}</td><td>{item.dependency}</td><td>{item.blocker}</td><td><span className={`dc-priority dc-priority-${item.priority.toLowerCase()}`}>{item.priority}</span></td></tr>)}</tbody></table>
    </div>
    <p className="uat-detail" role="status"><strong>{market.name} · {market.phase}</strong><br/>Coordination owners: {market.owner}.<br/>{market.action}</p>
    <p className="uat-explanation">Select a market to inspect the next coordination action. Phase labels show each workstream’s current focus; defect follow-up, regression and reporting can overlap. Central and Market Rollout Managers coordinate overall rollout activities, process topics and stakeholder alignment. Central Test Management supports them with testing coordination, monitoring and reporting; this summary informs follow-up and escalation.</p>
  </>}</Localized>
}

export default function MarketGovernance() {
  const [active,setActive]=useState(0)
  return <Localized>{<><Tabs labels={['Market Control Tower','Dependencies & Escalations']} label="Multi-market governance gadgets" active={active} onChange={setActive}><ControlTower dependencies={active===1}/></Tabs><details className="dc-thresholds"><summary>Earlier fictional coordination example (independent reference)</summary><p className="uat-data-note">This narrative reference is independent of the shared scenario and does not change its metrics.</p><LegacyDependencies/></details></>}</Localized>
}
