import { LabeledField } from '@shared/ui/LabeledField'
import { Col, Input, InputNumber, Row, Space } from 'antd'
import { ESpacer } from '@shared/constants/sizes.ts'
import type { CharacterTemplateExpandedContentProps } from './types'

export const CharacterTemplateExpandedContent = ({
  template,
  isMonster,
  onUpdate,
}: CharacterTemplateExpandedContentProps) => {
  return (
    <Row gutter={[ESpacer.SPACER3, ESpacer.SPACER3]}>
      <Col hidden={!isMonster} span={24}>
        <Space>
          <LabeledField label="Attack mod">
            <InputNumber
              size="small"
              value={template.attackModifier}
              min={-20}
              max={30}
              step={1}
              placeholder="+4"
              onChange={(nextValue) =>
                onUpdate({
                  attackModifier: nextValue === null ? null : Number(nextValue),
                })
              }
            />
          </LabeledField>
          <LabeledField label="Damage dice">
            <Input
              size="small"
              value={template.damageDice}
              placeholder="1d6+2"
              onChange={(event) =>
                onUpdate({
                  damageDice: event.target.value,
                })
              }
            />
          </LabeledField>
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
