import { Link } from 'react-router-dom'
import './Landing.css'

export default function Login() {
  return (
    <div className="auth-placeholder">
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
      <main>
        <p className="brand">Login</p>
        <h1>Login page coming soon</h1>
        <p>Accounts are ready on the server. This screen will be the real login form in the next step.</p>
        <p>
          <Link className="btn ghost" to="/">
            Back to home
          </Link>
        </p>
      </main>
    </div>
  )
}
