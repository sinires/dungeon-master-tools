import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { rollDiceExpression } from '@shared/utils/dice'
import { createId } from '@shared/utils/id'
import type { CharacterTemplate, CombatantType, ImportResult, TrackerState } from './types'
import {
  getIndexedCombatantName,
  getInitiativeFromModifier,
  getRolledInitiative,
  getValidCurrentTurnId,
  isCombatantType,
  parseImportedSnapshot,
  sortCombatants,
} from './utils'

const STORAGE_KEY = 'd-master-tools:initiative-tracker'
const DEFAULT_TEMPLATE_AC = 10
const DEFAULT_TEMPLATE_HP = 0
const DEFAULT_TEMPLATE_NOTES = ''
const DEFAULT_TEMPLATE_CR = ''
const DEFAULT_TEMPLATE_XP = null
const DEFAULT_TEMPLATE_ATTACK_MODIFIER = null
const DEFAULT_TEMPLATE_DAMAGE_DICE = ''

const normalizeNullableNumber = (value: number | null): number | null =>
  value === null || !Number.isFinite(value) ? null : value

const sortCharacterTemplates = (templates: CharacterTemplate[]) => {
  templates.sort((first, second) => first.name.localeCompare(second.name, 'en'))
}

const getCharacterTemplates = (
  state: { playerCharacters: CharacterTemplate[]; monsterCharacters: CharacterTemplate[] },
  type: CombatantType,
): CharacterTemplate[] => (type === 'player' ? state.playerCharacters : state.monsterCharacters)

