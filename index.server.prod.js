/**
 * Production Server - Servir React SPA + API
 * - React frontend served on /
 * - API endpoints on /api/*
 */

import express from 'express'
import cors from 'cors'
import compression from 'compression'
import dotenv from 'dotenv'
import backupRouter from './backend/routes/backup.js'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

dotenv.config()

const app = express()
app.use(cors())
app.use(compression())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

// Cache control
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  res.set('Pragma', 'no-cache')
  res.set('Expires', '0')
  res.set('Surrogate-Control', 'no-store')
  next()
})

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Timeouts
app.use((req, res, next) => {
  req.setTimeout(30000)
  res.setTimeout(30000)
  next()
})

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }))

// ===== BACKUP ROUTES =====
app.use('/api/backups', backupRouter)

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message)
  res.status(500).json({ error: 'Error interno del servidor' })
})

// Serve frontend
const clientDist = path.join(__dirname, 'dist')
if (fs.existsSync(clientDist)) {
  console.log('Serving frontend from:', clientDist)
  app.use(express.static(clientDist, { maxAge: '1d' }))
  
  // SPA fallback - serve index.html for all unmatched routes
  app.use((req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'))
  })
} else {
  console.warn('Frontend dist not found at', clientDist)
  app.use((req, res) => {
    res.status(404).json({ error: 'Frontend not built. Run npm run build.' })
  })
}

const port = process.env.PORT || 4000
const server = app.listen(port, () => {
  console.log(`✅ Server listening on port ${port}`)
  console.log(`   Frontend: file://${clientDist}`)
  console.log(`   Backups: ${process.env.BACKUP_DIR || 'default'}`)
})

server.timeout = 30000
server.keepAliveTimeout = 65000
