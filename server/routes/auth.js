import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import { auth } from '../middleware/auth.js'
import { authLimiter } from '../middleware/rateLimit.js'

const router = Router()
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function signToken(user) {
  return jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
    subject: String(user._id),
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

function validateRegister({ name, email, password }) {
  const errors = []
  if (!name || name.trim().length < 2) errors.push('Name must be at least 2 characters.')
  if (!email || !EMAIL_RE.test(email.trim())) errors.push('Enter a valid email address.')
  if (!password || password.length < 8) errors.push('Password must be at least 8 characters.')
  return errors
}

function validateLogin({ email, password }) {
  const errors = []
  if (!email || !EMAIL_RE.test(String(email).trim())) errors.push('Enter a valid email address.')
  if (!password) errors.push('Password is required.')
  return errors
}

router.post('/register', authLimiter, async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {}
    const errors = validateRegister({ name, email, password })
    if (errors.length) return res.status(400).json({ error: errors.join(' ') })

    const normalisedEmail = email.trim().toLowerCase()
    const existing = await User.findOne({ email: normalisedEmail })
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists. Try logging in.' })
    }

    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({
      name: name.trim(),
      email: normalisedEmail,
      password: hashed,
    })

    const token = signToken(user)
    return res.status(201).json({ token, user: user.toSafeJSON() })
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'An account with this email already exists. Try logging in.' })
    }
    next(err)
  }
})

router.post('/login', authLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body || {}
    const errors = validateLogin({ email, password })
    if (errors.length) return res.status(400).json({ error: errors.join(' ') })

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password')
    if (!user) {
      return res.status(401).json({ error: 'Incorrect email or password.' })
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(401).json({ error: 'Incorrect email or password.' })
    }

    const token = signToken(user)
    return res.json({ token, user: user.toSafeJSON() })
  } catch (err) {
    next(err)
  }
})

// Handy check for the auth middleware (returns the logged-in user).
router.get('/me', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) return res.status(401).json({ error: 'Account not found. Please log in again.' })
    return res.json({ user: user.toSafeJSON() })
  } catch (err) {
    next(err)
  }
})

export default router
