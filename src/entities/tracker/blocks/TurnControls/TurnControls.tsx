import { Button } from 'antd'
import { useTrackerStore } from '@entities/tracker'

export const TurnControls = () => {
  const combatantsCount = useTrackerStore((state) => state.combatants.length)
  const monstersCount = useTrackerStore(
    (state) => state.combatants.filter((combatant) => combatant.type === 'monster').length,
  )
  const rollMonsterInitiative = useTrackerStore((state) => state.rollMonsterInitiative)
  const resetTracker = useTrackerStore((state) => state.resetTracker)

  return (
    <>
      <Button type="primary" onClick={rollMonsterInitiative} disabled={monstersCount === 0}>
        Roll
      </Button>
      <Button danger onClick={resetTracker} disabled={combatantsCount === 0}>
        Clear all
      </Button>
    </>
  )
}
