import { API_BASE_URL } from './config.js'

/**
 * Handle API responses and extract error messages.
 */
async function handleResponse(res) {
  let data
  try {
    data = await res.json()
  } catch {
    data = null
  }

  if (!res.ok) {
    const errorMsg = data?.error || (res.status === 404 ? 'API endpoint not found.' : 'Network error. Please try again.')
    const err = new Error(errorMsg)
    err.status = res.status
    throw err
  }

  return data
}

/**
 * Register a new user.
 * @param {{ name: string, email: string, password: string }} credentials
 * @returns {Promise<{ token: string, user: { id: string, name: string, email: string } }>}
 */
export async function apiRegister({ name, email, password }) {
  const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })
  return handleResponse(res)
}

/**
 * Log in an existing user.
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ token: string, user: { id: string, name: string, email: string } }>}
 */
export async function apiLogin({ email, password }) {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  return handleResponse(res)
}

/**
 * Fetch current user profile using a stored JWT.
 * @param {string} token
 * @returns {Promise<{ user: { id: string, name: string, email: string } }>}
 */
export async function apiMe(token) {
  const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return handleResponse(res)
}
