import type { Combatant, CombatantType, TrackerSnapshot } from './types'

const DEFAULT_HP = 1
const DEFAULT_AC = 10
const TRAILING_INDEX_PATTERN = /^(.*?)(?:\s+(\d+))?$/

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const toFiniteNumber = (value: unknown, fallback: number): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback

export const isCombatantType = (value: unknown): value is CombatantType =>
  value === 'player' || value === 'monster'

export const getInitiativeFromModifier = (initiativeModifier: number): number => initiativeModifier

export const getRolledInitiative = (roll: number, initiativeModifier: number): number =>
  roll + initiativeModifier

export const shouldHidePlayerStats = (combatant: Combatant): boolean =>
  combatant.type === 'player' && combatant.hp === 0 && combatant.ac === 0

const getNameParts = (rawName: string): { baseName: string; index: number | null } => {
  const normalizedName = rawName.trim()
  const matched = normalizedName.match(TRAILING_INDEX_PATTERN)

  if (!matched) {
    return {
      baseName: normalizedName,
      index: null,
    }
  }

  const [, baseRaw, indexRaw] = matched
  const baseName = baseRaw.trim()

  if (!indexRaw) {
    return {
      baseName,
      index: null,
    }
  }

  const index = Number(indexRaw)

  return {
    baseName,
    index: Number.isFinite(index) ? index : null,
  }
}

export const getIndexedCombatantName = (combatants: Combatant[], rawName: string): string => {
  const { baseName } = getNameParts(rawName)
  const normalizedBase = baseName.toLocaleLowerCase()

  let maxIndex = 0

  for (const combatant of combatants) {
    if (combatant.type === 'player') {
      continue
    }

    const existing = getNameParts(combatant.name)

    if (existing.baseName.toLocaleLowerCase() !== normalizedBase) {
      continue
    }

    const existingIndex = existing.index ?? 1
    if (existingIndex > maxIndex) {
      maxIndex = existingIndex
    }
  }

  return `${baseName} ${maxIndex + 1}`
}

export const sortCombatants = (combatants: Combatant[]) => {
  combatants.sort((first, second) => {
    if (second.initiative !== first.initiative) {
      return second.initiative - first.initiative
    }

    if (second.initiativeModifier !== first.initiativeModifier) {
      return second.initiativeModifier - first.initiativeModifier
    }

    return first.name.localeCompare(second.name, 'en')
  })
}

export const getValidCurrentTurnId = (
  combatants: Combatant[],
  currentTurnId: string | null,
): string | null =>
  currentTurnId && combatants.some((combatant) => combatant.id === currentTurnId)
    ? currentTurnId
    : (combatants[0]?.id ?? null)

export const normalizeSnapshot = (snapshot: TrackerSnapshot): TrackerSnapshot => {
  const combatants = snapshot.combatants
    .map((combatant) => ({
      ...combatant,
      name: combatant.name.trim(),
      initiativeModifier: toFiniteNumber(combatant.initiativeModifier, 0),
      initiative: toFiniteNumber(
        combatant.initiative,
        getInitiativeFromModifier(toFiniteNumber(combatant.initiativeModifier, 0)),
      ),
      hp: Math.max(0, Math.floor(toFiniteNumber(combatant.hp, DEFAULT_HP))),
      ac: Math.max(0, Math.floor(toFiniteNumber(combatant.ac, DEFAULT_AC))),
    }))
    .filter((combatant) => combatant.name.length > 0)

  sortCombatants(combatants)

  const round =
    combatants.length === 0 ? 0 : Math.max(1, Math.floor(toFiniteNumber(snapshot.round, 1)))

  return {
    combatants,
    currentTurnId: getValidCurrentTurnId(combatants, snapshot.currentTurnId),
    round,
  }
}

export const getNextTurnId = (
  combatants: Combatant[],
  currentTurnId: string | null,
): string | null => {
  if (combatants.length === 0) {
    return null
  }

  if (!currentTurnId) {
    return combatants[0].id
  }

  const currentIndex = combatants.findIndex((combatant) => combatant.id === currentTurnId)

  if (currentIndex === -1) {
    return combatants[0].id
  }

  return combatants[(currentIndex + 1) % combatants.length].id
}

export const parseImportedSnapshot = (payload: unknown): TrackerSnapshot | null => {
  if (!isRecord(payload) || !Array.isArray(payload.combatants)) {
    return null
  }

  const currentTurnId = payload.currentTurnId
  const round = payload.round

  if (currentTurnId !== null && currentTurnId !== undefined && typeof currentTurnId !== 'string') {
    return null
  }
  if (round !== null && round !== undefined && typeof round !== 'number') {
    return null
  }

  const combatants: Combatant[] = []

  for (const rawCombatant of payload.combatants) {
    if (!isRecord(rawCombatant)) {
      return null
    }

    const { id, name, initiative, initiativeModifier, hp, ac, type } = rawCombatant

    if (typeof id !== 'string' || typeof name !== 'string' || !isCombatantType(type)) {
      return null
    }

    const normalizedModifier = toFiniteNumber(initiativeModifier, toFiniteNumber(initiative, 0))

    combatants.push({
      id,
      name,
      initiativeModifier: normalizedModifier,
      initiative: toFiniteNumber(initiative, getInitiativeFromModifier(normalizedModifier)),
      hp: Math.max(0, Math.floor(toFiniteNumber(hp, DEFAULT_HP))),
      ac: Math.max(0, Math.floor(toFiniteNumber(ac, DEFAULT_AC))),
      type,
    })
  }

  return normalizeSnapshot({
    combatants,
    currentTurnId: typeof currentTurnId === 'string' ? currentTurnId : null,
    round: typeof round === 'number' && Number.isFinite(round) ? round : 1,
  })
}
