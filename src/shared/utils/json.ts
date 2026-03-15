export const downloadJson = (fileName: string, payload: unknown) => {
  const stringified = JSON.stringify(payload, null, 2)
  const blob = new Blob([stringified], { type: 'application/json' })
  const fileUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = fileUrl
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(fileUrl)
}

export const readJsonFile = async (file: File): Promise<unknown> => {
  const raw = await file.text()
  return JSON.parse(raw) as unknown
}
