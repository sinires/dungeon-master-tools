import { LabeledField } from '@shared/ui/LabeledField'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Col, Flex, Input, InputNumber, Row, Space } from 'antd'
import { ESpacer } from '@shared/constants/sizes.ts'
import type { CharacterTemplateExpandedContentProps } from './types'

export const CharacterTemplateExpandedContent = ({
  template,
  isMonster,
  onUpdate,
}: CharacterTemplateExpandedContentProps) => {
  const attackFields = template.attacks.length > 0 ? template.attacks : []

  const updateAttack = (index: number, patch: Partial<(typeof attackFields)[number]>) => {
    const nextAttacks = [...attackFields]
    nextAttacks[index] = {
      ...nextAttacks[index],
      ...patch,
    }
    onUpdate({ attacks: nextAttacks })
  }

  const addAttack = () => {
    onUpdate({
      attacks: [...attackFields, { name: '', modifier: null, damageType: '', damageDice: '' }],
    })
  }

  const removeAttack = (index: number) => {
    onUpdate({ attacks: attackFields.filter((_, attackIndex) => attackIndex !== index) })
  }

  return (
    <Row gutter={[ESpacer.SPACER3, ESpacer.SPACER3]}>
      <Col hidden={!isMonster} span={24}>
        <Space>
          <LabeledField label="XP">
            <InputNumber
              size="small"
              value={template.xp}
              min={0}
              step={1}
              placeholder="50"
              onChange={(nextValue) =>
                onUpdate({
                  xp: nextValue === null ? null : Number(nextValue),
                })
              }
            />
          </LabeledField>
          <LabeledField label="CR">
            <Input
              size="small"
              value={template.cr}
              placeholder="1/4"
              onChange={(event) =>
                onUpdate({
                  cr: event.target.value,
                })
              }
            />
          </LabeledField>
        </Space>
      </Col>
      <Col hidden={!isMonster} span={24}>
        <LabeledField label="Speed">
          <Flex gap={ESpacer.SPACER2} wrap>
            <InputNumber
              size="small"
              value={template.speeds.walk}
              min={0}
              step={5}
              addonAfter="ft."
              onChange={(nextValue) =>
                onUpdate({ speeds: { ...template.speeds, walk: Number(nextValue ?? 0) } })
              }
            />
            <InputNumber
              size="small"
              value={template.speeds.fly}
              min={0}
              step={5}
              addonAfter="ft."
              onChange={(nextValue) =>
                onUpdate({ speeds: { ...template.speeds, fly: Number(nextValue ?? 0) } })
              }
            />
            <InputNumber
              size="small"
              value={template.speeds.swim}
              min={0}
              step={5}
              addonAfter="ft."
              onChange={(nextValue) =>
                onUpdate({ speeds: { ...template.speeds, swim: Number(nextValue ?? 0) } })
              }
            />
          </Flex>
        </LabeledField>
      </Col>
      <Col hidden={!isMonster} span={24}>
        <LabeledField label="Attacks">
          <Flex vertical gap={ESpacer.SPACER2}>
            {attackFields.map((attack, index) => (
              <Flex key={index} gap={ESpacer.SPACER2} wrap>
                <Input
                  size="small"
                  value={attack.name}
                  placeholder="Bite"
                  onChange={(event) => updateAttack(index, { name: event.target.value })}
                />
                <InputNumber
                  size="small"
                  value={attack.modifier}
                  min={-20}
                  max={30}
                  step={1}
                  placeholder="+4"
                  onChange={(nextValue) =>
                    updateAttack(index, {
                      modifier: nextValue === null ? null : Number(nextValue),
                    })
                  }
                />
                <Input
                  size="small"
                  value={attack.damageType}
                  placeholder="piercing"
                  onChange={(event) => updateAttack(index, { damageType: event.target.value })}
                />
                <Input
                  size="small"
                  value={attack.damageDice}
                  placeholder="1d6+2"
                  onChange={(event) => updateAttack(index, { damageDice: event.target.value })}
                />
                <Button
                  aria-label="Remove attack"
                  icon={<DeleteOutlined />}
                  size="small"
                  onClick={() => removeAttack(index)}
                />
              </Flex>
            ))}
            <Button icon={<PlusOutlined />} size="small" onClick={addAttack}>
              Add attack
            </Button>
          </Flex>
        </LabeledField>
      </Col>
      <Col span={24}>
        <LabeledField label="Additional info">
          <Input.TextArea
            size="small"
            value={template.notes}
            autoSize={{ minRows: 2, maxRows: 6 }}
            placeholder="Any notes, tactics, reminders..."
            onChange={(event) =>
              onUpdate({
                notes: event.target.value,
              })
            }
          />
        </LabeledField>
      </Col>
    </Row>
  )
}
