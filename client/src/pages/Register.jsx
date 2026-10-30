import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Landing.css'
import './Auth.css'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [fieldErrors, setFieldErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  function validate() {
    const errors = {}

    if (!formData.name.trim()) {
      errors.name = 'Full name is required.'
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters.'
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required.'
    } else if (!EMAIL_RE.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address.'
    }

    if (!formData.password) {
      errors.password = 'Password is required.'
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.'
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirm your password.'
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.'
    }

    return errors
  }

  function handleChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear field-specific error as user types
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
      await register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      })
      navigate('/templates', { replace: true })
    } catch (err) {
      setServerError(err.message || 'Could not register. Please try again.')
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
          <Link className="btn ghost" to="/login">
            Login
          </Link>
        </nav>
      </header>

      <main className="auth-main">
        <div className="auth-card">
          <div className="auth-card-header">
            <p className="brand">Get Started</p>
            <h1>Create your account</h1>
            <p>Sign up to build, customize, and save your portfolio.</p>
          </div>

          {serverError && (
            <div className="auth-error-banner" role="alert">
              <span>⚠️</span>
              <div>{serverError}</div>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="e.g. Priya Sharma"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={fieldErrors.name ? 'has-error' : ''}
              />
              {fieldErrors.name && <p className="field-error-text">{fieldErrors.name}</p>}
            </div>

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
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className={fieldErrors.password ? 'has-error' : ''}
              />
              {fieldErrors.password && <p className="field-error-text">{fieldErrors.password}</p>}
            </div>

            <div className="auth-field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                className={fieldErrors.confirmPassword ? 'has-error' : ''}
              />
              {fieldErrors.confirmPassword && (
                <p className="field-error-text">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            <button type="submit" className="auth-submit-btn" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="spinner spinner-sm" aria-hidden="true" />
                  Creating account…
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?
            <Link to="/login">Log in</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
