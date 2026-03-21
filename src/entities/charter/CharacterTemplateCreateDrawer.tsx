import { Button, Drawer, Flex, Form, Input, InputNumber } from 'antd'
import { ESpacer } from '@shared/constants/sizes.ts'
import type { CharacterTemplateCreateDrawerProps, CharacterTemplateFormValues } from './types'

export const CharacterTemplateCreateDrawer = ({
  isMonster,
  isOpen,
  namePlaceholder,
  form,
  defaults,
  onClose,
  onSubmit,
}: CharacterTemplateCreateDrawerProps) => {
  return (
    <Drawer
      title={isMonster ? 'Add monster' : 'Add player'}
      open={isOpen}
      onClose={onClose}
      extra={
        <Flex justify="end" gap={ESpacer.SPACER2}>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={form.submit} type="primary">
            Add
          </Button>
        </Flex>
      }
    >
      <Form<CharacterTemplateFormValues>
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        initialValues={{
          name: '',
          ...defaults,
        }}
      >
        <Form.Item label="Name" name="name" rules={[{ required: true, whitespace: true }]}>
          <Input placeholder={namePlaceholder} />
        </Form.Item>
        <Flex gap={ESpacer.SPACER3} wrap={false}>
          <Form.Item label="Initiative mod" name="initiativeModifier">
            <InputNumber step={1} min={-10} max={20} />
          </Form.Item>
          <Form.Item label="HP" name="hp">
            <InputNumber step={1} min={0} />
          </Form.Item>
          <Form.Item label="AC" name="ac">
            <InputNumber step={1} min={0} max={99} />
          </Form.Item>
        </Flex>
        {isMonster && (
          <>
            <Form.Item label="CR" name="cr">
              <Input placeholder="1/4" />
            </Form.Item>
            <Flex gap={ESpacer.SPACER3} wrap={false}>
              <Form.Item label="XP" name="xp">
                <InputNumber step={1} min={0} />
              </Form.Item>
              <Form.Item label="Attack mod" name="attackModifier">
                <InputNumber step={1} min={-20} max={30} />
              </Form.Item>
            </Flex>
            <Form.Item label="Damage dice" name="damageDice">
              <Input placeholder="1d6+2" />
            </Form.Item>
          </>
        )}
        <Form.Item label="Additional info" name="notes">
          <Input.TextArea
            autoSize={{ minRows: 2, maxRows: 6 }}
            placeholder="Any notes, tactics, reminders..."
          />
        </Form.Item>
      </Form>
    </Drawer>
  )
}
