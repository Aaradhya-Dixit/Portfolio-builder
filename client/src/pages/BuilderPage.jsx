import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { usePortfolioData } from '../hooks/usePortfolioData'
import { apiGetPortfolio } from '../api/portfolios'
import { portfolioToBuilderData } from '../portfolio/photoUtils'
import Editor from '../components/Editor'
import FullPreview from '../components/FullPreview'
import ErrorBoundary from '../components/ErrorBoundary'

export default function BuilderPage() {
  const { id } = useParams()
  const { user, token } = useAuth()
  const navigate = useNavigate()

  // Track the currently loaded portfolio ID in memory to avoid redundant refetches
  const loadedIdRef = useRef(null)

  // For unpersisted draft, strictly keyed by the logged-in user's ID
  const local = usePortfolioData(user?.id)

  // Dedicated state for editing a saved portfolio by ID
  const [remoteData, setRemoteData] = useState(null)
  const [remoteTitle, setRemoteTitle] = useState('')
  const [loading, setLoading] = useState(Boolean(id))
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(false)

  useEffect(() => {
    if (!id) {
      loadedIdRef.current = null
      setRemoteData(null)
      setRemoteTitle('')
      setLoading(false)
      return
    }

    // If this exact portfolio was already loaded into memory (e.g. from the POST save), don't wipe and refetch
    if (loadedIdRef.current === id && remoteData) {
      setLoading(false)
      return
    }

    let active = true
    setLoading(true)
    setError('')

    async function fetchPortfolio() {
      try {
        const full = await apiGetPortfolio(id, token)
        if (active) {
          const doc = full?.portfolio || full
          const builderFormat = portfolioToBuilderData(doc)
          loadedIdRef.current = doc?.id || doc?._id || id
          setRemoteData(builderFormat)
          setRemoteTitle(doc?.title || '')
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Could not load the requested portfolio.')
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchPortfolio()

    return () => {
      active = false
    }
  }, [id, token])

  // Safeguard: show loading while fetching or transitioning into /builder/:id
  if (loading || (id && !remoteData && !error)) {
    return (
      <div className="auth-loading-screen">
        <div className="spinner" />
        <p>Loading saved portfolio…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="auth-loading-screen" style={{ textAlign: 'center', padding: 20 }}>
        <h2>Portfolio not found</h2>
        <p style={{ color: '#64748b', maxWidth: 420 }}>{error}</p>
        <Link to="/portfolios" className="btn" style={{ marginTop: 12 }}>
          Back to My Portfolios
        </Link>
      </div>
    )
  }

  // Choose between editing remote portfolio vs local draft
  const activeData = id ? remoteData : local.data
  const activeTitle = id ? remoteTitle : ''

  if (!activeData) {
    return (
      <div className="auth-loading-screen">
        <div className="spinner" />
        <p>Loading builder…</p>
      </div>
    )
  }

  const patch = (partial) => {
    if (id) {
      setRemoteData((prev) => ({ ...prev, ...partial }))
    } else {
      local.patch(partial)
    }
  }

  const patchProfile = (partial) => {
    if (id) {
      setRemoteData((prev) => ({
        ...prev,
        profile: { ...prev.profile, ...partial },
      }))
    } else {
      local.patchProfile(partial)
    }
  }

  function handleSaveSuccess(savedPortfolio) {
    const savedId =
      savedPortfolio?.id ||
      savedPortfolio?._id ||
      savedPortfolio?.portfolio?.id ||
      savedPortfolio?.portfolio?._id

    if (!id && savedId) {
      // 1. Immediately store the saved data in remote state so transition is instant
      const doc = savedPortfolio?.portfolio || savedPortfolio
      const builderFormat = portfolioToBuilderData(doc) || activeData
      loadedIdRef.current = savedId
      setRemoteData(builderFormat)
      setRemoteTitle(doc?.title || '')
      setLoading(false)

      // 2. Clear unpersisted draft so a future new portfolio starts empty
      local.reset()

      // 3. Update route seamlessly without refetching or wiping builder state
      navigate(`/builder/${savedId}`, { replace: true })
    } else if (savedPortfolio?.title || savedPortfolio?.portfolio?.title) {
      setRemoteTitle(savedPortfolio.title || savedPortfolio.portfolio?.title)
    }
  }

  if (preview) {
    return <FullPreview data={activeData} onBack={() => setPreview(false)} />
  }

  return (
    <ErrorBoundary>
      <Editor
        data={activeData}
        patch={patch}
        patchProfile={patchProfile}
        portfolioId={id || null}
        portfolioTitle={activeTitle}
        onSaveSuccess={handleSaveSuccess}
        onChangeTemplate={() => navigate('/templates')}
        onPreview={() => setPreview(true)}
      />
    </ErrorBoundary>
  )
}
