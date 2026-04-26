import type {
  CharacterAttack,
  CharacterTemplate,
  Combatant,
  CombatantType,
  CurrentTurnDetail,
  MovementSpeeds,
  TrackerSnapshot,
} from './types'
import {
  DEFAULT_AC,
  DEFAULT_CR,
  DEFAULT_HP,
  DEFAULT_NOTES,
  DEFAULT_SPEEDS,
  DEFAULT_TEMPLATE_AC,
  DEFAULT_TEMPLATE_HP,
  TRAILING_INDEX_PATTERN,
} from '@entities/tracker/constants.ts'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const toFiniteNumber = (value: unknown, fallback: number): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback

const toFiniteNumberFromUnknown = (value: unknown, fallback: number): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value.replace(',', '.'))

    return Number.isFinite(parsed) ? parsed : fallback
  }

  return fallback
}

const toNormalizedSpeed = (value: unknown): number =>
  Math.max(0, Math.floor(toFiniteNumberFromUnknown(value, 0)))

const toNullableFiniteNumber = (value: unknown): number | null =>
  typeof value === 'number' && Number.isFinite(value) ? value : null

const toNormalizedText = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value.trim() : fallback

const toNormalizedSpeeds = (value: unknown): MovementSpeeds => {
  if (isRecord(value)) {
    return {
      walk: toNormalizedSpeed(value.walk),
      fly: toNormalizedSpeed(value.fly),
      swim: toNormalizedSpeed(value.swim),
    }
  }

  if (Array.isArray(value)) {
    const [walk, fly, swim] = value

    return {
      walk: toNormalizedSpeed(walk),
      fly: toNormalizedSpeed(fly),
      swim: toNormalizedSpeed(swim),
    }
  }

  return { ...DEFAULT_SPEEDS }
}

const hasSpeed = (speeds: MovementSpeeds): boolean =>
  speeds.walk > 0 || speeds.fly > 0 || speeds.swim > 0

const toNormalizedXp = (value: unknown): number | null => {
  const normalized = toNullableFiniteNumber(value)

  return normalized === null ? null : Math.max(0, Math.floor(normalized))
}

const toNormalizedAttackModifier = (value: unknown): number | null => {
  const normalized = toNullableFiniteNumber(value)

  return normalized === null ? null : Math.trunc(normalized)
}

const toNormalizedAttacks = (
  value: unknown,
  legacyModifier?: unknown,
  legacyDamageDice?: unknown,
): CharacterAttack[] => {
  const attacks: CharacterAttack[] = []

  if (Array.isArray(value)) {
    value.forEach((rawAttack, index) => {
      if (!isRecord(rawAttack)) {
        return
      }

      const name = toNormalizedText(rawAttack.name)
      const attack = {
        name,
        modifier: toNormalizedAttackModifier(rawAttack.modifier),
        damageType: toNormalizedText(rawAttack.damageType),
        damageDice: toNormalizedText(rawAttack.damageDice),
      }

      if (
        attack.name.length > 0 ||
        attack.modifier !== null ||
        attack.damageType.length > 0 ||
        attack.damageDice.length > 0
      ) {
        attacks.push({
          ...attack,
          name: attack.name || `Attack ${index + 1}`,
        })
      }
    })
  }

  if (attacks.length > 0) {
    return attacks
  }

  const modifier = toNormalizedAttackModifier(legacyModifier)
  const damageDice = toNormalizedText(legacyDamageDice)

  if (modifier === null && damageDice.length === 0) {
    return []
  }

  return [
    {
      name: 'Attack',
      modifier,
      damageType: '',
      damageDice,
    },
  ]
}

export const isCombatantType = (value: unknown): value is CombatantType =>
  value === 'player' || value === 'monster'

export const getInitiativeFromModifier = (initiativeModifier: number): number => initiativeModifier

export const getRolledInitiative = (roll: number, initiativeModifier: number): number =>
  roll + initiativeModifier

export const shouldHidePlayerStats = (combatant: Combatant): boolean =>
  combatant.type === 'player' && combatant.hp === 0 && combatant.ac === 0

export const formatSignedModifier = (value: number): string =>
  value >= 0 ? `+${value}` : `${value}`
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

const sortCharacterTemplates = (templates: CharacterTemplate[]) => {
  templates.sort((first, second) => first.name.localeCompare(second.name, 'en'))
}

