import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Landing.css'
import './Auth.css'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [fieldErrors, setFieldErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  function validate() {
    const errors = {}

    if (!formData.email.trim()) {
      errors.email = 'Email address is required.'
    } else if (!EMAIL_RE.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address.'
    }

    if (!formData.password) {
      errors.password = 'Password is required.'
    }

    return errors
  }

  function handleChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
    if (serverError) setServerError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setServerError('')

    const errors = validate()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setSubmitting(true)
    try {
      await login({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      })
      const destination = location.state?.from?.pathname || '/templates'
      navigate(destination, { replace: true })
    } catch (err) {
      setServerError(err.message || 'Could not log in. Please check your credentials.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <header className="land-header">
        <Link to="/" className="land-logo">
          Portfolio Builder
        </Link>
        <nav className="land-nav">
          <Link className="btn" to="/register">
            Get started
          </Link>
        </nav>
      </header>

      <main className="auth-main">
        <div className="auth-card">
          <div className="auth-card-header">
            <p className="brand">Welcome Back</p>
            <h1>Log in to your account</h1>
            <p>Enter your credentials to access your saved templates.</p>
          </div>

          {serverError && (
            <div className="auth-error-banner" role="alert">
              <span>⚠️</span>
              <div>{serverError}</div>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={fieldErrors.email ? 'has-error' : ''}
              />
              {fieldErrors.email && <p className="field-error-text">{fieldErrors.email}</p>}
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Your password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className={fieldErrors.password ? 'has-error' : ''}
              />
              {fieldErrors.password && <p className="field-error-text">{fieldErrors.password}</p>}
            </div>

            <button type="submit" className="auth-submit-btn" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="spinner spinner-sm" aria-hidden="true" />
                  Logging in…
                </>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account?
            <Link to="/register">Get started</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
