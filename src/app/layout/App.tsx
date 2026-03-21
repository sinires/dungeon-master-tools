import { InitiativePage } from '@pages/initiative'
import { MonsterCharactersPage } from '@pages/monsterCharacters'
import { PlayerCharactersPage } from '@pages/playerCharacters'
import { Layout, Segmented } from 'antd'
import { useState } from 'react'
import { APP_PAGE_OPTIONS } from './constants.ts'
import styles from './styles.module.scss'
import type { AppPage } from './types.ts'


export const App = () => {
  const [activePage, setActivePage] = useState<AppPage>('initiative')

  const pageContent =
    activePage === 'initiative' ? (
      <InitiativePage />
    ) : activePage === 'players' ? (
      <PlayerCharactersPage />
    ) : (
      <MonsterCharactersPage />
    )

  return (
    <Layout className={styles.layout}>
      <Layout.Content className={styles.content}>
        <div className={styles.pageSwitcher}>
          <Segmented<AppPage>
            value={activePage}
            options={APP_PAGE_OPTIONS}
            onChange={setActivePage}
          />
        </div>
        {pageContent}
      </Layout.Content>
    </Layout>
  )
}

export default App
