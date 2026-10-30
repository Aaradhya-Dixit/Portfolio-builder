import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiDeletePortfolio, apiGetPortfolio, apiGetPortfolios } from '../api/portfolios'
import { portfolioToBuilderData } from '../portfolio/photoUtils'
import { downloadPortfolioZip } from '../export/downloadZip'
import './Landing.css'
import './Portfolios.css'

export default function PortfoliosPage() {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()

  const [portfolios, setPortfolios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [banner, setBanner] = useState(null)
  const [downloadingId, setDownloadingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    loadPortfolios()
  }, [])

  async function loadPortfolios() {
    setLoading(true)
    setError('')
    try {
      const data = await apiGetPortfolios(token)
      setPortfolios(data)
    } catch (err) {
      setError(err.message || 'Could not load your portfolios. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDownload(p) {
    setDownloadingId(p.id)
    try {
      // Fetch full portfolio to get the full photo, content, and design
      const fullPortfolio = await apiGetPortfolio(p.id, token)
      const builderData = portfolioToBuilderData(fullPortfolio)
      await downloadPortfolioZip(builderData)
      setBanner({ type: 'success', text: `Downloaded "${p.title}" ZIP successfully.` })
    } catch (err) {
      setBanner({ type: 'error', text: err.message || 'Failed to download portfolio ZIP.' })
    } finally {
      setDownloadingId(null)
    }
  }

  async function handleDelete(p) {
    const confirmMessage = `Are you sure you want to delete "${p.title}"? This action cannot be undone.`
    if (!window.confirm(confirmMessage)) return

    setDeletingId(p.id)
    try {
      await apiDeletePortfolio(p.id, token)
      setPortfolios((prev) => prev.filter((item) => item.id !== p.id))
      setBanner({ type: 'success', text: `Deleted "${p.title}".` })
    } catch (err) {
      setBanner({ type: 'error', text: err.message || 'Could not delete portfolio.' })
    } finally {
      setDeletingId(null)
    }
  }

  function formatDate(isoString) {
    if (!isoString) return ''
    try {
      const d = new Date(isoString)
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return isoString
    }
  }

  return (
    <div className="portfolios-page">
      <header className="land-header">
        <Link to="/" className="land-logo">
          Portfolio Builder
        </Link>
        <nav className="land-nav">
          {user && <span className="user-greeting">Hi, {user.name}</span>}
          <Link className="btn ghost on" to="/portfolios">
            My portfolios
          </Link>
          <Link className="btn ghost" to="/templates">
            Templates
          </Link>
          <button type="button" className="btn ghost" onClick={logout}>
            Logout
          </button>
        </nav>
      </header>

      <main className="portfolios-content">
        <div className="portfolios-hero">
          <div>
            <h1>My Portfolios</h1>
            <p>Manage, edit, or download your saved portfolio websites.</p>
          </div>
          <Link to="/templates" className="btn">
            + Create New Portfolio
          </Link>
        </div>

        {banner && (
          <div className={`alert-banner ${banner.type}`} role="alert">
            <span>{banner.text}</span>
            <button
              type="button"
              className="ghost"
              style={{ padding: '2px 8px', fontSize: '0.8rem' }}
              onClick={() => setBanner(null)}
            >
              ✕
            </button>
          </div>
        )}

        {loading ? (
          <div className="portfolios-loading">
            <div className="spinner" />
            <p>Loading your saved portfolios…</p>
          </div>
        ) : error ? (
          <div className="alert-banner error" role="alert">
            <span>⚠️ {error}</span>
            <button type="button" onClick={loadPortfolios} className="btn ghost" style={{ padding: '4px 12px' }}>
              Retry
            </button>
          </div>
        ) : portfolios.length === 0 ? (
          <div className="portfolios-empty">
            <div className="portfolios-empty-icon">📁</div>
            <h2>You haven't saved any portfolios yet</h2>
            <p>Pick a template to start building your first portfolio website.</p>
            <Link to="/templates" className="btn">
              Browse templates
            </Link>
          </div>
        ) : (
          <div className="portfolios-grid">
            {portfolios.map((p) => (
              <article key={p.id} className="portfolio-card">
                <div>
                  <div className="portfolio-card-head">
                    <h2 className="portfolio-card-title">{p.title}</h2>
                    <span className="template-badge">{p.template}</span>
                  </div>
                  <p className="portfolio-card-meta">
                    Last updated: {formatDate(p.updatedAt || p.createdAt)}
                  </p>
                </div>

                {p.preview && (p.preview.name || p.preview.headline) ? (
                  <div className="portfolio-card-preview">
                    <strong>{p.preview.name || 'No name'}</strong>
                    {p.preview.headline ? <div>{p.preview.headline}</div> : null}
                  </div>
                ) : null}

                <div className="portfolio-card-actions">
                  <button
                    type="button"
                    className="btn ghost"
                    onClick={() => navigate(`/builder/${p.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn ghost"
                    disabled={downloadingId === p.id}
                    onClick={() => handleDownload(p)}
                  >
                    {downloadingId === p.id ? 'Preparing ZIP…' : 'Download'}
                  </button>
                  <button
                    type="button"
                    className="btn-danger"
                    disabled={deletingId === p.id}
                    onClick={() => handleDelete(p)}
                  >
                    {deletingId === p.id ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

