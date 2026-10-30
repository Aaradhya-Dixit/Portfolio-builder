import { useEffect, useState } from 'react'
import { clearUserDraft, loadSavedData, saveData } from '../data/storage'
import { createDefaultData } from '../data/defaults'

export function usePortfolioData(userId) {
  const [data, setData] = useState(() => loadSavedData(userId))

  // When user changes (login, switch account, or logout), reset and load only that user's draft
  useEffect(() => {
    setData(loadSavedData(userId))
  }, [userId])

  // Persist draft changes strictly under the current user's key
  useEffect(() => {
    if (userId) {
      saveData(data, userId)
    }
  }, [data, userId])

  const patch = (partial) => setData((prev) => ({ ...prev, ...partial }))
  const patchProfile = (partial) =>
    setData((prev) => ({ ...prev, profile: { ...prev.profile, ...partial } }))
  const reset = () => {
    if (userId) {
      clearUserDraft(userId)
    }
    setData(createDefaultData())
  }

  return { data, setData, patch, patchProfile, reset }
}
