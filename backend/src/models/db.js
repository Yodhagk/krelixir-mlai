/**
 * Pure-JS JSON file store — drop-in replacement for better-sqlite3.
 * No native compilation required. Sync reads/writes via fs.
 */
const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')

const DATA_DIR = path.join(__dirname, '../../../data')
const STORE_PATH = path.join(DATA_DIR, 'krelixir.json')

// ── In-memory tables ──────────────────────────────────────────────────────────
const store = {
  users: [],
  inventory: [],
  chat_history: [],
}

function _load() {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const saved = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'))
      Object.assign(store, saved)
    }
  } catch (e) {
    console.warn('[DB] Could not load store, starting fresh:', e.message)
  }
}

function _save() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
    fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2))
  } catch (e) {
    console.error('[DB] Save failed:', e.message)
  }
}

// ── Public CRUD helpers (used by routes) ──────────────────────────────────────
const db = {
  // ── Users ──────────────────────────────────────────────────────────────────
  users: {
    findByEmail: (email) =>
      store.users.find((u) => u.email === email.toLowerCase()) || null,

    findById: (id) =>
      store.users.find((u) => u.id === id) || null,

    create: (user) => {
      const record = {
        ...user,
        email: user.email.toLowerCase(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      store.users.push(record)
      _save()
      return record
    },

    update: (id, updates) => {
      const idx = store.users.findIndex((u) => u.id === id)
      if (idx === -1) return null
      store.users[idx] = { ...store.users[idx], ...updates, updated_at: new Date().toISOString() }
      _save()
      const { password: _, ...safe } = store.users[idx]
      return safe
    },
  },

  // ── Inventory ──────────────────────────────────────────────────────────────
  inventory: {
    list: (userId, { type, status, search } = {}) => {
      let items = store.inventory.filter((i) => i.user_id === userId)
      if (type) items = items.filter((i) => i.type === type)
      if (status) items = items.filter((i) => i.status === status)
      if (search) {
        const q = search.toLowerCase()
        items = items.filter(
          (i) =>
            i.name.toLowerCase().includes(q) ||
            (i.region || '').toLowerCase().includes(q) ||
            (i.os || i.engine || i.stack || '').toLowerCase().includes(q)
        )
      }
      return items.sort((a, b) => (b.cost || 0) - (a.cost || 0))
    },

    findById: (id, userId) =>
      store.inventory.find((i) => i.id === id && i.user_id === userId) || null,

    create: (item) => {
      const record = {
        ...item,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      store.inventory.push(record)
      _save()
      return record
    },

    update: (id, userId, updates) => {
      const idx = store.inventory.findIndex((i) => i.id === id && i.user_id === userId)
      if (idx === -1) return null
      store.inventory[idx] = {
        ...store.inventory[idx],
        ...updates,
        updated_at: new Date().toISOString(),
      }
      _save()
      return store.inventory[idx]
    },

    delete: (id, userId) => {
      const idx = store.inventory.findIndex((i) => i.id === id && i.user_id === userId)
      if (idx === -1) return false
      store.inventory.splice(idx, 1)
      _save()
      return true
    },

    bulkCreate: (items) => {
      store.inventory.push(...items)
      _save()
      return items.length
    },
  },

  // ── Chat history ───────────────────────────────────────────────────────────
  chat: {
    history: (userId, limit = 20) =>
      store.chat_history
        .filter((c) => c.user_id === userId)
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        .slice(-limit),

    add: (msg) => {
      const record = { ...msg, created_at: new Date().toISOString() }
      store.chat_history.push(record)
      // Cap per-user history at 200 messages
      const userMsgs = store.chat_history.filter((c) => c.user_id === msg.user_id)
      if (userMsgs.length > 200) {
        const oldest = userMsgs[0].id
        store.chat_history = store.chat_history.filter((c) => c.id !== oldest)
      }
      _save()
      return record
    },

    clear: (userId) => {
      store.chat_history = store.chat_history.filter((c) => c.user_id !== userId)
      _save()
    },
  },
}

// ── Init + seed ───────────────────────────────────────────────────────────────
async function initDatabase() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  _load()

  // Seed demo user once
  if (!db.users.findByEmail('demo@krelixir.ai')) {
    const hashedPassword = await bcrypt.hash('demo1234', 10)
    const userId = uuidv4()
    db.users.create({
      id: userId,
      name: 'Demo User',
      email: 'demo@krelixir.ai',
      password: hashedPassword,
      role: 'admin',
      company: 'Krelixir Demo',
    })

    const { sampleData } = require('../data/sampleData')
    const items = sampleData.map((item) => ({
      ...item,
      user_id: userId,
      tags: item.tags || [],
      metadata: item.metadata || {},
    }))
    db.inventory.bulkCreate(items)
    console.log('✓ Demo user and 23 sample assets seeded')
  }

  console.log(`✓ JSON store loaded — ${store.users.length} users, ${store.inventory.length} assets`)
}

function getDb() {
  return db
}

module.exports = { getDb, initDatabase }
