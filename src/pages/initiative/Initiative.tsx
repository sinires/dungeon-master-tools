import { useEffect } from 'react'
import { Button, Card, Flex, Typography, Space } from 'antd'
import { AddCombatantForm } from '@entities/tracker/blocks/AddCombatant'
import { TurnControls } from '@entities/tracker/blocks/TurnControls'
import { SnapshotTransferControls } from '@entities/tracker/blocks/SnapshotTransfer'
import { CombatantsTable, UsageInstructionsAlert, useTrackerStore } from '@entities/tracker'
import { shouldHidePlayerStats } from '@entities/tracker/utils'
import { ESpacer } from '@shared/constants/sizes.ts'

const { Title, Text, Paragraph } = Typography

export const InitiativePage = () => {
  const combatants = useTrackerStore((state) => state.combatants)
  const currentTurnId = useTrackerStore((state) => state.currentTurnId)
  const round = useTrackerStore((state) => state.round)
  const nextTurn = useTrackerStore((state) => state.nextTurn)
  const resetBattle = useTrackerStore((state) => state.resetBattle)
  const currentTurn = combatants.find((combatant) => combatant.id === currentTurnId)
  const combatantsCount = combatants.length
  const battleRound = combatants.length === 0 ? 0 : Math.max(1, round)
  const monstersCount = useTrackerStore(
      (state) => state.combatants.filter((combatant) => combatant.type === 'monster').length,
  )
  const rollMonsterInitiative = useTrackerStore((state) => state.rollMonsterInitiative)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || combatants.length === 0) {
        return
      }

      event.preventDefault()
      nextTurn()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [combatants.length, nextTurn])

  return (
    <Card>
      <Flex vertical gap={ESpacer.SPACER3}>
        <Title level={2}>Initiative Tracker</Title>
        <AddCombatantForm />
        <Flex justify='space-between' gap={ESpacer.SPACER3}>
          <Paragraph>
            Current turn: <Text strong>{currentTurn?.name ?? 'not selected'}</Text>
            {currentTurn ? (
                <>
                  {' | '}Initiative: <Text strong>{currentTurn.initiative}</Text>
                  {!shouldHidePlayerStats(currentTurn) ? (
                      <>
                        {' | '}HP: <Text strong>{currentTurn.hp}</Text>
                        {' | '}AC: <Text strong>{currentTurn.ac}</Text>
                      </>
                  ) : null}
                </>
            ) : null}
          </Paragraph>
          <Paragraph>
            Round: <Text strong>{battleRound === 0 ? 'not started' : battleRound}</Text>
          </Paragraph>
        </Flex>
        <Flex justify='space-between' gap={ESpacer.SPACER2}>
          <Button type="primary" onClick={nextTurn} disabled={combatantsCount === 0}>
            Next Turn
          </Button>
          <Space>
            <Button type="primary" danger onClick={rollMonsterInitiative} disabled={monstersCount === 0}>
              Roll All Monsters
            </Button>
            <Button onClick={resetBattle} disabled={combatantsCount === 0}>
              Reset battle
            </Button>
          </Space>
        </Flex>
        <CombatantsTable />
        <Flex justify='space-between' gap={ESpacer.SPACER3}>
          <SnapshotTransferControls />
          <TurnControls />
        </Flex>
        <UsageInstructionsAlert />
      </Flex>
    </Card>
  )
}
