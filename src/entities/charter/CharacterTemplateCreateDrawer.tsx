import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Col, Drawer, Flex, Form, Input, InputNumber, Row } from 'antd'
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
      width={480}
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
            <Form.Item label="XP" name="xp">
              <InputNumber step={1} min={0} />
            </Form.Item>
            <Row gutter={ESpacer.SPACER3}>
              <Col xs={8}>
                <Form.Item label="Walk speed" name={['speeds', 'walk']}>
                  <InputNumber min={0} step={5} addonAfter="ft." />
                </Form.Item>
              </Col>
              <Col xs={8}>
                <Form.Item label="Fly speed" name={['speeds', 'fly']}>
                  <InputNumber min={0} step={5} addonAfter="ft." />
                </Form.Item>
              </Col>
              <Col xs={8}>
                <Form.Item label="Swim speed" name={['speeds', 'swim']}>
                  <InputNumber min={0} step={5} addonAfter="ft." />
                </Form.Item>
              </Col>
            </Row>
            <Form.List name="attacks">
              {(fields, { add, remove }) => (
                <Form.Item label="Attacks list">
                  <Flex vertical gap={ESpacer.SPACER3}>
                    {fields.map((field) => (
                      <Flex key={field.key} vertical gap={ESpacer.SPACER2}>
                        <Flex align="center" justify="space-between">
                          <strong>{`Attack ${field.name + 1}`}</strong>
                          <Button
                            aria-label="Remove attack"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => remove(field.name)}
                          />
                        </Flex>
                        <Row gutter={ESpacer.SPACER3}>
                          <Col xs={24}>
                            <Form.Item label="Name" name={[field.name, 'name']}>
                              <Input placeholder="Bite" />
                            </Form.Item>
                          </Col>
                          <Col xs={8}>
                            <Form.Item label="Hit modifier" name={[field.name, 'modifier']}>
                              <InputNumber min={-20} max={30} step={1} placeholder="+4" />
                            </Form.Item>
                          </Col>
                          <Col xs={8}>
                            <Form.Item label="Damage type" name={[field.name, 'damageType']}>
                              <Input placeholder="piercing" />
                            </Form.Item>
                          </Col>
                          <Col xs={8}>
                            <Form.Item label="Damage formula" name={[field.name, 'damageDice']}>
                              <Input placeholder="1d6+2" />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Flex>
                    ))}
                    <Button
                      icon={<PlusOutlined />}
                      onClick={() =>
                        add({ name: '', modifier: null, damageType: '', damageDice: '' })
                      }
                    >
                      Add attack
                    </Button>
                  </Flex>
                </Form.Item>
              )}
            </Form.List>
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
