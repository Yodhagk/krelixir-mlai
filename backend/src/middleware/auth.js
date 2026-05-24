const jwt = require('jsonwebtoken')
const { getDb } = require('../models/db')

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-prod'

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' })
  }
  const token = authHeader.slice(7)
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    const db = getDb()
    const user = db.users.findById(payload.userId)
    if (!user) return res.status(401).json({ success: false, message: 'User not found' })
    const { password: _, ...safe } = user
    req.user = safe
    next()
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' })
  }
}

module.exports = { authenticate }
