import { CharacterTemplatesPage } from '@pages/characterTemplates'

export const MonsterCharactersPage = () => {
  return (
    <CharacterTemplatesPage
      characterType="monster"
      title="Monster Characters"
      description="Characters from this list are used to prefill the initiative form for monsters."
      emptyText="Add monster characters to use them as initiative presets."
      namePlaceholder="Goblin"
    />
  )
}
