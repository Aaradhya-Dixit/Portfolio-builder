import { Link } from 'react-router-dom'
import './Landing.css'

export default function Register() {
  return (
    <div className="auth-placeholder">
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
      <main>
        <p className="brand">Register</p>
        <h1>Register page coming soon</h1>
        <p>You’ll create an account here next. For now you can still open the template gallery.</p>
        <p>
          <Link className="btn" to="/templates">
            Browse templates
          </Link>
        </p>
      </main>
    </div>
  )
}
