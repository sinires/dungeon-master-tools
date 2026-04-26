import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import type { CharacterTemplate } from '@entities/tracker'
import { useTrackerStore } from '@entities/tracker'
import { ESpacer } from '@shared/constants/sizes.ts'
import { Button, Card, Flex, Form, Input, InputNumber, Table, Typography } from 'antd'
import type { TableColumnsType } from 'antd'
import { useState } from 'react'
import {
  CharacterTemplateCreateDrawer,
  CharacterTemplateExpandedContent,
  type CharacterTemplateFormValues,
  type CharacterTemplatesPageProps,
  DEFAULT_TEMPLATE_FORM_VALUES_BY_TYPE,
} from '@entities/charter'

const { Title, Paragraph } = Typography

export const CharacterTemplatesPage = ({
  characterType,
  title,
  description,
  emptyText,
  namePlaceholder,
}: CharacterTemplatesPageProps) => {
  const templates = useTrackerStore((state) =>
    characterType === 'player' ? state.playerCharacters : state.monsterCharacters,
  )
  const addCharacterTemplate = useTrackerStore((state) => state.addCharacterTemplate)
  const updateCharacterTemplate = useTrackerStore((state) => state.updateCharacterTemplate)
  const removeCharacterTemplate = useTrackerStore((state) => state.removeCharacterTemplate)
  const [form] = Form.useForm<CharacterTemplateFormValues>()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const defaults = DEFAULT_TEMPLATE_FORM_VALUES_BY_TYPE[characterType]
  const isMonster = characterType === 'monster'

  const openCreateDrawer = () => {
    form.setFieldsValue({
      name: '',
      initiativeModifier: defaults.initiativeModifier,
      hp: defaults.hp,
      ac: defaults.ac,
      notes: defaults.notes,
      cr: defaults.cr,
      xp: defaults.xp,
      speeds: defaults.speeds,
      attacks: defaults.attacks,
    })
    setIsDrawerOpen(true)
  }

  const closeCreateDrawer = () => {
    setIsDrawerOpen(false)
  }

  const handleAddTemplate = (values: CharacterTemplateFormValues) => {
    const name = values.name?.trim()

    if (!name) {
      return
    }

    addCharacterTemplate(characterType, {
      name,
      initiativeModifier: Number(values.initiativeModifier ?? defaults.initiativeModifier),
      hp: Number(values.hp ?? defaults.hp),
      ac: Number(values.ac ?? defaults.ac),
      notes: values.notes ?? defaults.notes,
      cr: values.cr ?? defaults.cr,
      xp: values.xp ?? defaults.xp,
      speeds: values.speeds ?? defaults.speeds,
      attacks: values.attacks ?? defaults.attacks,
    })

    closeCreateDrawer()
    form.resetFields()
  }

  const columns: TableColumnsType<CharacterTemplate> = [
    {
      title: '#',
      key: 'position',
      width: 56,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      render: (value: string, record) => (
        <Input
          size="small"
          value={value}
          onChange={(event) =>
            updateCharacterTemplate(characterType, record.id, {
              name: event.target.value,
            })
          }
        />
      ),
    },
    {
      title: 'Initiative mod',
      dataIndex: 'initiativeModifier',
      width: 148,
      render: (value: number, record) => (
        <InputNumber
          size="small"
          value={value}
          step={1}
          min={-10}
          max={20}
          style={{ width: '100%' }}
          onChange={(nextValue) =>
            updateCharacterTemplate(characterType, record.id, {
              initiativeModifier: Number(nextValue ?? 0),
            })
          }
        />
      ),
    },
    {
      title: 'HP',
      dataIndex: 'hp',
      width: 120,
      render: (value: number, record) => (
        <InputNumber
          size="small"
          value={value}
          min={0}
          step={1}
          style={{ width: '100%' }}
          onChange={(nextValue) =>
            updateCharacterTemplate(characterType, record.id, {
              hp: Number(nextValue ?? 0),
            })
          }
        />
      ),
    },
    {
      title: 'AC',
      dataIndex: 'ac',
      width: 120,
      render: (value: number, record) => (
        <InputNumber
          size="small"
          value={value}
          min={0}
          max={99}
          step={1}
          style={{ width: '100%' }}
          onChange={(nextValue) =>
            updateCharacterTemplate(characterType, record.id, {
              ac: Number(nextValue ?? 0),
            })
          }
        />
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 60,
      render: (_, record) => (
        <Button
          icon={<DeleteOutlined />}
          danger
          size="small"
          onClick={() => removeCharacterTemplate(characterType, record.id)}
        />
      ),
    },
  ]

  return (
    <Card>
      <Flex vertical gap={ESpacer.SPACER3}>
        <Flex justify="space-between" align="start" gap={ESpacer.SPACER3}>
          <div>
            <Title level={2}>{title}</Title>
            <Paragraph type="secondary">{description}</Paragraph>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateDrawer}>
            Add Template
          </Button>
        </Flex>
        <Table<CharacterTemplate>
          rowKey="id"
          size="small"
          pagination={false}
          columns={columns}
          dataSource={templates}
          expandable={{
            expandedRowRender: (record) => (
              <CharacterTemplateExpandedContent
                template={record}
                isMonster={isMonster}
                onUpdate={(patch) => updateCharacterTemplate(characterType, record.id, patch)}
              />
            ),
          }}
          locale={{ emptyText }}
        />
        <CharacterTemplateCreateDrawer
          isMonster={isMonster}
          isOpen={isDrawerOpen}
          namePlaceholder={namePlaceholder}
          form={form}
          defaults={defaults}
          onClose={closeCreateDrawer}
          onSubmit={handleAddTemplate}
        />
      </Flex>
    </Card>
  )
}
