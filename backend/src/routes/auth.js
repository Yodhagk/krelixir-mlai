const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')
const { v4: uuidv4 } = require('uuid')
const { getDb } = require('../models/db')
const { authenticate } = require('../middleware/auth')
const { asyncHandler } = require('../middleware/errorHandler')

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-prod'
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '7d'
const signToken = (userId) => jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES })

// POST /api/auth/register
router.post('/register', [
  body('name').trim().isLength({ min: 2, max: 100 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg })
  }
  const { name, email, password } = req.body
  const db = getDb()

  if (db.users.findByEmail(email)) {
    return res.status(409).json({ success: false, message: 'Email already registered' })
  }

  const hashedPassword = await bcrypt.hash(password, 12)
  const user = db.users.create({ id: uuidv4(), name, email, password: hashedPassword, role: 'admin' })
  const { password: _, ...safeUser } = user
  res.status(201).json({ success: true, user: safeUser, token: signToken(user.id) })
}))

// POST /api/auth/login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Invalid credentials' })
  }
  const { email, password } = req.body
  const db = getDb()

  const user = db.users.findByEmail(email)
  if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password' })

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid email or password' })

  const { password: _, ...safeUser } = user
  res.json({ success: true, user: safeUser, token: signToken(user.id) })
}))

// GET /api/auth/me
router.get('/me', authenticate, asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user })
}))

// PUT /api/auth/me
router.put('/me', authenticate, asyncHandler(async (req, res) => {
  const { name, company } = req.body
  const db = getDb()
  const updated = db.users.update(req.user.id, { name, company })
  res.json({ success: true, user: updated })
}))

module.exports = router
