import JSZip from 'jszip'
import { buildHtmlDocument, buildStyleCss, parsePhotoAsset } from '../portfolio/buildDocument'

export async function downloadPortfolioZip(data) {
  const photo = parsePhotoAsset(data.profile.photo)
  // Relative path so unzipped files open with a double-click (no server).
  const photoSrc = photo ? `./${photo.path}` : ''
  const html = buildHtmlDocument(data, { linkedCss: true, photoSrc })
  const css = buildStyleCss(data)

  const zip = new JSZip()
  zip.file('index.html', html)
  zip.file('style.css', css)
  if (photo) {
    zip.folder('assets')
    zip.file(photo.path, photo.base64, { base64: true })
  }

  const blob = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const slug = (data.profile.name || 'portfolio').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  a.href = url
  a.download = `${slug || 'portfolio'}.zip`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
