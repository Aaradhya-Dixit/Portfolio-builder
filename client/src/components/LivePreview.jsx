import { useMemo } from 'react'
import { buildHtmlDocument } from '../portfolio/buildDocument'

export default function LivePreview({ data }) {
  const srcDoc = useMemo(
    () =>
      buildHtmlDocument(data, {
        photoSrc: data.profile.photo || '',
        placeholders: true,
      }),
    [data],
  )

  return (
    <div className="live-preview">
      <div className="live-bar">
        <span className="dots" aria-hidden="true" />
        <span>Live preview</span>
      </div>
      <iframe title="Portfolio live preview" srcDoc={srcDoc} />
    </div>
  )
}
