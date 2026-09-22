/**
 * Prep Atlas — local API.
 *
 * Deliberately unauthenticated: it binds to the loopback interfaces only
 * (127.0.0.1 and ::1) and is meant to run on the same machine as the browser.
 * Do NOT expose this to a network.
 *
 * Storage: one MongoDB collection, one document per topic.
 *   { _id: topicId, completed, completedAt, note, code, lang,
 *     flaggedForReview, updatedAt }
 *
 * Run:  node server/server.js        (or: npm run server, from the repo root)
 */

import http from 'http'
import express from 'express'
import cors from 'cors'
import { MongoClient } from 'mongodb'

const PORT = Number(process.env.PORT || 4000)
const HOST = process.env.HOST || '127.0.0.1'
const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017'
const DB_NAME = process.env.DB_NAME || 'prep_atlas'
const COLLECTION = 'topic_state'

/* ------------------------------------------------------------------ */
/* Mongo connection, with background retry so the server still starts  */
/* if Mongo happens to be down.                                        */
/* ------------------------------------------------------------------ */

let client = null
let collection = null
let dbReady = false

async function connectMongo() {
  try {
    client = new MongoClient(MONGO_URL, { serverSelectionTimeoutMS: 3000 })
    await client.connect()
    await client.db(DB_NAME).command({ ping: 1 })

    collection = client.db(DB_NAME).collection(COLLECTION)
    await collection.createIndex({ flaggedForReview: 1 })
    await collection.createIndex({ completed: 1 })

    dbReady = true
    console.log(`  ✓ MongoDB connected  ${MONGO_URL}/${DB_NAME}`)
  } catch (err) {
    dbReady = false
    console.error(`  ✗ MongoDB unreachable (${err.message}). Retrying in 5s…`)
    console.error(`    Is mongod running? Try:  mongod --dbpath <your-data-dir>`)
    setTimeout(connectMongo, 5000)
  }
}

/* ------------------------------------------------------------------ */

const app = express()

// Chrome/Edge "Private Network Access": a page served from a public origin
// (the GitHub Pages site) calling a loopback address must be granted
// permission ON THE PREFLIGHT, or the request is blocked.
//
// This must run BEFORE cors(), because cors() answers the OPTIONS preflight
// itself and ends the response — anything registered after it never runs for
// a preflight, so the header would be missing exactly where it is needed.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Private-Network', 'true')
  next()
})

app.use(cors())                          // local-only; any origin is fine
app.use(express.json({ limit: '2mb' }))  // scratchpads can get long

function requireDb(req, res, next) {
  if (!dbReady || !collection) {
    return res.status(503).json({ error: 'Database not connected' })
  }
  next()
}

/** Only these fields can be written. Anything else in the body is ignored. */
const WRITABLE = new Set([
  'completed', 'completedAt', 'note', 'code', 'lang', 'flaggedForReview',
])

app.get('/api/health', (req, res) => {
  if (!dbReady) return res.status(503).json({ ok: false, db: false })
  res.json({ ok: true, db: true, database: DB_NAME })
})

app.get('/api/state', requireDb, async (req, res, next) => {
  try {
    const items = await collection.find({}).toArray()
    res.json({ items })
  } catch (e) { next(e) }
})

app.get('/api/state/:topicId', requireDb, async (req, res, next) => {
  try {
    const item = await collection.findOne({ _id: req.params.topicId })
    res.json({ item: item || null })
  } catch (e) { next(e) }
})

app.put('/api/state/:topicId', requireDb, async (req, res, next) => {
  try {
    const topicId = String(req.params.topicId)
    if (!topicId || topicId.length > 200) {
      return res.status(400).json({ error: 'Invalid topic id' })
    }

    const patch = {}
    for (const [key, value] of Object.entries(req.body || {})) {
      if (WRITABLE.has(key)) patch[key] = value
    }
    patch.updatedAt = new Date().toISOString()

    const result = await collection.findOneAndUpdate(
      { _id: topicId },
      { $set: patch, $setOnInsert: { createdAt: new Date().toISOString() } },
      { upsert: true, returnDocument: 'after' }
    )
    res.json({ item: result.value ?? result })
  } catch (e) { next(e) }
})

app.delete('/api/state/:topicId', requireDb, async (req, res, next) => {
  try {
    await collection.deleteOne({ _id: req.params.topicId })
    res.json({ ok: true })
  } catch (e) { next(e) }
})

/** Everything flagged for review — the endpoint Claude reads. */
app.get('/api/review-queue', requireDb, async (req, res, next) => {
  try {
    const items = await collection
      .find({ flaggedForReview: true })
      .sort({ updatedAt: -1 })
      .toArray()
    res.json({ count: items.length, items })
  } catch (e) { next(e) }
})

/** Full dump — for backups, or for pasting into a conversation. */
app.get('/api/export', requireDb, async (req, res, next) => {
  try {
    const items = await collection.find({}).toArray()
    res.json({ exportedAt: new Date().toISOString(), count: items.length, items })
  } catch (e) { next(e) }
})

app.get('/api/stats', requireDb, async (req, res, next) => {
  try {
    const [completed, flagged, withNotes, total] = await Promise.all([
      collection.countDocuments({ completed: true }),
      collection.countDocuments({ flaggedForReview: true }),
      collection.countDocuments({ note: { $nin: [null, ''] } }),
      collection.countDocuments({}),
    ])
    res.json({ completed, flagged, withNotes, touched: total })
  } catch (e) { next(e) }
})

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled:', err)
  res.status(500).json({ error: 'Internal error' })
})

/* ------------------------------------------------------------------ */

await connectMongo()

// On Windows, `localhost` resolves to ::1 (IPv6) BEFORE 127.0.0.1. Binding
// only the IPv4 loopback means the browser's first attempt is refused, which
// shows up as ERR_CONNECTION_REFUSED even though the server is running.
// Bind both loopback addresses — still loopback only, never the network.
const HOSTS = process.env.HOST ? [process.env.HOST] : ['127.0.0.1', '::1']
const servers = []

for (const host of HOSTS) {
  const server = http.createServer(app)

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`  ✗ Port ${PORT} is already in use. Stop the other process, or set PORT.`)
      process.exit(1)
    }
    // A machine with IPv6 disabled simply skips ::1 — not fatal.
    if (err.code === 'EAFNOSUPPORT' || err.code === 'EADDRNOTAVAIL') {
      console.warn(`  · skipped ${host} (not available on this machine)`)
      return
    }
    throw err
  })

  server.listen(PORT, host, () => {
    const shown = host.includes(':') ? `[${host}]` : host
    console.log(`  → http://${shown}:${PORT}`)
  })
  servers.push(server)
}

console.log('')
console.log('  Prep Atlas API')
console.log(`  → health:  http://localhost:${PORT}/api/health`)
console.log(`  → review:  http://localhost:${PORT}/api/review-queue`)
console.log('')

async function shutdown() {
  console.log('\n  Shutting down…')
  await Promise.allSettled(servers.map((s) => new Promise((r) => s.close(r))))
  try { await client?.close() } catch { /* ignore */ }
  process.exit(0)
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
