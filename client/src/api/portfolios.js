const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

async function handleResponse(res) {
  let data
  try {
    data = await res.json()
  } catch {
    data = null
  }

  if (!res.ok) {
    const errorMsg = data?.error || (res.status === 404 ? 'Portfolio not found.' : 'Request failed. Please try again.')
    const err = new Error(errorMsg)
    err.status = res.status
    throw err
  }

  return data
}

/**
 * Fetch all portfolios belonging to the logged-in user.
 * Server returns an array of summary objects: [ { id, title, template, preview, createdAt, updatedAt } ]
 */
export async function apiGetPortfolios(token) {
  const res = await fetch(`${API_URL}/api/portfolios`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const data = await handleResponse(res)
  // If wrapped in { portfolios: [...] }, handle both
  return Array.isArray(data) ? data : data?.portfolios || []
}

/**
 * Fetch a single full portfolio by ID.
 * Server returns { portfolio: safe, ...safe }
 */
export async function apiGetPortfolio(id, token) {
  const res = await fetch(`${API_URL}/api/portfolios/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const data = await handleResponse(res)
  return data?.portfolio || data
}

/**
 * Create a new portfolio for the logged-in user.
 * @param {{ title: string, template: string, data: object, design: object, photo?: string }} payload
 */
export async function apiCreatePortfolio(payload, token) {
  const res = await fetch(`${API_URL}/api/portfolios`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
  const data = await handleResponse(res)
  return data?.portfolio || data
}

/**
 * Update an existing portfolio owned by the logged-in user.
 * @param {string} id
 * @param {{ title?: string, template?: string, data?: object, design?: object, photo?: string }} payload
 */
export async function apiUpdatePortfolio(id, payload, token) {
  const res = await fetch(`${API_URL}/api/portfolios/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
  const data = await handleResponse(res)
  return data?.portfolio || data
}

/**
 * Delete a portfolio owned by the logged-in user.
 */
export async function apiDeletePortfolio(id, token) {
  const res = await fetch(`${API_URL}/api/portfolios/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return handleResponse(res)
}