const normalizeCharacterTemplate = (template: CharacterTemplate): CharacterTemplate => ({
  ...template,
  name: template.name.trim(),
  initiativeModifier: toFiniteNumber(template.initiativeModifier, 0),
  hp: Math.max(0, Math.floor(toFiniteNumber(template.hp, DEFAULT_TEMPLATE_HP))),
  ac: Math.max(0, Math.floor(toFiniteNumber(template.ac, DEFAULT_TEMPLATE_AC))),
  notes: toNormalizedText(template.notes, DEFAULT_NOTES),
  cr: toNormalizedText(template.cr, DEFAULT_CR),
  xp: toNormalizedXp(template.xp),
  speeds: toNormalizedSpeeds(template.speeds),
  attacks: toNormalizedAttacks(template.attacks),
})

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
      notes: toNormalizedText(combatant.notes, DEFAULT_NOTES),
      cr: toNormalizedText(combatant.cr, DEFAULT_CR),
      xp: toNormalizedXp(combatant.xp),
      speeds: toNormalizedSpeeds(combatant.speeds),
      attacks: toNormalizedAttacks(combatant.attacks),
    }))
    .filter((combatant) => combatant.name.length > 0)

  const playerCharacters = snapshot.playerCharacters
    .map(normalizeCharacterTemplate)
    .filter((character) => character.name.length > 0)
  const monsterCharacters = snapshot.monsterCharacters
    .map(normalizeCharacterTemplate)
    .filter((character) => character.name.length > 0)

  sortCharacterTemplates(playerCharacters)
  sortCharacterTemplates(monsterCharacters)
  sortCombatants(combatants)

  const round =
    combatants.length === 0 ? 0 : Math.max(1, Math.floor(toFiniteNumber(snapshot.round, 1)))

  return {
    combatants,
    currentTurnId: getValidCurrentTurnId(combatants, snapshot.currentTurnId),
    round,
    playerCharacters,
    monsterCharacters,
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
  const rawPlayerCharacters = payload.playerCharacters
  const rawMonsterCharacters = payload.monsterCharacters

  if (currentTurnId !== null && currentTurnId !== undefined && typeof currentTurnId !== 'string') {
    return null
  }
  if (round !== null && round !== undefined && typeof round !== 'number') {
    return null
  }
  if (rawPlayerCharacters !== undefined && !Array.isArray(rawPlayerCharacters)) {
    return null
  }
  if (rawMonsterCharacters !== undefined && !Array.isArray(rawMonsterCharacters)) {
    return null
  }

  const combatants: Combatant[] = []

  for (const rawCombatant of payload.combatants) {
    if (!isRecord(rawCombatant)) {
      return null
    }

    const {
      id,
      name,
      initiative,
      initiativeModifier,
      hp,
      ac,
      type,
      notes,
      cr,
      xp,
      speeds,
      attacks,
      attackModifier,
      damageDice,
    } = rawCombatant

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
      notes: toNormalizedText(notes, DEFAULT_NOTES),
      cr: toNormalizedText(cr, DEFAULT_CR),
      xp: toNormalizedXp(xp),
      speeds: toNormalizedSpeeds(speeds),
      attacks: toNormalizedAttacks(attacks, attackModifier, damageDice),
    })
  }

  const parseCharacterTemplates = (rawTemplates: unknown): CharacterTemplate[] | null => {
    if (rawTemplates === undefined) {
      return []
    }

    if (!Array.isArray(rawTemplates)) {
      return null
    }

    const templates: CharacterTemplate[] = []

    for (const rawTemplate of rawTemplates) {
      if (!isRecord(rawTemplate)) {
        return null
      }

      const {
        id,
        name,
        initiativeModifier,
        hp,
        ac,
        notes,
        cr,
        xp,
        speeds,
        attacks,
        attackModifier,
        damageDice,
      } = rawTemplate

      if (typeof id !== 'string' || typeof name !== 'string') {
        return null
      }

      templates.push({
        id,
        name,
        initiativeModifier: toFiniteNumber(initiativeModifier, 0),
        hp: Math.max(0, Math.floor(toFiniteNumber(hp, DEFAULT_TEMPLATE_HP))),
        ac: Math.max(0, Math.floor(toFiniteNumber(ac, DEFAULT_TEMPLATE_AC))),
        notes: toNormalizedText(notes, DEFAULT_NOTES),
        cr: toNormalizedText(cr, DEFAULT_CR),
        xp: toNormalizedXp(xp),
        speeds: toNormalizedSpeeds(speeds),
        attacks: toNormalizedAttacks(attacks, attackModifier, damageDice),
      })
    }

    return templates
  }

  const playerCharacters = parseCharacterTemplates(rawPlayerCharacters)
  if (!playerCharacters) {
    return null
  }

  const monsterCharacters = parseCharacterTemplates(rawMonsterCharacters)
  if (!monsterCharacters) {
    return null
  }

  return normalizeSnapshot({
    combatants,
    currentTurnId: typeof currentTurnId === 'string' ? currentTurnId : null,
    round: typeof round === 'number' && Number.isFinite(round) ? round : 1,
    playerCharacters,
    monsterCharacters,
  })
}

export const hasAdditionalCombatantInfo = (combatant: Combatant): boolean => {
  if (combatant.notes.length > 0) {
    return true
  }

  if (combatant.type !== 'monster') {
    return false
  }

  return (
    combatant.cr.length > 0 ||
    combatant.xp != null ||
    hasSpeed(combatant.speeds) ||
    combatant.attacks.length > 0
  )
}

export const toTemplateOption = (template: CharacterTemplate) => ({
  value: template.name,
  label: `${template.name} (IM: ${template.initiativeModifier}, HP: ${template.hp}, AC: ${template.ac})`,
})

export const getCurrentTurnDetails = (currentTurn: Combatant): CurrentTurnDetail[] => {
  const details: CurrentTurnDetail[] = [
    {
      key: 'initiative',
      label: 'Initiative',
      value: currentTurn.initiative,
    },
  ]

  if (!shouldHidePlayerStats(currentTurn)) {
    details.push(
      {
        key: 'hp',
        label: 'HP',
        value: currentTurn.hp,
      },
      {
        key: 'ac',
        label: 'AC',
        value: currentTurn.ac,
      },
    )

    currentTurn.attacks.forEach((attack, index) => {
      details.push({
        key: `attack-${index}`,
        label: attack.name || `Attack ${index + 1}`,
        value: attack.modifier == null ? '-' : formatSignedModifier(attack.modifier),
      })
    })
  }

  return details
}
