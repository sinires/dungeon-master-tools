import { InitiativePage } from '@pages/initiative'
import { Layout } from 'antd'
import styles from './App.module.scss'

export const App = () => {
  return (
    <Layout className={styles.layout}>
      <Layout.Content className={styles.content}>
        <InitiativePage />
      </Layout.Content>
    </Layout>
  )
}

export default App
