import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import authRoutes from './routes/auth.js'
import portfolioRoutes from './routes/portfolios.js'

const PORT = process.env.PORT || 5000
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'

const app = express()

// Vite may fall back to 5174 if 5173 is already taken.
app.use(
  cors({
    origin: [CLIENT_ORIGIN, 'http://localhost:5173', 'http://localhost:5174'],
  }),
)
app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ limit: '5mb', extended: true }))

const DB_STATES = ['disconnected', 'connected', 'connecting', 'disconnecting']

app.get('/api/health', (_req, res) => {
  const db = DB_STATES[mongoose.connection.readyState] || 'unknown'
  res.json({ ok: true, db })
})

app.use('/api/auth', authRoutes)
app.use('/api/portfolios', portfolioRoutes)

async function start() {
  const uri = process.env.MONGO_URI
  if (!uri) {
    console.error('Missing MONGO_URI. Copy server/.env.example to server/.env and add your Atlas URI.')
    process.exit(1)
  }
  if (!process.env.JWT_SECRET) {
    console.error('Missing JWT_SECRET. Add a long random string to server/.env')
    process.exit(1)
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
