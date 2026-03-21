import { CharacterTemplatesPage } from '@pages/characterTemplates'

export const PlayerCharactersPage = () => {
  return (
    <CharacterTemplatesPage
      characterType="player"
      title="Player Characters"
      description="Characters from this list are used to prefill the initiative form for players."
      emptyText="Add player characters to use them as initiative presets."
      namePlaceholder="Alyra"
    />
  )
}
