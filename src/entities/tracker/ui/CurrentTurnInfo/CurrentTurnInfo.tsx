import { Typography } from 'antd'
import type { CurrentTurnInfoProps } from '@entities/tracker/ui/CurrentTurnInfo/types.ts'
import { getCurrentTurnDetails } from '@entities/tracker/utils.ts'
const { Text, Paragraph } = Typography

export const CurrentTurnInfo = ({ currentTurn }: CurrentTurnInfoProps) => {
  if (!currentTurn) {
    return (
      <Paragraph>
        Current turn: <Text strong>not selected</Text>
      </Paragraph>
    )
  }

  const details = getCurrentTurnDetails(currentTurn)

  return (
    <Paragraph>
      Current turn: <Text strong>{currentTurn.name}</Text>
      {details.map((item) => (
        <span key={item.key}>
          {' | '}
          {item.label}: <Text strong>{item.value}</Text>
        </span>
      ))}
    </Paragraph>
  )
}
