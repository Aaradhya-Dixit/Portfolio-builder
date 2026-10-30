import { createContext, useContext, useEffect, useState } from 'react'
import { apiLogin, apiMe, apiRegister } from '../api/auth'
import { clearUserDraft, removeLegacyDrafts } from '../data/storage'

const TOKEN_KEY = 'portfolio_auth_token'
const USER_KEY = 'portfolio_auth_user'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  // If a token exists on startup, verify it with /api/auth/me before marking ready.
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)))

  useEffect(() => {
    let active = true

    async function restoreSession() {
      // Purge any old global draft keys on app startup
      removeLegacyDrafts()

      const storedToken = localStorage.getItem(TOKEN_KEY)
      if (!storedToken) {
        if (active) setLoading(false)
        return
      }

      try {
        const { user: verifiedUser } = await apiMe(storedToken)
        if (active) {
          setUser(verifiedUser)
          localStorage.setItem(USER_KEY, JSON.stringify(verifiedUser))
        }
      } catch (err) {
        // If 401 unauthorized or invalid token, reset session and draft
        if (active) {
          if (user?.id) clearUserDraft(user.id)
          setToken(null)
          setUser(null)
          localStorage.removeItem(TOKEN_KEY)
          localStorage.removeItem(USER_KEY)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    restoreSession()

    return () => {
      active = false
    }
  }, [])

  async function login({ email, password }) {
    removeLegacyDrafts()
    const data = await apiLogin({ email, password })
    setToken(data.token)
    setUser(data.user)
    localStorage.setItem(TOKEN_KEY, data.token)
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))
    return data
  }

  async function register({ name, email, password }) {
    removeLegacyDrafts()
    const data = await apiRegister({ name, email, password })
    setToken(data.token)
    setUser(data.user)
    localStorage.setItem(TOKEN_KEY, data.token)
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))
    return data
  }

  function logout() {
    if (user?.id) {
      clearUserDraft(user.id)
    }
    removeLegacyDrafts()
    setToken(null)
    setUser(null)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(token && user),
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
