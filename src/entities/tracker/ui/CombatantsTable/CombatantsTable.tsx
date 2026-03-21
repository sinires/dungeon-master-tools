import { Button, Input, InputNumber, Table, Tooltip } from 'antd'
import type { TableColumnsType } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import styles from './styles.module.scss'
import type { Combatant, NumericPatchKey } from '../../types'
import { useTrackerStore } from '../../store'
import { shouldHidePlayerStats, hasAdditionalCombatantInfo } from '../../utils'
import { CombatantExpandedInfo } from './CombatantExpandedInfo'

export const CombatantsTable = () => {
  const combatants = useTrackerStore((state) => state.combatants)
  const currentTurnId = useTrackerStore((state) => state.currentTurnId)
  const updateCombatant = useTrackerStore((state) => state.updateCombatant)
  const removeCombatant = useTrackerStore((state) => state.removeCombatant)

  const updateNumericField = (id: string, key: NumericPatchKey, value: number | null) => {
    updateCombatant(id, { [key]: Number(value ?? 0) } as Pick<Combatant, NumericPatchKey>)
  }

  const columns: TableColumnsType<Combatant> = [
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
          onChange={(event) => updateCombatant(record.id, { name: event.target.value })}
        />
      ),
    },
    {
      title: 'Initiative',
      dataIndex: 'initiative',
      width: 110,
      render: (value: number, record) => (
        <Tooltip title={`${value} (IM: ${record.initiativeModifier})`}>
          <InputNumber
            size="small"
            value={value}
            step={1}
            onChange={(nextValue) => updateNumericField(record.id, 'initiative', nextValue)}
          />
        </Tooltip>
      ),
    },
    {
      title: 'HP',
      dataIndex: 'hp',
      width: 100,
      render: (value: number, record) => {
        return (
          !shouldHidePlayerStats(record) && (
            <InputNumber
              size="small"
              value={value}
              min={0}
              step={1}
              onChange={(nextValue) => updateNumericField(record.id, 'hp', nextValue)}
            />
          )
        )
      },
    },
    {
      title: 'AC',
      dataIndex: 'ac',
      width: 100,
      render: (value: number, record) => {
        return (
          !shouldHidePlayerStats(record) && (
            <InputNumber
              size="small"
              value={value}
              min={0}
              step={1}
              onChange={(nextValue) => updateNumericField(record.id, 'ac', nextValue)}
            />
          )
        )
      },
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
      expandable={{
        rowExpandable: hasAdditionalCombatantInfo,
        expandedRowRender: (record) => <CombatantExpandedInfo combatant={record} />,
      }}
      rowClassName={(record) => (record.id === currentTurnId ? styles.currentTurnRow : '')}
      locale={{ emptyText: 'Add combatants to start tracking turns.' }}
    />
  )
}
