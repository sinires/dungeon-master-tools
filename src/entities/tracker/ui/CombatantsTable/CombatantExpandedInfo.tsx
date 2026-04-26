import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Col, Flex, Input, InputNumber, message, Row, Space } from 'antd'
import { rollDiceExpression } from '@shared/utils/dice.ts'
import { formatSignedModifier } from '../../utils'
import type { CombatantExpandedInfoProps } from '@entities/tracker/ui/CombatantsTable/types.ts'
import type { DetailRow } from '@entities/tracker/types.ts'
import styles from './styles.module.scss'
import { useTrackerStore } from '../../store.ts'

export const CombatantExpandedInfo = ({ combatant }: CombatantExpandedInfoProps) => {
  const updateCombatant = useTrackerStore((state) => state.updateCombatant)
  const details: DetailRow[] = []

  const speedDetails = [
    { label: 'Walk speed', value: combatant.speeds.walk },
    { label: 'Fly speed', value: combatant.speeds.fly },
    { label: 'Swim speed', value: combatant.speeds.swim },
  ].filter((detail) => detail.value > 0)

  const updateAttack = (index: number, patch: Partial<(typeof combatant.attacks)[number]>) => {
    const nextAttacks = combatant.attacks.map((attack, attackIndex) =>
      attackIndex === index ? { ...attack, ...patch } : attack,
    )

    updateCombatant(combatant.id, { attacks: nextAttacks })
  }

  const addAttack = () => {
    updateCombatant(combatant.id, {
      attacks: [
        ...combatant.attacks,
        {
          name: '',
          modifier: null,
          damageType: '',
          damageDice: '',
        },
      ],
    })
  }

  const removeAttack = (index: number) => {
    updateCombatant(combatant.id, {
      attacks: combatant.attacks.filter((_, attackIndex) => attackIndex !== index),
    })
  }

  const rollAttack = (index: number) => {
    const attack = combatant.attacks[index]
    const roll = rollDiceExpression('1d20').total
    const modifier = attack.modifier ?? 0
    const total = roll + modifier
    const attackName = attack.name || `Attack ${index + 1}`

    void message.info(
      `${combatant.name}: ${attackName} attack roll ${total} (${roll} ${formatSignedModifier(
        modifier,
      )})`,
    )
  }

  const rollDamage = (index: number) => {
    const attack = combatant.attacks[index]
    const attackName = attack.name || `Attack ${index + 1}`

    try {
      const damage = rollDiceExpression(attack.damageDice).total
      const damageType = attack.damageType ? ` ${attack.damageType}` : ''

      void message.info(
        `${combatant.name}: ${attackName} damage roll ${damage}${damageType} (${attack.damageDice})`,
      )
    } catch {
      void message.error('Set a valid damage formula first.')
    }
  }

  if (combatant.type === 'monster') {
    if (combatant.cr.length > 0) {
      details.push({
        key: 'cr',
        label: 'CR',
        value: combatant.cr,
      })
    }
    if (combatant.xp != null) {
      details.push({
        key: 'xp',
        label: 'XP',
        value: combatant.xp,
      })
    }
  }

  return (
    <Row gutter={[0, 8]}>
      <Col span={24}>
        <Space>
          {details.map((detail) => (
            <p key={detail.key}>
              <strong>{detail.label}:</strong> {detail.value}
            </p>
          ))}
        </Space>
      </Col>
      <Col hidden={speedDetails.length === 0} span={24}>
        <Space>
          {speedDetails.map((detail) => (
            <p key={detail.label}>
              <strong>{detail.label}:</strong> {detail.value} ft.
            </p>
          ))}
        </Space>
      </Col>
      <Col hidden={combatant.type !== 'monster'} span={24}>
        <Flex vertical gap={8}>
          <strong>Attacks:</strong>
          {combatant.attacks.map((attack, index) => (
            <Flex key={index} gap={8} wrap align="center">
              <Input
                size="small"
                value={attack.name}
                placeholder="Attack"
                className={styles.attackNameInput}
                onChange={(event) => updateAttack(index, { name: event.target.value })}
              />
              <InputNumber
                size="small"
                value={attack.modifier}
                min={-20}
                max={30}
                step={1}
                placeholder="+4"
                className={styles.attackModifierInput}
                onChange={(nextValue) =>
                  updateAttack(index, {
                    modifier: nextValue === null ? null : Number(nextValue),
                  })
                }
              />
              <Input
                size="small"
                value={attack.damageType}
                placeholder="Damage type"
                className={styles.attackTextInput}
                onChange={(event) => updateAttack(index, { damageType: event.target.value })}
              />
              <Input
                size="small"
                value={attack.damageDice}
                placeholder="Damage dice"
                className={styles.attackTextInput}
                onChange={(event) => updateAttack(index, { damageDice: event.target.value })}
              />
              <Button size="small" onClick={() => rollAttack(index)}>
                Roll hit
              </Button>
              <Button
                size="small"
                disabled={!attack.damageDice.trim()}
                onClick={() => rollDamage(index)}
              >
                Roll damage
              </Button>
              <Button
                aria-label="Remove attack"
                danger
                icon={<DeleteOutlined />}
                size="small"
                onClick={() => removeAttack(index)}
              />
            </Flex>
          ))}
          <Button icon={<PlusOutlined />} size="small" onClick={addAttack}>
            Add attack
          </Button>
          {combatant.attacks.length === 0 && (
            <p className={styles.emptyAttacksText}>No attacks added.</p>
          )}
        </Flex>
      </Col>
      <Col hidden={combatant.type !== 'monster' || combatant.attacks.length === 0} span={24}>
        <Flex vertical gap={4}>
          {combatant.attacks.map((attack, index) => (
            <p key={index} className={styles.attackSummary}>
              <strong>{attack.name || `Attack ${index + 1}`}:</strong>{' '}
              {attack.modifier == null
                ? 'hit mod -'
                : `hit ${formatSignedModifier(attack.modifier)}`}
              {attack.damageDice ? `, damage ${attack.damageDice}` : ''}
              {attack.damageType ? ` ${attack.damageType}` : ''}
            </p>
          ))}
        </Flex>
      </Col>
      <Col hidden={combatant.notes.length === 0} span={24}>
        <p className={styles.multilineText}>
          <strong>Info:</strong>
          <br />
          {combatant.notes}
        </p>
      </Col>
    </Row>
  )
}
