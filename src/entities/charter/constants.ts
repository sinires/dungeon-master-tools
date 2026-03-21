import type { CombatantType } from '@entities/tracker'
import type { CharacterTemplateFormDefaults } from './types'

export const DEFAULT_TEMPLATE_FORM_VALUES_BY_TYPE: Record<CombatantType, CharacterTemplateFormDefaults> = {
  player: {
    initiativeModifier: 0,
    hp: 0,
    ac: 10,
    notes: '',
    cr: '',
    xp: null,
    attackModifier: null,
    damageDice: '',
  },
  monster: {
    initiativeModifier: 0,
    hp: 10,
    ac: 10,
    notes: '',
    cr: '',
    xp: null,
    attackModifier: null,
    damageDice: '',
  },
}
