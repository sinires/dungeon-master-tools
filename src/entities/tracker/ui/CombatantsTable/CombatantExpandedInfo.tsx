import { Col, Row, Space } from 'antd'
import { formatSignedModifier } from '../../utils'
import type { CombatantExpandedInfoProps } from '@entities/tracker/ui/CombatantsTable/types.ts'
import type { DetailRow } from '@entities/tracker/types.ts'

export const CombatantExpandedInfo = ({ combatant }: CombatantExpandedInfoProps) => {
  const details: DetailRow[] = []

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
    if (combatant.attackModifier != null) {
      details.push({
        key: 'attackModifier',
        label: 'Attack mod',
        value: formatSignedModifier(combatant.attackModifier),
      })
    }
    if (combatant.damageDice.length > 0) {
      details.push({
        key: 'damageDice',
        label: 'Damage dice',
        value: combatant.damageDice,
      })
    }
  }

  return (
    <Row>
      <Col span={24}>
        <Space>
          {details.map((detail) => (
            <p key={detail.key}>
              <strong>{detail.label}:</strong> {detail.value}
            </p>
          ))}
        </Space>
      </Col>
      <Col hidden={!combatant.notes.length} span={24}>
        <p>
          <strong>Info:</strong> {combatant.notes}
        </p>
      </Col>
    </Row>
  )
}
