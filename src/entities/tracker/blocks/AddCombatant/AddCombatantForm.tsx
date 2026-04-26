import { AutoComplete, Button, Flex, Form, InputNumber, Segmented } from 'antd'
import type { CombatantType } from '@entities/tracker'
import { useTrackerStore } from '@entities/tracker'

import {
  DEFAULT_COMBATANT_FORM_VALUES_BY_TYPE,
  EMPTY_TEMPLATE_DETAILS,
} from '@entities/tracker/constants'
import styles from './styles.module.scss'
import type { AddCombatantFormValues } from '@entities/tracker/types.ts'
import { toTemplateOption } from '@entities/tracker/utils.ts'

export const AddCombatantForm = () => {
  const addCombatant = useTrackerStore((state) => state.addCombatant)
  const playerCharacters = useTrackerStore((state) => state.playerCharacters)
  const monsterCharacters = useTrackerStore((state) => state.monsterCharacters)
  const [form] = Form.useForm<AddCombatantFormValues>()

  const combatantType = Form.useWatch('type', form) ?? 'player'
  const nameValue = Form.useWatch('name', form) ?? ''

  const availableTemplates = combatantType === 'player' ? playerCharacters : monsterCharacters

  const resetForType = (type: CombatantType) => {
    form.setFieldsValue({
      name: '',
      ...DEFAULT_COMBATANT_FORM_VALUES_BY_TYPE[type],
    })
  }

  const handleTypeChange = (nextType: CombatantType) => {
    form.setFieldValue('type', nextType)
    resetForType(nextType)
  }

  const handleNameSelect = (name: string) => {
    const template = availableTemplates.find((item) => item.name === name)

    if (!template) {
      return
    }

    form.setFieldsValue({
      name: template.name,
      initiativeModifier: template.initiativeModifier,
      hp: template.hp,
      ac: template.ac,
    })
  }

  const handleAddCombatant = (values: AddCombatantFormValues) => {
    if (!values.name) {
      return
    }

    const matchedTemplate = availableTemplates.find((template) => template.name === values.name)
    const templateDetails = matchedTemplate ?? EMPTY_TEMPLATE_DETAILS

    addCombatant({
      name: values.name,
      initiativeModifier: Number(values.initiativeModifier ?? 0),
      hp: Number(values.hp ?? 0),
      ac: Number(values.ac ?? 0),
      type: values.type,
      notes: templateDetails.notes,
      cr: templateDetails.cr,
      xp: templateDetails.xp,
      speeds: { ...templateDetails.speeds },
      attacks: templateDetails?.attacks?.map((attack) => ({ ...attack })),
    })

    form.resetFields(['name'])
  }

  return (
    <Form<AddCombatantFormValues>
      form={form}
      layout="vertical"
      className={styles.form}
      onFinish={handleAddCombatant}
      initialValues={{
        type: 'player',
        name: '',
        ...DEFAULT_COMBATANT_FORM_VALUES_BY_TYPE.player,
      }}
    >
      <Flex gap={12} wrap className={styles.row}>
        <Form.Item label="Type" name="type" className={styles.fieldType}>
          <Segmented<CombatantType>
            options={[
              { label: 'Player', value: 'player' },
              { label: 'Monster', value: 'monster' },
            ]}
            onChange={handleTypeChange}
          />
        </Form.Item>
        <Form.Item
          label="Name"
          name="name"
          className={styles.fieldName}
          rules={[{ required: true, whitespace: true }]}
          validateTrigger="onSubmit"
        >
          <AutoComplete
            placeholder="Select existing or type new"
            options={availableTemplates.map(toTemplateOption)}
            optionFilterProp="label"
            showSearch
            filterOption={(input, option) =>
              (option?.label as string | undefined)
                ?.toLocaleLowerCase()
                .includes(input.toLocaleLowerCase()) ?? false
            }
            onSelect={handleNameSelect}
          />
        </Form.Item>
        <Form.Item label="IM" name="initiativeModifier" className={styles.fieldNumber}>
          <InputNumber step={1} min={-10} max={20} className={styles.numberInput} />
        </Form.Item>
        <Form.Item label="HP" name="hp" className={styles.fieldNumber}>
          <InputNumber step={1} min={0} className={styles.numberInput} />
        </Form.Item>
        <Form.Item label="AC" name="ac" className={styles.fieldNumber}>
          <InputNumber step={1} min={0} max={99} className={styles.numberInput} />
        </Form.Item>
        <Button type="primary" htmlType="submit" disabled={!nameValue.trim()}>
          Add
        </Button>
      </Flex>
    </Form>
  )
}
