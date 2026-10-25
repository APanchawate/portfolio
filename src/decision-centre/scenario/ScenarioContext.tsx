import { createContext, useCallback, useContext, useMemo, useReducer, useState } from 'react'
import type { Dispatch, ReactNode } from 'react'
import { createScenario, scenarioReducer, snapshot } from './engine'
import type { ScenarioAction, ScenarioState } from './types'
const ScenarioContext = createContext<{ state: ScenarioState; dispatch: Dispatch<ScenarioAction>; epoch: number; metrics: ReturnType<typeof snapshot> } | null>(null)
export function ScenarioProvider({ children }: { children: ReactNode }) {
  const [state, rawDispatch] = useReducer(scenarioReducer, undefined, () => createScenario())
  const [epoch, setEpoch] = useState(0)
  const dispatch = useCallback((action: ScenarioAction) => {
    if (action.type === 'reset' || action.type === 'preset') setEpoch(value => value + 1)
    rawDispatch(action)
  }, [])
  const metrics = useMemo(() => snapshot(state, state.filters), [state.cases, state.defects, state.filters])
  const value = useMemo(() => ({ state, dispatch, epoch, metrics }), [state, dispatch, epoch, metrics])
  return <ScenarioContext.Provider value={value}>{children}</ScenarioContext.Provider>
}
export const useOptionalScenario = () => useContext(ScenarioContext)
export function useScenario() {
  const value = useOptionalScenario()
  if (!value) throw new Error('Scenario gadgets require ScenarioProvider')
  return value
}
