interface DicePart {
  sign: 1 | -1
  value: number
}

interface DiceRollResult {
  total: number
}

const TOKEN_PATTERN = /[+-][^+-]+/g
const DICE_PATTERN = /^(\d*)d(\d+)$/i
const FLAT_PATTERN = /^\d+$/

const rollDie = (sides: number): number => {
  if (!Number.isInteger(sides) || sides < 2) {
    throw new Error('Invalid die size.')
  }

  return Math.floor(Math.random() * sides) + 1
}

const parseToken = (token: string): DicePart => {
  const sign = token.startsWith('-') ? -1 : 1
  const raw = token.slice(1)

  const diceMatch = raw.match(DICE_PATTERN)

  if (diceMatch) {
    const [, countRaw, sidesRaw] = diceMatch
    const count = countRaw ? Number(countRaw) : 1
    const sides = Number(sidesRaw)

    if (!Number.isInteger(count) || count < 1 || count > 200) {
      throw new Error('Invalid dice count.')
    }

    const rollsTotal = Array.from({ length: count }, () => rollDie(sides)).reduce(
      (acc, value) => acc + value,
      0,
    )

    return {
      sign,
      value: rollsTotal,
    }
  }

  if (FLAT_PATTERN.test(raw)) {
    return {
      sign,
      value: Number(raw),
    }
  }

  throw new Error(`Unsupported token: ${token}`)
}

export const rollDiceExpression = (expression: string): DiceRollResult => {
  const compact = expression.replace(/\s+/g, '')

  if (!compact) {
    throw new Error('Expression is empty.')
  }

  const normalized = /^[+-]/.test(compact) ? compact : `+${compact}`
  const tokens = normalized.match(TOKEN_PATTERN)

  if (!tokens) {
    throw new Error('Invalid dice expression.')
  }

  const total = tokens.map(parseToken).reduce((acc, part) => acc + part.sign * part.value, 0)

  return { total }
}
