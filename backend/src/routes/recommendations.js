const express = require('express')
const { authenticate } = require('../middleware/auth')
const { asyncHandler } = require('../middleware/errorHandler')
const { getDb } = require('../models/db')

const router = express.Router()
router.use(authenticate)

function buildRecommendation(item) {
  let strategy = 'rehost'
  if (item.os?.includes('CentOS 6') || item.name?.includes('legacy-monolith')) strategy = 'retire'
  else if (item.engine?.includes('Oracle') || item.type === 'Application') strategy = 'replatform'
  else if (item.instances > 2) strategy = 'refactor'

  const savingsPct = { retire: 100, replatform: 65, refactor: 60, rehost: 45 }[strategy]
  const current = item.cost || 0
  const projected = strategy === 'retire' ? 0 : Math.round(current * (1 - savingsPct / 100))

  const targetMap = {
    Server: { retire: 'Decommission', replatform: 'AWS EC2 Auto Scaling', rehost: 'AWS EC2', refactor: 'ECS Fargate' },
    Database: { replatform: item.engine?.includes('Oracle') ? 'Amazon Aurora PostgreSQL' : 'Amazon RDS Multi-AZ', rehost: 'Amazon RDS', retire: 'Decommission' },
    Application: { replatform: 'AWS ECS Fargate', refactor: 'ECS + RDS + ElastiCache', rehost: 'EC2' },
    Network: { replatform: 'AWS ALB + CloudFront', rehost: 'AWS NLB', retire: 'Decommission' },
  }

  return {
    id: `rec_${item.id}`,
    assetId: item.id,
    assetName: item.name,
    assetType: item.type,
    strategy,
    targetPlatform: strategy === 'retire' ? 'N/A' : 'AWS',
    targetService: targetMap[item.type]?.[strategy] || 'AWS Cloud Service',
    currentCost: current,
    projectedCost: projected,
    savings: current - projected,
    savingsPercent: savingsPct,
    risk: { retire: 'low', rehost: 'low', replatform: item.type === 'Database' ? 'high' : 'medium', refactor: 'high' }[strategy],
    effort: { retire: 'low', rehost: 'low', replatform: 'medium', refactor: 'high' }[strategy],
    timeframe: { retire: '2-4 weeks', rehost: '2-6 weeks', replatform: '4-12 weeks', refactor: '3-6 months' }[strategy],
  }
}

// GET /api/recommendations
router.get('/', asyncHandler(async (req, res) => {
  const db = getDb()
  const items = db.inventory.list(req.user.id).filter((i) => i.migration_status !== 'migrated')
  const recommendations = items.map(buildRecommendation)
  const totalSavings = recommendations.reduce((s, r) => s + r.savings, 0)
  res.json({ success: true, recommendations, totalSavings, count: recommendations.length })
}))

// POST /api/recommendations/analyze
router.post('/analyze', asyncHandler(async (req, res) => {
  await new Promise((r) => setTimeout(r, 1500))
  const db = getDb()
  const items = db.inventory.list(req.user.id)
  const recommendations = items.map(buildRecommendation)
  res.json({ success: true, recommendations, message: 'Analysis complete', analysisTime: '1.5s' })
}))

// GET /api/recommendations/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const db = getDb()
  const assetId = req.params.id.replace('rec_', '')
  const item = db.inventory.findById(assetId, req.user.id)
  if (!item) return res.status(404).json({ success: false, message: 'Not found' })
  res.json({ success: true, recommendation: buildRecommendation(item) })
}))

module.exports = router
