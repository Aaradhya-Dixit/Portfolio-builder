import { createDefaultData } from './defaults'

const LEGACY_KEYS = ['portfolio-builder-data-v2', 'portfolio-builder-data']

/**
 * Remove any old shared/un-keyed draft keys from localStorage
 * so previous users' data cannot leak into other accounts.
 */
export function removeLegacyDrafts() {
  try {
    for (const key of LEGACY_KEYS) {
      localStorage.removeItem(key)
    }
  } catch {
    // Ignore storage errors in restrictive environments
  }
}

/**
 * Generate a user-specific storage key.
 */
export function getDraftKey(userId) {
  return userId ? `portfolio-draft:${userId}` : null
}

/**
 * Load draft portfolio data for a specific user.
 * If no draft exists or user is not logged in, returns fresh empty default data.
 */
export function loadSavedData(userId) {
  removeLegacyDrafts()
  if (!userId) return createDefaultData()

  try {
    const key = getDraftKey(userId)
    if (!key) return createDefaultData()

    const raw = localStorage.getItem(key)
    if (!raw) return createDefaultData()

    const saved = JSON.parse(raw)
    const defaults = createDefaultData()

    return {
      ...defaults,
      ...saved,
      profile: { ...defaults.profile, ...(saved.profile || {}) },
      skills: Array.isArray(saved.skills) ? saved.skills : [],
      projects: Array.isArray(saved.projects) ? saved.projects : [],
    }
  } catch {
    return createDefaultData()
  }
}

/**
 * Save draft portfolio data keyed to a specific user.
 */
export function saveData(data, userId) {
  if (!userId || !data) return

  try {
    const key = getDraftKey(userId)
    if (key) {
      localStorage.setItem(key, JSON.stringify(data))
    }
  } catch {
    // Photo data URLs can exceed quota; keep the app running in memory.
    console.warn('Could not save draft to localStorage (quota?). Try a smaller photo.')
  }
}

/**
 * Remove a specific user's draft from localStorage.
 */
export function clearUserDraft(userId) {
  if (!userId) return
  try {
    const key = getDraftKey(userId)
    if (key) {
      localStorage.removeItem(key)
    }
  } catch {
    // Ignore storage errors
  }
}

/** Shrink an image file so it fits within size limits and localStorage. */
export function resizeImageFile(file, maxSize = 600, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(img.width * scale))
      canvas.height = Math.max(1, Math.round(img.height * scale))
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(objectUrl)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Could not read image'))
    }
    img.src = objectUrl
  })
}
