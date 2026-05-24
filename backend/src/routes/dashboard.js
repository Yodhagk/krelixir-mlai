const express = require('express')
const { authenticate } = require('../middleware/auth')
const { asyncHandler } = require('../middleware/errorHandler')
const { getDb } = require('../models/db')

const router = express.Router()
router.use(authenticate)

// GET /api/dashboard/stats
router.get('/stats', asyncHandler(async (req, res) => {
  const db = getDb()
  const all = db.inventory.list(req.user.id)

  const totalAssets = all.length
  const migrated = all.filter((a) => a.migration_status === 'migrated').length
  const migrating = all.filter((a) => a.migration_status === 'migrating').length
  const pending = all.filter((a) => a.migration_status === 'pending').length
  const totalCurrentCost = all.reduce((s, a) => s + (a.cost || 0), 0)
  const criticalIssues = all.filter((a) => a.status === 'critical' || a.status === 'warning').length

  res.json({
    success: true,
    stats: {
      totalAssets,
      migrated,
      migrating,
      pending,
      totalCurrentCost,
      totalProjectedCost: Math.round(totalCurrentCost * 0.36),
      totalSavings: Math.round(totalCurrentCost * 0.64),
      savingsPercent: 64,
      migrationReadiness: totalAssets > 0 ? Math.min(95, Math.round((migrated / totalAssets) * 100 + 40)) : 0,
      riskScore: criticalIssues > 2 ? 'High' : criticalIssues > 0 ? 'Medium' : 'Low',
      criticalIssues,
    },
  })
}))

// GET /api/dashboard/activity
router.get('/activity', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    activity: [
      { id: 1, type: 'migration', message: 'cache-01 migration to AWS ElastiCache completed', time: '2 hours ago', status: 'success' },
      { id: 2, type: 'analysis', message: 'AI analysis completed for 8 servers', time: '4 hours ago', status: 'info' },
      { id: 3, type: 'warning', message: 'legacy-monolith: CentOS 6 end-of-life detected', time: '6 hours ago', status: 'warning' },
      { id: 4, type: 'migration', message: 'Auth Service migration to AWS ECS completed', time: '1 day ago', status: 'success' },
      { id: 5, type: 'upload', message: 'Infrastructure inventory CSV uploaded (23 assets)', time: '2 days ago', status: 'info' },
    ],
  })
}))

// GET /api/dashboard/cost-comparison
router.get('/cost-comparison', asyncHandler(async (req, res) => {
  const db = getDb()
  const all = db.inventory.list(req.user.id)
  const total = all.reduce((s, a) => s + (a.cost || 0), 0)
  const projected = Math.round(total * 0.36)

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  const data = months.map((month, i) => ({
    month,
    current: total + Math.round((Math.random() - 0.5) * 500),
    projected: Math.round(projected - i * projected * 0.02),
  }))

  res.json({ success: true, data })
}))

module.exports = router
