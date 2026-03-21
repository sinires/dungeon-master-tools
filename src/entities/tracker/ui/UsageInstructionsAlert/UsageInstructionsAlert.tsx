import { Alert, Flex, Typography } from 'antd'
import { ESpacer } from '@shared/constants/sizes.ts'

const { Text, Link } = Typography

export const UsageInstructionsAlert = () => (
  <Alert
    type="info"
    showIcon
    title="How to use"
    description={
      <Flex vertical gap={ESpacer.SPACER1}>
        <Text>1. Fill templates in the Players and Monsters tabs.</Text>
        <Text>2. In Initiative, choose type and select a template (or type a new name), then click Add.</Text>
        <Text>3. Use Roll All Monsters, then adjust initiative, HP, and AC directly in the table if needed.</Text>
        <Text>4. Use Next Turn (or Tab) to move through turns. Use Reset battle to restart round order.</Text>
        <Text>5. Use Export/Import JSON to save or restore encounters locally. Use Clear all to remove combatants.</Text>
        <Text>
          Have an idea or found a bug? Create an issue
          <Link
            href="https://github.com/sinires/dungeon-master-tools/issues"
            target="_blank"
            rel="noreferrer"
          >
            here
          </Link>
        </Text>
      </Flex>
    }
  />
)
