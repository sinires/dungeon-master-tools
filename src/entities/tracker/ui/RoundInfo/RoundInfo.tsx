import { Tag } from 'antd'
import type { RoundInfoProps } from '@entities/tracker/ui/RoundInfo/types.ts'

export const RoundInfo = ({ battleRound }: RoundInfoProps) => {
  return <Tag color="blue">Round: {battleRound === 0 ? 'not started' : battleRound}</Tag>
}
