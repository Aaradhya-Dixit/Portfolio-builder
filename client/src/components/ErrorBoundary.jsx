import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/portfolios'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="auth-loading-screen" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }} role="img" aria-label="Warning">
            ⚠️
          </div>
          <h2 style={{ color: '#0f172a', margin: '0 0 8px' }}>Something went wrong in the builder</h2>
          <p style={{ color: '#64748b', maxWidth: 480, margin: '0 auto 24px', lineHeight: 1.5 }}>
            {this.state.error?.message || 'An unexpected error occurred while loading this view.'}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button type="button" className="btn" onClick={this.handleReload}>
              Reload
            </button>
            <button type="button" className="btn ghost" onClick={this.handleGoHome}>
              Go to My Portfolios
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

