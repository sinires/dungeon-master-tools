import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { rollDiceExpression } from '@shared/utils/dice'
import { createId } from '@shared/utils/id'
import type { ImportResult, TrackerState } from './types'
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

export const useTrackerStore = create<TrackerState>()(
  persist(
    immer((set, get) => ({
      combatants: [],
      currentTurnId: null,
      round: 0,

      addCombatant: (payload) =>
        set((state) => {
          const name = payload.name.trim()

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
        const { combatants, currentTurnId, round } = get()

        return {
          combatants: combatants.map((combatant) => ({ ...combatant })),
          currentTurnId,
          round,
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
      }),
    },
  ),
)
