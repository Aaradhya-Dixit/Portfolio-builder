import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import EditorForm from './EditorForm'
import LivePreview from './LivePreview'
import { downloadPortfolioZip } from '../export/downloadZip'
import './Editor.css'

export default function Editor({ data, patch, patchProfile, onChangeTemplate, onPreview }) {
  const { user, logout } = useAuth()
  const [zipBusy, setZipBusy] = useState(false)

  async function generatePortfolio() {
    setZipBusy(true)
    try {
      await downloadPortfolioZip(data)
    } finally {
      setZipBusy(false)
    }
  }

  return (
    <div className="editor">
      <header className="editor-top">
        <div>
          <Link to="/" className="land-logo" style={{ display: 'block', marginBottom: 2 }}>
            Portfolio Builder
          </Link>
          <strong>{data.profile.name || 'Untitled portfolio'}</strong>
        </div>
        <div className="editor-actions">
          {user && <span className="user-greeting">Hi, {user.name}</span>}
          <button type="button" className="ghost" onClick={onChangeTemplate}>
            Change template
          </button>
          <button type="button" className="ghost" onClick={onPreview}>
            Full-screen preview
          </button>
          <button type="button" onClick={generatePortfolio} disabled={zipBusy}>
            {zipBusy ? 'Preparing ZIP…' : 'Generate Portfolio'}
          </button>
          <button type="button" className="ghost" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <div className="split">
        <aside className="form-pane">
          <EditorForm data={data} patch={patch} patchProfile={patchProfile} />
        </aside>
        <section className="preview-pane">
          <LivePreview data={data} />
        </section>
      </div>
    </div>
  )
}
