import { type ChangeEvent, useRef } from 'react'
import {Button, Flex, message} from 'antd'
import styles from './SnapshotTransferControls.module.scss'
import { useTrackerStore } from '@entities/tracker'
import { downloadJson, readJsonFile } from '@shared/utils/json'
import {ESpacer} from "@shared/constants/sizes.ts";

export const SnapshotTransferControls = () => {
  const [messageApi, contextHolder] = message.useMessage()

  const combatantsCount = useTrackerStore((state) => state.combatants.length)
  const exportSnapshot = useTrackerStore((state) => state.exportSnapshot)
  const importSnapshot = useTrackerStore((state) => state.importSnapshot)
  const importInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    const snapshot = exportSnapshot()
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')

    downloadJson(`initiative-${timestamp}.json`, snapshot)
    void messageApi.success('JSON exported.')
  }

  const handleImportClick = () => {
    importInputRef.current?.click()
  }

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    try {
      const parsed = await readJsonFile(file)
      const result = importSnapshot(parsed)

      if (!result.ok) {
        void messageApi.error(result.error)
        return
      }

      void messageApi.success('JSON imported.')
    } catch {
      void messageApi.error('Could not read JSON file.')
    } finally {
      event.target.value = ''
    }
  }

  return (
    <Flex gap={ESpacer.SPACER3}>
      {contextHolder}
      <Button onClick={handleExport} disabled={combatantsCount === 0}>
        Export JSON
      </Button>
      <Button onClick={handleImportClick}>Import JSON</Button>
      <input
        ref={importInputRef}
        type="file"
        accept="application/json"
        className={styles.hiddenInput}
        onChange={handleImport}
      />
    </Flex>
  )
}
