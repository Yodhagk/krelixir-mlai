const express = require('express')
const multer = require('multer')
const { parse } = require('csv-parse/sync')
const { v4: uuidv4 } = require('uuid')
const { body, validationResult } = require('express-validator')
const { authenticate } = require('../middleware/auth')
const { asyncHandler } = require('../middleware/errorHandler')
const { getDb } = require('../models/db')

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } })

router.use(authenticate)

// GET /api/inventory
router.get('/', asyncHandler(async (req, res) => {
  const db = getDb()
  const { type, status, search } = req.query
  const items = db.inventory.list(req.user.id, { type, status, search })
  res.json({ success: true, items, total: items.length })
}))

// GET by type
const typeRoute = (type) =>
  asyncHandler(async (req, res) => {
    const db = getDb()
    const items = db.inventory.list(req.user.id, { type })
    res.json({ success: true, items })
  })

router.get('/servers', typeRoute('Server'))
router.get('/databases', typeRoute('Database'))
router.get('/applications', typeRoute('Application'))
router.get('/network', typeRoute('Network'))

// POST /api/inventory
router.post('/', [
  body('name').trim().notEmpty(),
  body('type').isIn(['Server', 'Database', 'Application', 'Network']),
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ success: false, message: errors.array()[0].msg })

  const db = getDb()
  const item = db.inventory.create({
    id: uuidv4(),
    user_id: req.user.id,
    name: req.body.name,
    type: req.body.type,
    subtype: req.body.subtype || null,
    os: req.body.os || null,
    engine: req.body.engine || null,
    stack: req.body.stack || null,
    bandwidth: req.body.bandwidth || null,
    cpu: req.body.cpu ? Number(req.body.cpu) : null,
    ram: req.body.ram ? Number(req.body.ram) : null,
    storage: req.body.storage ? Number(req.body.storage) : null,
    instances: req.body.instances ? Number(req.body.instances) : 1,
    connections: req.body.connections ? Number(req.body.connections) : null,
    size: req.body.size || null,
    status: req.body.status || 'active',
    region: req.body.region || null,
    cost: req.body.cost ? Number(req.body.cost) : 0,
    migration_status: req.body.migration_status || 'pending',
    tags: req.body.tags || [],
    metadata: req.body.metadata || {},
  })
  res.status(201).json({ success: true, item })
}))

// PUT /api/inventory/:id
router.put('/:id', asyncHandler(async (req, res) => {
  const db = getDb()
  const allowedFields = ['name', 'type', 'os', 'engine', 'stack', 'status', 'region', 'cost', 'migration_status', 'cpu', 'ram', 'storage']
  const updates = {}
  for (const f of allowedFields) {
    if (req.body[f] !== undefined) updates[f] = req.body[f]
  }
  const item = db.inventory.update(req.params.id, req.user.id, updates)
  if (!item) return res.status(404).json({ success: false, message: 'Asset not found' })
  res.json({ success: true, item })
}))

// DELETE /api/inventory/:id
router.delete('/:id', asyncHandler(async (req, res) => {
  const db = getDb()
  const deleted = db.inventory.delete(req.params.id, req.user.id)
  if (!deleted) return res.status(404).json({ success: false, message: 'Asset not found' })
  res.json({ success: true, message: 'Asset deleted' })
}))

// POST /api/inventory/upload — CSV import
router.post('/upload', upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' })

  let records
  try {
    records = parse(req.file.buffer.toString(), { columns: true, skip_empty_lines: true, trim: true })
  } catch {
    return res.status(400).json({ success: false, message: 'Invalid CSV format' })
  }

  const db = getDb()
  const items = []
  for (const row of records) {
    if (!row.name || !row.type) continue
    items.push({
      id: uuidv4(),
      user_id: req.user.id,
      name: row.name,
      type: row.type,
      os: row.os || null,
      engine: row.engine || null,
      stack: row.stack || null,
      cpu: parseInt(row.cpu) || null,
      ram: parseInt(row.ram) || null,
      storage: parseInt(row.storage) || null,
      status: row.status || 'active',
      region: row.region || null,
      cost: parseFloat(row.cost) || 0,
      migration_status: row.migration_status || 'pending',
      tags: [],
      metadata: {},
    })
  }
  const count = db.inventory.bulkCreate(items)
  res.json({ success: true, imported: count, total: records.length })
}))

module.exports = router
