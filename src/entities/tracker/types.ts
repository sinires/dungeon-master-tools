export type CombatantType = 'player' | 'monster'

export interface Combatant {
  id: string
  name: string
  initiativeModifier: number
  initiative: number
  hp: number
  ac: number
  type: CombatantType
}

export interface TrackerSnapshot {
  combatants: Combatant[]
  currentTurnId: string | null
  round: number
}

export interface CreateCombatantPayload {
  name: string
  initiativeModifier: number
  hp: number
  ac: number
  type: CombatantType
}

export type ImportResult = { ok: true } | { ok: false; error: string }

export interface TrackerState extends TrackerSnapshot {
  addCombatant: (payload: CreateCombatantPayload) => void
  updateCombatant: (id: string, patch: Partial<Omit<Combatant, 'id'>>) => void
  removeCombatant: (id: string) => void
  rollInitiative: () => void
  rollMonsterInitiative: () => void
  sortByInitiative: () => void
  nextTurn: () => void
  resetBattle: () => void
  resetTracker: () => void
  exportSnapshot: () => TrackerSnapshot
  importSnapshot: (payload: unknown) => ImportResult
}
