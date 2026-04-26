import type { CombatantType } from '@entities/tracker'
import type { CharacterTemplateFormDefaults } from './types'

export const DEFAULT_TEMPLATE_FORM_VALUES_BY_TYPE: Record<
  CombatantType,
  CharacterTemplateFormDefaults
> = {
  player: {
    initiativeModifier: 0,
    hp: 0,
    ac: 10,
    notes: '',
    cr: '',
    xp: null,
    speeds: {
      walk: 0,
      fly: 0,
      swim: 0,
    },
    attacks: [],
  },
  monster: {
    initiativeModifier: 0,
    hp: 10,
    ac: 10,
    notes: '',
    cr: '',
    xp: null,
    speeds: {
      walk: 30,
      fly: 0,
      swim: 0,
    },
    attacks: [],
  },
}
