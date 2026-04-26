export type CombatantType = 'player' | 'monster'

export interface MovementSpeeds {
  walk: number
  fly: number
  swim: number
}

export interface CharacterAttack {
  name: string
  modifier: number | null
  damageType: string
  damageDice: string
}

export interface CharacterAdditionalInfo {
  notes: string
  cr: string
  xp: number | null
  speeds: MovementSpeeds
  attacks: CharacterAttack[]
}

export interface Combatant extends CharacterAdditionalInfo {
  id: string
  name: string
  initiativeModifier: number
  initiative: number
  hp: number
  ac: number
  type: CombatantType
}

export interface CharacterTemplate extends CharacterAdditionalInfo {
  id: string
  name: string
  initiativeModifier: number
  hp: number
  ac: number
}

export interface CreateCharacterTemplatePayload extends CharacterAdditionalInfo {
  name: string
  initiativeModifier: number
  hp: number
  ac: number
}

export interface TrackerSnapshot {
  combatants: Combatant[]
  currentTurnId: string | null
  round: number
  playerCharacters: CharacterTemplate[]
  monsterCharacters: CharacterTemplate[]
}

export interface CreateCombatantPayload extends CharacterAdditionalInfo {
  name: string
  initiativeModifier: number
  hp: number
  ac: number
  type: CombatantType
}

export type ImportResult = { ok: true } | { ok: false; error: string }

export interface TrackerState extends TrackerSnapshot {
  playerCharacters: CharacterTemplate[]
  monsterCharacters: CharacterTemplate[]
  addCombatant: (payload: CreateCombatantPayload) => void
  updateCombatant: (id: string, patch: Partial<Omit<Combatant, 'id'>>) => void
  removeCombatant: (id: string) => void
  addCharacterTemplate: (type: CombatantType, payload: CreateCharacterTemplatePayload) => void
  updateCharacterTemplate: (
    type: CombatantType,
    id: string,
    patch: Partial<Omit<CharacterTemplate, 'id'>>,
  ) => void
  removeCharacterTemplate: (type: CombatantType, id: string) => void
  rollInitiative: () => void
  rollMonsterInitiative: () => void
  sortByInitiative: () => void
  nextTurn: () => void
  resetBattle: () => void
  resetTracker: () => void
  exportSnapshot: () => TrackerSnapshot
  importSnapshot: (payload: unknown) => ImportResult
}

export type NumericPatchKey = 'initiative' | 'hp' | 'ac'

export interface DetailRow {
  key: string
  label: string
  value: string | number
}

export interface CurrentTurnDetail {
  key: string
  label: string
  value: string | number
}

export interface AddCombatantFormValues {
  type: Combatant['type']
  name: string
  initiativeModifier: number
  hp: number
  ac: number
}
