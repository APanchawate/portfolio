import Localized from '../../i18n/Localized'
import { Children } from 'react'
import type { ReactNode } from 'react'
import MetricHelp from './MetricHelp'
export const percent = (value: number | null) => value === null || !Number.isFinite(value) ? 'N/A' : `${value.toFixed(1)}%`
export function Kpis({ items }: { items: readonly (readonly [string, ReactNode])[] }) {
  return <Localized>{<dl className="scenario-kpis">{items.map(([label, value]) => <div key={label}><dt>{label}<MetricHelp label={label}/></dt><dd>{value}</dd></div>)}</dl>}</Localized>
}
export function ScenarioTable({ caption, headers, children, emptyMessage = 'No matching records for these filters. Try another selection or reset the scenario.' }: { caption: string; headers: readonly string[]; children: ReactNode; emptyMessage?: string }) {
  return <Localized>{<div className="uat-scroll scenario-table-scroll" role="region" aria-label={caption} tabIndex={0}><table className="scenario-table"><caption>{caption}</caption><thead><tr>{headers.map(header => <th scope="col" key={header}>{header}</th>)}</tr></thead><tbody>{Children.count(children) ? children : <tr><td colSpan={headers.length} className="scenario-empty">{emptyMessage}</td></tr>}</tbody></table></div>}</Localized>
}
export function GroupBars({ title, items }: { title: string; items: {label:string;count:number}[] }) {
  const total=items.reduce((sum,item)=>sum+item.count,0)
  return <Localized>{<div className="dc-count-bars"><h5>{title}</h5>{!total && <p className="scenario-empty">No records in this breakdown under the current filters.</p>}<ul>{items.map(item=><li key={item.label} title={`${item.label}: ${item.count} of ${total}`}><span>{item.label}</span><span className="dc-bar-track" aria-hidden="true"><span style={{width:`${total?item.count/total*100:0}%`}}/></span><strong>{item.count}</strong></li>)}</ul></div>}</Localized>
}
