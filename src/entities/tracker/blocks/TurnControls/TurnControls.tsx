import { Button } from 'antd'
import { useTrackerStore } from '@entities/tracker'

export const TurnControls = () => {
  const combatantsCount = useTrackerStore((state) => state.combatants.length)

  const resetTracker = useTrackerStore((state) => state.resetTracker)

  return (
    <>
      <Button danger onClick={resetTracker} disabled={combatantsCount === 0}>
        Clear all
      </Button>
    </>
  )
}
