import type { CombatantType } from '@entities/tracker/types.ts'

export const DEFAULT_HP = 1
export const DEFAULT_AC = 10
export const DEFAULT_TEMPLATE_HP = 0
export const DEFAULT_TEMPLATE_AC = 10
export const DEFAULT_NOTES = ''
export const DEFAULT_CR = ''
export const DEFAULT_DAMAGE_DICE = ''
export const TRAILING_INDEX_PATTERN = /^(.*?)(?:\s+(\d+))?$/

export const DEFAULT_COMBATANT_FORM_VALUES_BY_TYPE: Record<
  CombatantType,
  {
    initiativeModifier: number
    hp: number
    ac: number
  }
> = {
  player: {
    initiativeModifier: 0,
    hp: 0,
    ac: 10,
  },
  monster: {
    initiativeModifier: 0,
    hp: 10,
    ac: 10,
  },
}

export const EMPTY_TEMPLATE_DETAILS = {
  notes: '',
  cr: '',
  xp: null,
  attackModifier: null,
  damageDice: '',
} as const
