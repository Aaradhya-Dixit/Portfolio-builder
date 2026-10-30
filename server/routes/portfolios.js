import { Router } from 'express'
import mongoose from 'mongoose'
import { Portfolio } from '../models/Portfolio.js'
import { auth } from '../middleware/auth.js'

const router = Router()

// All portfolio endpoints require authentication
router.use(auth)

/**
 * Validate MongoDB ObjectId format safely without crashing Mongoose.
 */
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === id
}

/**
 * Validate title, template, and photo data URL & size.
 */
function validatePortfolio({ title, template, photo }, isUpdate = false) {
  const errors = []

  if (!isUpdate || title !== undefined) {
    if (!title || typeof title !== 'string' || !title.trim()) {
      errors.push('Title is required.')
    } else if (title.trim().length > 100) {
      errors.push('Title cannot exceed 100 characters.')
    }
  }

  if (!isUpdate || template !== undefined) {
    if (!template || typeof template !== 'string' || !template.trim()) {
      errors.push('Template is required.')
    }
  }

  if (photo !== undefined && photo !== null && photo !== '') {
    if (typeof photo !== 'string') {
      errors.push('Photo must be a string.')
    } else {
      const isDataUrl = /^data:image\/[a-zA-Z0-9+.-]+;base64,/.test(photo)
      if (!isDataUrl) {
        errors.push('Photo must be a valid base64 image data URL (e.g. data:image/jpeg;base64,...).')
      } else {
        const base64Data = photo.split(',')[1] || ''
        const sizeInBytes = (base64Data.length * 3) / 4
        // Allow up to approx 1 MB
        if (sizeInBytes > 1024 * 1024) {
          errors.push('Photo image must be under 1 MB in size.')
        }
      }
    }
  }

  return errors
}

/**
 * POST /api/portfolios
 * Create a new portfolio for the logged-in user.
 */
router.post('/', async (req, res) => {
  try {
    const { title, template, data, design, photo } = req.body || {}
    const errors = validatePortfolio({ title, template, photo }, false)
    if (errors.length) {
      return res.status(400).json({ error: errors.join(' ') })
    }

    const created = await Portfolio.create({
      owner: req.user.id, // Strictly taken from JWT, never request body
      title: title.trim(),
      template: template.trim(),
      data: data || {},
      design: design || {},
      photo: photo || '',
    })

    const safe = created.toSafeJSON()
    return res.status(201).json({ portfolio: safe, ...safe })
  } catch (err) {
    console.error('Error creating portfolio:', err)
    return res.status(500).json({ error: 'Could not create portfolio. Please try again.' })
  }
})

/**
 * GET /api/portfolios
 * List all portfolios owned by the logged-in user (lightweight summaries, newest first).
 */
router.get('/', async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ owner: req.user.id })
      .sort({ updatedAt: -1 })
      .select('_id title template data updatedAt createdAt')

    const summaries = portfolios.map((p) => p.toSummaryJSON())
    return res.json(summaries)
  } catch (err) {
    console.error('Error listing portfolios:', err)
    return res.status(500).json({ error: 'Could not fetch portfolios. Please try again.' })
  }
})

/**
 * GET /api/portfolios/:id
 * Retrieve a single full portfolio owned by the logged-in user.
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid portfolio ID format.' })
    }

    // Ownership check: must match _id and owner
    const portfolio = await Portfolio.findOne({ _id: id, owner: req.user.id })
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found.' })
    }

    const safe = portfolio.toSafeJSON()
    return res.json({ portfolio: safe, ...safe })
  } catch (err) {
    console.error('Error fetching portfolio:', err)
    return res.status(500).json({ error: 'Could not fetch portfolio. Please try again.' })
  }
})

/**
 * PUT /api/portfolios/:id
 * Update an existing portfolio owned by the logged-in user.
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid portfolio ID format.' })
    }

    const { title, template, data, design, photo } = req.body || {}
    const errors = validatePortfolio({ title, template, photo }, true)
    if (errors.length) {
      return res.status(400).json({ error: errors.join(' ') })
    }

    // Ownership check: must match _id and owner
    const portfolio = await Portfolio.findOne({ _id: id, owner: req.user.id })
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found.' })
    }

    // Apply updates while keeping owner intact
    if (title !== undefined) portfolio.title = title.trim()
    if (template !== undefined) portfolio.template = template.trim()
    if (data !== undefined) portfolio.data = data
    if (design !== undefined) portfolio.design = design
    if (photo !== undefined) portfolio.photo = photo || ''

    await portfolio.save()

    const safe = portfolio.toSafeJSON()
    return res.json({ portfolio: safe, ...safe })
  } catch (err) {
    console.error('Error updating portfolio:', err)
    return res.status(500).json({ error: 'Could not update portfolio. Please try again.' })
  }
})

/**
 * DELETE /api/portfolios/:id
 * Delete a portfolio owned by the logged-in user.
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid portfolio ID format.' })
    }

    // Ownership check: must match _id and owner
    const deleted = await Portfolio.findOneAndDelete({ _id: id, owner: req.user.id })
    if (!deleted) {
      return res.status(404).json({ error: 'Portfolio not found.' })
    }

    return res.json({ ok: true, message: 'Portfolio deleted successfully.', id: deleted._id })
  } catch (err) {
    console.error('Error deleting portfolio:', err)
    return res.status(500).json({ error: 'Could not delete portfolio. Please try again.' })
  }
})

export default router
