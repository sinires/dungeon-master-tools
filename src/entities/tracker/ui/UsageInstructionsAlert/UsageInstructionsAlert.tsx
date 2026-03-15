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
        <Text>1. Add players and monsters in the form above.</Text>
        <Text>2. Roll initiative for monsters, then set player initiative manually if needed.</Text>
        <Text>3. Use Next Turn (or Tab) to move through the tracker.</Text>
        <Text>4. Use Export/Import JSON to save or restore encounters locally.</Text>
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
