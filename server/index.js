import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import mongoose from 'mongoose'
import { apiLimiter } from './middleware/rateLimit.js'
import authRoutes from './routes/auth.js'
import portfolioRoutes from './routes/portfolios.js'

const PORT = process.env.PORT || 5000
const CLIENT_URL = process.env.CLIENT_URL || process.env.CLIENT_ORIGIN || 'http://localhost:5173'

const app = express()

// Trust reverse proxy (e.g. Render, Railway, Fly.io, Heroku) for accurate IP rate limiting
app.set('trust proxy', 1)

// Security HTTP headers
app.use(helmet())

// Restrict CORS strictly to CLIENT_URL (no wildcards)
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  }),
)

// Body limits (2mb is sufficient for compressed < 1MB portfolio photos)
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ limit: '2mb', extended: true }))

const DB_STATES = ['disconnected', 'connected', 'connecting', 'disconnecting']

// Health endpoint - explicitly mounted BEFORE rate limiting so monitoring does not consume rate quota
app.get('/api/health', (_req, res) => {
  const db = DB_STATES[mongoose.connection.readyState] || 'unknown'
  res.json({ ok: true, db })
})

// Apply general API rate limiting to all /api routes
app.use('/api', apiLimiter)

// Application routes
app.use('/api/auth', authRoutes)
app.use('/api/portfolios', portfolioRoutes)

// 404 handler for unknown API routes (mounted after valid routes)
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'API endpoint not found.' })
})

// Centralized error handling middleware (must take 4 arguments: err, req, res, next)
app.use((err, _req, res, _next) => {
  // Handle malformed JSON body parsed by express.json()
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'Malformed JSON payload. Please check your request body syntax.',
    })
  }

  // Handle payload too large errors
  if (err.type === 'entity.too.large' || err.status === 413) {
    return res.status(413).json({
      error: 'Request payload too large. Photos must be under 1 MB.',
    })
  }

  const status = err.status || err.statusCode || 500

  // Always log the full error server-side for debugging
  console.error('Unhandled server error:', err)

  // In production, avoid leaking stack traces or internal implementation details
  if (process.env.NODE_ENV === 'production' || status >= 500) {
    return res.status(status).json({
      error: 'Something went wrong.',
    })
  }

  return res.status(status).json({
    error: err.message || 'Something went wrong.',
  })
})

async function start() {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI
  if (!uri) {
    console.error('Fatal: Missing MongoDB connection string (MONGO_URI or MONGODB_URI).')
    console.error('Copy server/.env.example to server/.env and add your Atlas URI.')
    process.exit(1)
  }

  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) {
    console.error('Fatal: Missing JWT_SECRET. Server cannot start.')
    console.error('Add a cryptographically strong random string to server/.env')
    process.exit(1)
  }

  if (jwtSecret.length < 32) {
    console.warn(
      'Security Warning: JWT_SECRET is shorter than 32 characters. Consider using a 256-bit random key for production.',
    )
  }

  await mongoose.connect(uri)
  console.log('MongoDB connected')

  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`)
  })
}

start().catch((err) => {
  console.error('Server failed to start:', err.message)
  process.exit(1)
})
