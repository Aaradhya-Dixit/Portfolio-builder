import { useMemo, useState } from 'react'
import { buildHtmlDocument } from '../portfolio/buildDocument'
import { downloadPortfolioZip } from '../export/downloadZip'
import './FullPreview.css'

export default function FullPreview({ data, onBack }) {
  const [device, setDevice] = useState('desktop')
  const [busy, setBusy] = useState(false)

  const srcDoc = useMemo(
    () => buildHtmlDocument(data, { photoSrc: data.profile.photo || '', placeholders: true }),
    [data],
  )

  async function generate() {
    setBusy(true)
    try {
      await downloadPortfolioZip(data)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="full-preview">
      <header className="full-bar">
        <button type="button" className="ghost" onClick={onBack}>
          ← Back to editor
        </button>
        <div className="device-toggle" role="group" aria-label="Preview size">
          <button
            type="button"
            className={device === 'desktop' ? 'on' : ''}
            onClick={() => setDevice('desktop')}
          >
            Desktop
          </button>
          <button
            type="button"
            className={device === 'mobile' ? 'on' : ''}
            onClick={() => setDevice('mobile')}
          >
            Mobile
          </button>
        </div>
        <button type="button" onClick={generate} disabled={busy}>
          {busy ? 'Preparing ZIP…' : 'Generate Portfolio'}
        </button>
      </header>

      <div className={`stage ${device}`}>
        <iframe title="Full-screen portfolio preview" srcDoc={srcDoc} />
      </div>
    </div>
  )
}
