require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const compression = require('compression')
const rateLimit = require('express-rate-limit')
const path = require('path')

const authRoutes = require('./src/routes/auth')
const dashboardRoutes = require('./src/routes/dashboard')
const inventoryRoutes = require('./src/routes/inventory')
const recommendationsRoutes = require('./src/routes/recommendations')
const aiRoutes = require('./src/routes/ai')
const { errorHandler } = require('./src/middleware/errorHandler')
const { initDatabase } = require('./src/models/db')

const app = express()
const PORT = process.env.PORT || 5000

// Security middleware
app.use(helmet({ contentSecurityPolicy: false }))
app.use(compression())
app.use(morgan('dev'))

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: { success: false, message: 'Too many requests. Please try again later.' },
})
app.use('/api', limiter)

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/inventory', inventoryRoutes)
app.use('/api/recommendations', recommendationsRoutes)
app.use('/api/ai', aiRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' })
})

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
  })
}

// Error handler (must be last)
app.use(errorHandler)

// Initialize DB and start server
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════╗
║   Krelixir Migration Platform API     ║
║   Running on http://localhost:${PORT}    ║
║   Environment: ${process.env.NODE_ENV || 'development'}           ║
╚═══════════════════════════════════════╝
    `)
  })
}).catch((err) => {
  console.error('Failed to initialize database:', err)
  process.exit(1)
})

module.exports = app
