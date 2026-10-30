import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiCreatePortfolio, apiUpdatePortfolio } from '../api/portfolios'
import { builderDataToPayload } from '../portfolio/photoUtils'
import EditorForm from './EditorForm'
import LivePreview from './LivePreview'
import { downloadPortfolioZip } from '../export/downloadZip'
import './Editor.css'

export default function Editor({
  data,
  patch,
  patchProfile,
  portfolioId,
  portfolioTitle,
  onSaveSuccess,
  onChangeTemplate,
  onPreview,
}) {
  const { user, token, logout } = useAuth()
  const [zipBusy, setZipBusy] = useState(false)
  const [saveBusy, setSaveBusy] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null)
  const [titleModalOpen, setTitleModalOpen] = useState(false)
  const [titleInput, setTitleInput] = useState('')

  // Auto-dismiss success messages after 4 seconds
  useEffect(() => {
    if (saveStatus?.type === 'success') {
      const timer = setTimeout(() => {
        setSaveStatus(null)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [saveStatus])

  if (!data || !data.profile) {
    return (
      <div className="auth-loading-screen">
        <div className="spinner" />
        <p>Loading editor…</p>
      </div>
    )
  }

  async function generatePortfolio() {
    setZipBusy(true)
    try {
      await downloadPortfolioZip(data)
    } finally {
      setZipBusy(false)
    }
  }

  function handleSaveClick() {
    if (portfolioId) {
      executeSave(portfolioTitle || data.profile?.name || 'My Portfolio')
    } else {
      const initialTitle =
        portfolioTitle || (data.profile?.name ? `${data.profile.name}'s Portfolio` : 'My Portfolio')
      setTitleInput(initialTitle)
      setTitleModalOpen(true)
    }
  }

  async function executeSave(titleToSave) {
    const trimmedTitle = (titleToSave || '').trim()
    if (!trimmedTitle) {
      setSaveStatus({ type: 'error', text: 'Portfolio title is required.' })
      return
    }

    setSaveBusy(true)
    setSaveStatus(null)

    try {
      const payload = await builderDataToPayload(data, trimmedTitle)

      let result
      if (portfolioId) {
        result = await apiUpdatePortfolio(portfolioId, payload, token)
        setSaveStatus({ type: 'success', text: `Saved "${trimmedTitle}" successfully.` })
      } else {
        result = await apiCreatePortfolio(payload, token)
        setSaveStatus({ type: 'success', text: `Saved "${trimmedTitle}" to your portfolios!` })
      }

      setTitleModalOpen(false)
      if (onSaveSuccess) {
        onSaveSuccess(result)
      }
    } catch (err) {
      setSaveStatus({ type: 'error', text: err.message || 'Could not save portfolio.' })
    } finally {
      setSaveBusy(false)
    }
  }

  function handleModalSubmit(e) {
    e.preventDefault()
    executeSave(titleInput)
  }

  const currentDisplayTitle = portfolioTitle || data.profile?.name || 'Untitled portfolio'

  return (
    <div className="editor">
      <header className="editor-top">
        <div>
          <Link to="/" className="land-logo" style={{ display: 'block', marginBottom: 2 }}>
            Portfolio Builder
          </Link>
          <strong>{currentDisplayTitle}</strong>
        </div>
        <div className="editor-actions">
          {user && <span className="user-greeting">Hi, {user.name}</span>}
          <Link to="/portfolios" className="btn ghost">
            My portfolios
          </Link>
          <button
            type="button"
            className="btn primary"
            onClick={handleSaveClick}
            disabled={saveBusy}
          >
            {saveBusy ? 'Saving…' : 'Save'}
          </button>
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

      {saveStatus && (
        <div className={`editor-save-banner ${saveStatus.type}`} role="alert">
          <span>{saveStatus.text}</span>
          <button type="button" onClick={() => setSaveStatus(null)}>
            ✕
          </button>
        </div>
      )}

      {titleModalOpen && (
        <div className="modal-backdrop" onClick={() => !saveBusy && setTitleModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Name your portfolio</h3>
            <p>Give your portfolio a recognizable title so you can easily find it later.</p>
            <form onSubmit={handleModalSubmit}>
              <input
                type="text"
                value={titleInput}
                maxLength={100}
                placeholder="e.g. Developer Portfolio 2026"
                onChange={(e) => setTitleInput(e.target.value)}
                autoFocus
                disabled={saveBusy}
              />
              <div className="modal-card-actions">
                <button
                  type="button"
                  className="ghost"
                  onClick={() => setTitleModalOpen(false)}
                  disabled={saveBusy}
                >
                  Cancel
                </button>
                <button type="submit" disabled={saveBusy || !titleInput.trim()}>
                  {saveBusy ? 'Saving…' : 'Save Portfolio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
