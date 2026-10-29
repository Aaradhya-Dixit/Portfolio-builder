import jwt from 'jsonwebtoken'

export function auth(req, res, next) {
  const header = req.headers.authorization || ''
  const [scheme, token] = header.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header. Use: Bearer <token>' })
  }

  const secret = process.env.JWT_SECRET
  if (!secret) {
    return res.status(500).json({ error: 'Server is missing JWT_SECRET.' })
  }

  try {
    const payload = jwt.verify(token, secret)
    req.user = { id: payload.sub, email: payload.email }
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token. Please log in again.' })
  }
}