export const useTrackerStore = create<TrackerState>()(
  persist(
    immer((set, get) => ({
      combatants: [],
      currentTurnId: null,
      round: 0,
      playerCharacters: [],
      monsterCharacters: [],

      addCombatant: (payload) =>
        set((state) => {
          const name = payload.name.trim()
          const normalizedXp = normalizeNullableNumber(payload.xp)
          const normalizedAttackModifier = normalizeNullableNumber(payload.attackModifier)

          if (!name) {
            return
          }

          const resolvedName =
            payload.type === 'player' ? name : getIndexedCombatantName(state.combatants, name)

          state.combatants.push({
            id: createId(),
            name: resolvedName,
            initiativeModifier: payload.initiativeModifier,
            initiative: getInitiativeFromModifier(payload.initiativeModifier),
            hp: Math.max(0, Math.floor(payload.hp)),
            ac: Math.max(0, Math.floor(payload.ac)),
            type: payload.type,
            notes: payload.notes.trim() || DEFAULT_TEMPLATE_NOTES,
            cr: payload.cr.trim() || DEFAULT_TEMPLATE_CR,
            xp: normalizedXp === null ? DEFAULT_TEMPLATE_XP : Math.max(0, Math.floor(normalizedXp)),
            attackModifier:
              normalizedAttackModifier === null
                ? DEFAULT_TEMPLATE_ATTACK_MODIFIER
                : Math.trunc(normalizedAttackModifier),
            damageDice: payload.damageDice.trim() || DEFAULT_TEMPLATE_DAMAGE_DICE,
          })

          sortCombatants(state.combatants)
          state.currentTurnId = getValidCurrentTurnId(state.combatants, state.currentTurnId)
          state.round = Math.max(1, state.round)
        }),

      updateCombatant: (id, patch) =>
        set((state) => {
          const combatant = state.combatants.find((item) => item.id === id)

          if (!combatant) {
            return
          }

          if (patch.name !== undefined) {
            const normalizedName = patch.name.trim()
            if (!normalizedName) {
              return
            }

            combatant.name = normalizedName
          }

          if (patch.initiative !== undefined && Number.isFinite(patch.initiative)) {
            combatant.initiative = patch.initiative
          }

          if (patch.initiativeModifier !== undefined && Number.isFinite(patch.initiativeModifier)) {
            combatant.initiativeModifier = patch.initiativeModifier
          }

          if (patch.hp !== undefined && Number.isFinite(patch.hp)) {
            combatant.hp = Math.max(0, Math.floor(patch.hp))
          }

          if (patch.ac !== undefined && Number.isFinite(patch.ac)) {
            combatant.ac = Math.max(0, Math.floor(patch.ac))
          }

          if (patch.type !== undefined && isCombatantType(patch.type)) {
            combatant.type = patch.type
          }

          sortCombatants(state.combatants)

          state.currentTurnId = getValidCurrentTurnId(state.combatants, state.currentTurnId)
          state.round = state.combatants.length === 0 ? 0 : Math.max(1, state.round)
        }),

      removeCombatant: (id) =>
        set((state) => {
          const removedIndex = state.combatants.findIndex((combatant) => combatant.id === id)

          if (removedIndex < 0) {
            return
          }

          const isCurrentTurn = state.currentTurnId === id
          state.combatants.splice(removedIndex, 1)

          if (state.combatants.length === 0) {
            state.currentTurnId = null
            state.round = 0
            return
          }

          if (isCurrentTurn) {
            state.currentTurnId = state.combatants[removedIndex % state.combatants.length].id
            state.round = Math.max(1, state.round)
            return
          }

          state.currentTurnId = getValidCurrentTurnId(state.combatants, state.currentTurnId)
          state.round = Math.max(1, state.round)
        }),

      addCharacterTemplate: (type, payload) =>
        set((state) => {
          const name = payload.name.trim()
          const normalizedXp = normalizeNullableNumber(payload.xp)
          const normalizedAttackModifier = normalizeNullableNumber(payload.attackModifier)

          if (!name) {
            return
          }

          const templates = getCharacterTemplates(state, type)

          templates.push({
            id: createId(),
            name,
            initiativeModifier: Number.isFinite(payload.initiativeModifier)
              ? Math.trunc(payload.initiativeModifier)
              : 0,
            hp: Math.max(
              0,
              Math.floor(Number.isFinite(payload.hp) ? payload.hp : DEFAULT_TEMPLATE_HP),
            ),
            ac: Math.max(
              0,
              Math.floor(Number.isFinite(payload.ac) ? payload.ac : DEFAULT_TEMPLATE_AC),
            ),
            notes: payload.notes.trim() || DEFAULT_TEMPLATE_NOTES,
            cr: payload.cr.trim() || DEFAULT_TEMPLATE_CR,
            xp: normalizedXp === null ? DEFAULT_TEMPLATE_XP : Math.max(0, Math.floor(normalizedXp)),
            attackModifier:
              normalizedAttackModifier === null
                ? DEFAULT_TEMPLATE_ATTACK_MODIFIER
                : Math.trunc(normalizedAttackModifier),
            damageDice: payload.damageDice.trim() || DEFAULT_TEMPLATE_DAMAGE_DICE,
          })

          sortCharacterTemplates(templates)
        }),

      updateCharacterTemplate: (type, id, patch) =>
        set((state) => {
          const templates = getCharacterTemplates(state, type)
          const template = templates.find((item) => item.id === id)

          if (!template) {
            return
          }

          if (patch.name !== undefined) {
            const normalizedName = patch.name.trim()
            if (!normalizedName) {
              return
            }

            template.name = normalizedName
          }

          if (patch.initiativeModifier !== undefined && Number.isFinite(patch.initiativeModifier)) {
            template.initiativeModifier = Math.trunc(patch.initiativeModifier)
          }

          if (patch.hp !== undefined && Number.isFinite(patch.hp)) {
            template.hp = Math.max(0, Math.floor(patch.hp))
          }

          if (patch.ac !== undefined && Number.isFinite(patch.ac)) {
            template.ac = Math.max(0, Math.floor(patch.ac))
          }

          if (patch.notes !== undefined) {
            template.notes = patch.notes.trim()
          }

          if (patch.cr !== undefined) {
            template.cr = patch.cr.trim()
          }

          if (patch.xp !== undefined) {
            const normalizedXp = normalizeNullableNumber(patch.xp)
            template.xp = normalizedXp === null ? null : Math.max(0, Math.floor(normalizedXp))
          }

          if (patch.attackModifier !== undefined) {
            const normalizedAttackModifier = normalizeNullableNumber(patch.attackModifier)
            template.attackModifier =
              normalizedAttackModifier === null ? null : Math.trunc(normalizedAttackModifier)
          }

          if (patch.damageDice !== undefined) {
            template.damageDice = patch.damageDice.trim()
          }

          sortCharacterTemplates(templates)
        }),

      removeCharacterTemplate: (type, id) =>
        set((state) => {
          const templates = getCharacterTemplates(state, type)
          const templateIndex = templates.findIndex((item) => item.id === id)

          if (templateIndex < 0) {
            return
          }

          templates.splice(templateIndex, 1)
        }),

      rollInitiative: () =>
        set((state) => {
          if (state.combatants.length === 0) {
            state.currentTurnId = null
            state.round = 0
            return
          }

          for (const combatant of state.combatants) {
            const roll = rollDiceExpression('1d20').total
            combatant.initiative = getRolledInitiative(roll, combatant.initiativeModifier)
          }

          sortCombatants(state.combatants)
          state.currentTurnId = getValidCurrentTurnId(state.combatants, state.currentTurnId)
          state.round = 1
        }),

      rollMonsterInitiative: () =>
        set((state) => {
          let hasMonsters = false

          for (const combatant of state.combatants) {
            if (combatant.type !== 'monster') {
              continue
            }

            hasMonsters = true
            const roll = rollDiceExpression('1d20').total
            combatant.initiative = getRolledInitiative(roll, combatant.initiativeModifier)
          }

          if (!hasMonsters) {
            return
          }

          sortCombatants(state.combatants)
          state.currentTurnId = getValidCurrentTurnId(state.combatants, state.currentTurnId)
          state.round = Math.max(1, state.round)
        }),

      sortByInitiative: () =>
        set((state) => {
          sortCombatants(state.combatants)

          state.currentTurnId = getValidCurrentTurnId(state.combatants, state.currentTurnId)
          state.round = state.combatants.length === 0 ? 0 : Math.max(1, state.round)
        }),

      nextTurn: () =>
        set((state) => {
          if (state.combatants.length === 0) {
            state.currentTurnId = null
            state.round = 0
            return
          }

          if (!state.currentTurnId) {
            state.currentTurnId = state.combatants[0].id
            state.round = Math.max(1, state.round)
            return
          }

          const currentIndex = state.combatants.findIndex(
            (combatant) => combatant.id === state.currentTurnId,
          )

          if (currentIndex < 0) {
            state.currentTurnId = state.combatants[0].id
            state.round = Math.max(1, state.round)
            return
          }

          const nextIndex = (currentIndex + 1) % state.combatants.length
          state.currentTurnId = state.combatants[nextIndex].id

          if (nextIndex === 0) {
            state.round = Math.max(1, state.round) + 1
            return
          }

          state.round = Math.max(1, state.round)
        }),

      resetBattle: () =>
        set((state) => {
          if (state.combatants.length === 0) {
            state.currentTurnId = null
            state.round = 0
            return
          }

          sortCombatants(state.combatants)
          state.currentTurnId = state.combatants[0].id
          state.round = 1
        }),

      resetTracker: () =>
        set((state) => {
          state.combatants = []
          state.currentTurnId = null
          state.round = 0
        }),

      exportSnapshot: () => {
        const { combatants, currentTurnId, round, playerCharacters, monsterCharacters } = get()

        return {
          combatants: combatants.map((combatant) => ({ ...combatant })),
          currentTurnId,
          round,
          playerCharacters: playerCharacters.map((character) => ({ ...character })),
          monsterCharacters: monsterCharacters.map((character) => ({ ...character })),
        }
      },

      importSnapshot: (payload): ImportResult => {
        const snapshot = parseImportedSnapshot(payload)

        if (!snapshot) {
          return {
            ok: false,
            error: 'Invalid JSON format.',
          }
        }

        set((state) => {
          state.combatants = snapshot.combatants
          state.currentTurnId = snapshot.currentTurnId
          state.round = snapshot.round
          state.playerCharacters = snapshot.playerCharacters
          state.monsterCharacters = snapshot.monsterCharacters
        })

        return { ok: true }
      },
    })),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        combatants: state.combatants,
        currentTurnId: state.currentTurnId,
        round: state.round,
        playerCharacters: state.playerCharacters,
        monsterCharacters: state.monsterCharacters,
      }),
    },
  ),
)
