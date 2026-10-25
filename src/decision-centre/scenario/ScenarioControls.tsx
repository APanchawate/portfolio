import Localized from '../../i18n/Localized'
import { defaultFilters, marketContext, products } from './engine'
import { reportingDates, shortDate } from '../dueDateData'
import { useScenario } from './ScenarioContext'
import type { Market, Preset } from './types'
export default function ScenarioControls({ hasGadgetChanges = false }: { hasGadgetChanges?: boolean }) {
  const {state,dispatch,metrics}=useScenario()
  const canReset = hasGadgetChanges || state.past.length > 0 || state.log.length > 0 || state.preset !== 'On Track' || Object.entries(defaultFilters).some(([key,value]) => state.filters[key as keyof typeof defaultFilters] !== value)
  return <Localized>{<div className="dc-simulation-settings">
    <div className="scenario-state-line"><p role="status"><strong>{state.preset}</strong> · {state.filters.market} · {state.filters.product} · {shortDate(state.filters.date)} 2027 · {state.log.length ? `${state.log.length} local changes` : 'Unmodified preset'}{hasGadgetChanges ? ' · View settings adjusted' : ''}</p>

    </div>
    <details className="scenario-controls dc-advanced-settings"><summary>Advanced Simulation Settings</summary>
      {(state.past.length > 0 || canReset) && <div className="scenario-actions">{state.past.length > 0 && <button type="button" onClick={()=>dispatch({type:'undo'})}>Undo last change</button>}{canReset && <button type="button" onClick={()=>dispatch({type:'reset'})}>Reset to Default Scenario</button>}</div>}<div className="scenario-filter-grid">
    <label>Scenario preset<select value={state.preset} onChange={event=>dispatch({type:'preset',preset:event.target.value as Preset})}>{['On Track','At Risk','Scope Expansion'].map(value=><option key={value}>{value}</option>)}</select></label>
    <label>Market<select value={state.filters.market} onChange={event=>dispatch({type:'filters',filters:{market:event.target.value as Market|'All markets'}})}><option>All markets</option>{marketContext.map(market=><option key={market.name}>{market.name}</option>)}</select></label>
    <label>Finance Product<select value={state.filters.product} onChange={event=>dispatch({type:'filters',filters:{product:event.target.value}})}><option>All Finance Products</option>{products.map(product=><option key={product}>{product}</option>)}</select></label>
    <label>Reporting date<select value={state.filters.date} onChange={event=>dispatch({type:'filters',filters:{date:event.target.value}})}>{reportingDates.map(date=><option key={date} value={date}>{shortDate(date)} 2027</option>)}</select></label>
  </div>
    {!metrics.scope&&<p className="scenario-empty" role="status">No in-scope test cases match this market, Finance Product and reporting date. Choose another selection or reset the scenario; percentages and forecasts are not assessed.</p>}
    <div className="scenario-assumptions"><h4>Scenario assumptions &amp; active modifications</h4><p className="uat-explanation">On Track describes an execution profile, not release approval. All controls affect synthetic local browser-session records only. No Jira calls or persistent storage. Historical US/Mexico examples are labelled separately from active-phase examples. Data, scope, evidence and defect edits are dated; timing adjustments recompute a counterfactual execution history for the selected non-historical scope. Presets restore their seed records and keep filters; full reset restores On Track, all markets/products and the default reporting date.</p>{state.log.length?<ul className="scenario-change-log">{state.log.slice(-8).map((entry,index)=><li key={index}>{entry}</li>)}</ul>:<p className="uat-explanation">No manual modifications.</p>}</div>
    </details>
  </div>}</Localized>
}
