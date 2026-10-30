import { DEFAULT_SECTIONS } from '../data/defaults'

/**
 * Resizes an image data URL via canvas to maxDimension (600px) and quality (0.8),
 * and verifies it is under 1 MB.
 */
export async function resizePhotoIfNeeded(photoDataUrl, maxDimension = 600, quality = 0.8) {
  if (!photoDataUrl || typeof photoDataUrl !== 'string') return ''
  if (!photoDataUrl.startsWith('data:image/')) return photoDataUrl

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      try {
        const scale = Math.min(1, maxDimension / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(img.width * scale))
        canvas.height = Math.max(1, Math.round(img.height * scale))
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        const compressed = canvas.toDataURL('image/jpeg', quality)

        // Check size: base64 characters * 3/4 is roughly byte size
        const base64Data = compressed.split(',')[1] || ''
        const sizeInBytes = (base64Data.length * 3) / 4

        if (sizeInBytes > 1024 * 1024) {
          reject(new Error('Photo is too large (over 1 MB). Please choose a smaller or lower-resolution photo.'))
        } else {
          resolve(compressed)
        }
      } catch (err) {
        reject(err)
      }
    }
    img.onerror = () => {
      reject(new Error('Could not process photo image. Please try a different JPG or PNG.'))
    }
    img.src = photoDataUrl
  })
}

/**
 * Transforms a server portfolio document into the builder state structure.
 * Handles both unwrapped objects and objects wrapped in { portfolio: ... }.
 */
export function portfolioToBuilderData(portfolio) {
  if (!portfolio) return null

  const doc = portfolio.portfolio || portfolio
  const pData = doc.data || {}
  const pDesign = doc.design || {}

  // Check if profile was stored nested under data.profile or flat in data
  const profileSrc = pData.profile || pData

  return {
    templateId: doc.template || pData.templateId || 'minimalist',
    accent: pDesign.accent || pDesign.colour || pData.accent || '#0f766e',
    font: pDesign.font || pData.font || 'inter',
    sectionOrder: Array.isArray(pDesign.sectionOrder)
      ? pDesign.sectionOrder
      : Array.isArray(pData.sectionOrder)
      ? pData.sectionOrder
      : [...DEFAULT_SECTIONS],
    profile: {
      name: profileSrc.name || '',
      headline: profileSrc.headline || '',
      bio: profileSrc.bio || '',
      photo: doc.photo || profileSrc.photo || '',
      email: profileSrc.email || '',
      github: profileSrc.github || '',
      linkedin: profileSrc.linkedin || '',
      location: profileSrc.location || '',
    },
    skills: Array.isArray(pData.skills) ? pData.skills : [],
    projects: Array.isArray(pData.projects) ? pData.projects : [],
  }
}

/**
 * Transforms builder state into the backend API payload.
 */
export async function builderDataToPayload(data, title) {
  const photo = await resizePhotoIfNeeded(data.profile?.photo || '')

  return {
    title: (title || data.profile?.name || 'My Portfolio').trim(),
    template: data.templateId || 'minimalist',
    data: {
      profile: {
        name: data.profile?.name || '',
        headline: data.profile?.headline || '',
        bio: data.profile?.bio || '',
        email: data.profile?.email || '',
        github: data.profile?.github || '',
        linkedin: data.profile?.linkedin || '',
        location: data.profile?.location || '',
      },
      skills: data.skills || [],
      projects: data.projects || [],
    },
    design: {
      accent: data.accent || '#0f766e',
      font: data.font || 'inter',
      sectionOrder: data.sectionOrder || [...DEFAULT_SECTIONS],
    },
    photo,
  }
}
