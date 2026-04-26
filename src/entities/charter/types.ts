import type {
  CharacterAttack,
  CharacterTemplate,
  CombatantType,
  MovementSpeeds,
} from '@entities/tracker'
import type { FormInstance } from 'antd'

export interface CharacterTemplateFormValues {
  name: string
  initiativeModifier: number
  hp: number
  ac: number
  notes: string
  cr: string
  xp: number | null
  speeds: MovementSpeeds
  attacks: CharacterAttack[]
}

export type CharacterTemplateFormDefaults = Omit<CharacterTemplateFormValues, 'name'>

export interface CharacterTemplatesPageProps {
  characterType: CombatantType
  title: string
  description: string
  emptyText: string
  namePlaceholder: string
}

export interface CharacterTemplateCreateDrawerProps {
  isMonster: boolean
  isOpen: boolean
  namePlaceholder: string
  form: FormInstance<CharacterTemplateFormValues>
  defaults: CharacterTemplateFormDefaults
  onClose: () => void
  onSubmit: (values: CharacterTemplateFormValues) => void
}

export interface CharacterTemplateExpandedContentProps {
  template: CharacterTemplate
  isMonster: boolean
  onUpdate: (patch: Partial<Omit<CharacterTemplate, 'id'>>) => void
}
