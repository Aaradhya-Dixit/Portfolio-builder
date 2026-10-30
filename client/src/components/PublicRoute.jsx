import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="auth-loading-screen">
        <div className="spinner" />
        <p>Loading your session…</p>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/templates" replace />
  }

  return children
}
