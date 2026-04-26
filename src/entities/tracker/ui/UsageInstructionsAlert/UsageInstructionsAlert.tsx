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
        <Text>
          1. Fill templates in the Players and Monsters tabs. Monster templates can include walk,
          fly, and swim speed, plus multiple attacks with hit modifier, damage type, and damage
          dice.
        </Text>
        <Text>
          2. In Initiative, choose type and select a template (or type a new name), then click Add.
        </Text>
        <Text>
          3. Use Roll All Monsters, then adjust initiative, HP, and AC directly in the table if
          needed.
        </Text>
        <Text>
          4. Expand a monster row to review speed and attacks. Edit attacks there, use Roll hit for
          d20 + modifier, and Roll damage for the damage dice formula.
        </Text>
        <Text>
          5. Use Next Turn (or Tab) to move through turns. Use Reset battle to restart round order.
        </Text>
        <Text>
          6. Use Export/Import JSON to save or restore encounters locally. Use Clear all to remove
          combatants.
        </Text>
        <Text>
          <Link
            href="https://github.com/sinires/dungeon-master-tools/issues"
            target="_blank"
            rel="noreferrer"
          >
            Have an idea or found a bug? Create an issue here
          </Link>
        </Text>
      </Flex>
    }
  />
)
