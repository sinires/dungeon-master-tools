import { useState } from 'react'
import { Button, Flex, Input, InputNumber, Segmented, Typography } from 'antd'
import styles from './AddCombatantForm.module.scss'
import { type CombatantType, useTrackerStore } from '@entities/tracker'

const { Text } = Typography
const MONSTER_DEFAULT_INIT_MOD = 0
const MONSTER_DEFAULT_HP = 10

export const AddCombatantForm = () => {
  const addCombatant = useTrackerStore((state) => state.addCombatant)

  const [name, setName] = useState('')
  const [initiativeModifier, setInitiativeModifier] = useState(0)
  const [hp, setHp] = useState(0)
  const [ac, setAc] = useState(10)
  const [combatantType, setCombatantType] = useState<CombatantType>('player')

  const handleAddCombatant = () => {
    if (!name.trim()) {
      return
    }

    addCombatant({
      name,
      initiativeModifier,
      hp,
      ac,
      type: combatantType,
    })
  }

  const handleTypeChange = (nextType: CombatantType) => {
    setCombatantType(nextType)

    if (nextType === 'monster') {
      setInitiativeModifier(MONSTER_DEFAULT_INIT_MOD)
      setHp(MONSTER_DEFAULT_HP)
    }
  }

  return (
    <Flex wrap gap={12} align="end">
      <div className={styles.field}>
        <Text className={styles.label}>Name</Text>
        <Input
          value={name}
          className={styles.nameInput}
          placeholder="Goblin #1"
          onChange={(event) => setName(event.target.value)}
          onPressEnter={handleAddCombatant}
        />
      </div>
      <div className={styles.field}>
        <Text className={styles.label}>Initiative mod</Text>
        <InputNumber
          value={initiativeModifier}
          min={-10}
          max={20}
          className={styles.numberInput}
          onChange={(nextValue) => setInitiativeModifier(Number(nextValue ?? 0))}
        />
      </div>
      <div className={styles.field}>
        <Text className={styles.label}>HP</Text>
        <InputNumber
          value={hp}
          min={0}
          className={styles.numberInput}
          onChange={(nextValue) => setHp(Number(nextValue ?? 0))}
        />
      </div>
      <div className={styles.field}>
        <Text className={styles.label}>AC</Text>
        <InputNumber
          value={ac}
          min={0}
          max={99}
          className={styles.numberInput}
          onChange={(nextValue) => setAc(Number(nextValue ?? 0))}
        />
      </div>
      <div className={styles.field}>
        <Text className={styles.label}>Type</Text>
        <Segmented<CombatantType>
          value={combatantType}
          options={[
            { label: 'Player', value: 'player' },
            { label: 'Monster', value: 'monster' },
          ]}
          onChange={handleTypeChange}
        />
      </div>
      <Button
        type="primary"
        onClick={handleAddCombatant}
        disabled={!name.trim()}
        className={styles.addButton}
      >
        Add
      </Button>
    </Flex>
  )
}
