import { useEffect, useState } from 'react'
import { loadSavedData, saveData } from '../data/storage'

export function usePortfolioData() {
  const [data, setData] = useState(() => loadSavedData())

  useEffect(() => {
    saveData(data)
  }, [data])

  const patch = (partial) => setData((prev) => ({ ...prev, ...partial }))
  const patchProfile = (partial) =>
    setData((prev) => ({ ...prev, profile: { ...prev.profile, ...partial } }))

  return { data, setData, patch, patchProfile }
}
