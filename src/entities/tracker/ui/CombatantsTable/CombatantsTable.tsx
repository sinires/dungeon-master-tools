import { Button, Input, InputNumber, Segmented, Table } from 'antd'
import type { TableColumnsType } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import styles from './CombatantsTable.module.scss'
import type { Combatant, CombatantType } from '../../types'
import { useTrackerStore } from '../../store'
import { shouldHidePlayerStats } from '../../utils'

export const CombatantsTable = () => {
  const combatants = useTrackerStore((state) => state.combatants)
  const currentTurnId = useTrackerStore((state) => state.currentTurnId)
  const updateCombatant = useTrackerStore((state) => state.updateCombatant)
  const removeCombatant = useTrackerStore((state) => state.removeCombatant)

  const columns: TableColumnsType<Combatant> = [
    {
      title: '#',
      key: 'position',
      width: 56,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      width: 140,
      render: (value: CombatantType, record) => (
        <Segmented<CombatantType>
          size="small"
          value={value}
          options={[
            { label: 'Player', value: 'player' },
            { label: 'Monster', value: 'monster' },
          ]}
          onChange={(nextType) => updateCombatant(record.id, { type: nextType })}
        />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      render: (value: string, record) => (
        <Input
          size="small"
          value={value}
          onChange={(event) => updateCombatant(record.id, { name: event.target.value })}
        />
      ),
    },
    {
      title: 'Initiative',
      dataIndex: 'initiative',
      width: 110,
      render: (value: number, record) => (
        <InputNumber
          size="small"
          value={value}
          step={0.01}
          style={{ width: '100%' }}
          onChange={(nextValue) => updateCombatant(record.id, { initiative: Number(nextValue ?? 0) })}
        />
      ),
    },
    {
      title: 'HP',
      dataIndex: 'hp',
      width: 100,
      render: (value: number, record) => {
        if (shouldHidePlayerStats(record)) {
          return null
        }

        return (
          <InputNumber
            size="small"
            value={value}
            min={0}
            step={1}
            style={{ width: '100%' }}
            onChange={(nextValue) => updateCombatant(record.id, { hp: Number(nextValue ?? 0) })}
          />
        )
      },
    },
    {
      title: 'AC',
      dataIndex: 'ac',
      width: 100,
      render: (value: number, record) => {
        if (shouldHidePlayerStats(record)) {
          return null
        }

        return (
          <InputNumber
            size="small"
            value={value}
            min={0}
            step={1}
            style={{ width: '100%' }}
            onChange={(nextValue) => updateCombatant(record.id, { ac: Number(nextValue ?? 0) })}
          />
        )
      },
    },
    {
      title: 'Init mod',
      dataIndex: 'initiativeModifier',
      width: 120,
      render: (value: number, record) => (
        <InputNumber
          size="small"
          value={value}
          min={-10}
          step={1}
          max={20}
          style={{ width: '100%' }}
          onChange={(nextValue) =>
            updateCombatant(record.id, { initiativeModifier: Number(nextValue ?? 0) })
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
          onClick={() => removeCombatant(record.id)}
        />
      ),
    },
  ]

  return (
    <Table<Combatant>
      rowKey="id"
      size="small"
      pagination={false}
      columns={columns}
      dataSource={combatants}
      rowClassName={(record) => (record.id === currentTurnId ? styles.currentTurnRow : '')}
      locale={{ emptyText: 'Add combatants to start tracking turns.' }}
    />
  )
}
