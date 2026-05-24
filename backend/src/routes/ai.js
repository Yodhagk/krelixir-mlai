const express = require('express')
const { v4: uuidv4 } = require('uuid')
const { authenticate } = require('../middleware/auth')
const { asyncHandler } = require('../middleware/errorHandler')
const { getDb } = require('../models/db')

const router = express.Router()
router.use(authenticate)

let openaiClient = null
function getOpenAI() {
  const key = process.env.OPENAI_API_KEY
  if (!key || !key.startsWith('sk-')) return null   // placeholder or missing — use mock
  if (!openaiClient) {
    const OpenAI = require('openai')
    openaiClient = new OpenAI({ apiKey: key })
  }
  return openaiClient
}

function buildSystemPrompt(ctx) {
  return `You are an expert AI migration consultant for Krelixir.ai.
Help plan and execute cloud migrations (AWS/Azure/GCP).
Focus on: cost optimization, risk assessment, migration strategy (Rehost/Replatform/Refactor/Retire), IaC generation.

Current infrastructure: ${ctx.total} assets, $${ctx.totalCost.toLocaleString()}/month spend, ${ctx.criticalCount} critical issues, ${ctx.migratedCount} already migrated.
Top assets: ${JSON.stringify(ctx.topAssets)}

Be specific, actionable, and format with markdown. Provide cost estimates. Flag security/EOL issues immediately.`
}

function mockResponse(message, stats) {
  const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
  const lower = message.toLowerCase()

  if (lower.includes('cost') || lower.includes('saving')) {
    return `## Cost Optimization Opportunities\n\nCurrent monthly spend: **${fmt(stats.totalCost)}**\nPost-migration estimate: **${fmt(stats.totalCost * 0.36)}**\nAnnual savings: **${fmt(stats.totalCost * 0.64 * 12)}**\n\n**Top 3 opportunities:**\n1. **Oracle DB → Aurora PostgreSQL** — 75% savings (~$6,400/mo)\n2. **Web servers → EC2 Auto Scaling** — 62% savings (~$1,120/mo)\n3. **Legacy monolith retirement** — 100% savings (~$2,400/mo)`
  }
  if (lower.includes('risk') || lower.includes('critical')) {
    return `## Risk Assessment\n\n**${stats.criticalCount} critical/warning issues** require immediate attention.\n\n🔴 **High Priority**\n- CentOS 6 EOL server — active security vulnerability\n- Oracle 19c licensing risk — $8,500/month exposure\n\n🟡 **Medium Priority**\n- Worker nodes at high CPU utilization\n- Payment gateway PCI-DSS scope review needed\n\n**Recommended:** Retire EOL software first to reduce attack surface.`
  }
  if (lower.includes('summar') || lower.includes('overview') || lower.includes('status')) {
    return `## Infrastructure Summary\n\n**${stats.total} total assets** under management\n- 💰 Monthly spend: **${fmt(stats.totalCost)}**\n- 🎯 Post-migration: **${fmt(stats.totalCost * 0.36)}**\n- ✅ Migrated: **${stats.migratedCount}** of ${stats.total}\n- ⚠️ Critical issues: **${stats.criticalCount}**\n\n**Migration Readiness: 72%** — You're well-positioned to begin the migration journey.\n\nShall I generate a phased migration roadmap?`
  }
  if (lower.includes('terraform') || lower.includes('code') || lower.includes('script')) {
    return `## Terraform — web-prod-01 → AWS EC2\n\n\`\`\`hcl\nresource "aws_launch_template" "web" {\n  name_prefix   = "web-prod-"\n  image_id      = "ami-0abcdef1234567890"\n  instance_type = "t3.xlarge"\n}\n\nresource "aws_autoscaling_group" "web" {\n  name             = "web-prod-asg"\n  min_size         = 2\n  max_size         = 8\n  desired_capacity = 3\n  launch_template {\n    id      = aws_launch_template.web.id\n    version = "$Latest"\n  }\n}\n\`\`\`\n\n**Estimated cost:** ~$680/month vs $1,800 on-prem (62% savings)`
  }
  if (lower.includes('first') || lower.includes('order') || lower.includes('sequence') || lower.includes('plan')) {
    return `## Recommended Migration Sequence\n\n**Phase 1 — Quick Wins (Month 1-2) 🟢**\n1. Retire \`legacy-monolith\` → saves $2,400/mo\n2. \`cache-01\` already migrated ✅\n\n**Phase 2 — Core Services (Month 2-4) 🟡**\n3. \`web-prod-01\` → EC2 Auto Scaling → saves $1,120/mo\n4. \`session-mongo\` → DocumentDB → saves ~$200/mo\n\n**Phase 3 — Data Migration (Month 4-7) 🔴**\n5. \`analytics-pg\` → Aurora PostgreSQL\n6. \`prod-mysql-master\` → RDS Multi-AZ\n7. \`legacy-oracle\` → Aurora PostgreSQL → saves $6,400/mo\n\n**Total timeline:** 8-10 months | **Annual savings: ${fmt(stats.totalCost * 0.64 * 12)}**`
  }

  return `I've analyzed your **${stats.total}-asset** infrastructure with **${fmt(stats.totalCost)}/month** spend.\n\nBased on your query, I recommend prioritizing your **highest-impact migration opportunities** — starting with low-risk quick wins.\n\nYour environment shows a **64% cost reduction potential** (~${fmt(stats.totalCost * 0.64 * 12)}/year in savings).\n\nWould you like me to:\n1. 📊 Generate a detailed migration roadmap?\n2. ⚠️ List the highest-risk items?\n3. 💻 Create Terraform/IaC for a specific service?\n4. 💰 Detailed cost breakdown by service?`
}

// POST /api/ai/chat
router.post('/chat', asyncHandler(async (req, res) => {
  const { message } = req.body
  if (!message?.trim()) return res.status(400).json({ success: false, message: 'Message required' })

  const db = getDb()
  const allItems = db.inventory.list(req.user.id)
  const stats = {
    total: allItems.length,
    totalCost: allItems.reduce((s, i) => s + (i.cost || 0), 0),
    criticalCount: allItems.filter((i) => i.status === 'critical' || i.status === 'warning').length,
    migratedCount: allItems.filter((i) => i.migration_status === 'migrated').length,
    topAssets: allItems.slice(0, 5).map((i) => ({ name: i.name, type: i.type, cost: i.cost })),
  }

  let aiResponse
  const openai = getOpenAI()

  if (openai) {
    const history = db.chat.history(req.user.id, 10).map((c) => ({ role: c.role, content: c.content }))
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [
        { role: 'system', content: buildSystemPrompt(stats) },
        ...history,
        { role: 'user', content: message },
      ],
      max_tokens: 1500,
      temperature: 0.7,
    })
    aiResponse = completion.choices[0].message.content
  } else {
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 800))
    aiResponse = mockResponse(message, stats)
  }

  db.chat.add({ id: uuidv4(), user_id: req.user.id, role: 'user', content: message })
  db.chat.add({ id: uuidv4(), user_id: req.user.id, role: 'assistant', content: aiResponse })

  res.json({ success: true, message: aiResponse, timestamp: new Date().toISOString() })
}))

// GET /api/ai/history
router.get('/history', asyncHandler(async (req, res) => {
  const db = getDb()
  res.json({ success: true, history: db.chat.history(req.user.id) })
}))

// DELETE /api/ai/history
router.delete('/history', asyncHandler(async (req, res) => {
  const db = getDb()
  db.chat.clear(req.user.id)
  res.json({ success: true, message: 'Chat history cleared' })
}))

module.exports = router
