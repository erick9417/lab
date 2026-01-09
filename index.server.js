/**
 * Production Server - Full API + SPA Frontend
 */

import express from 'express'
import cors from 'cors'
import compression from 'compression'
import dotenv from 'dotenv'
import backupRouter from './backend/routes/backup.js'
import uploadsRouter from './backend/routes/uploads.js'
import requestsRouter from './backend/routes/requests.js'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

dotenv.config()

const app = express()
app.use(cors())
app.use(compression())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate')
  next()
})

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use((req, res, next) => {
  req.setTimeout(30000)
  res.setTimeout(30000)
  next()
})

app.get('/health', (req, res) => res.json({ status: 'ok' }))

// File uploads routes
app.use('/api/uploads', uploadsRouter)

// Backup routes MUST come BEFORE the generic /api handler
app.use('/api/backups', backupRouter)

// Requests routes with file uploads
app.use('/api/requests', requestsRouter)

// Other API routes
app.get('/api/patients', (req, res) => res.json([]))
app.post('/api/patients', (req, res) => {
  const { name } = req.body
  if (!name) return res.status(400).json({ error: 'Nombre requerido' })
  res.status(201).json({ id: Math.random(), name, created_at: new Date() })
})
app.put('/api/patients/:id', (req, res) => {
  const { name } = req.body
  if (!name) return res.status(400).json({ error: 'Nombre requerido' })
  res.json({ id: req.params.id, name })
})
app.delete('/api/patients/:id', (req, res) => res.json({ success: true }))

app.get('/api/users', (req, res) => res.json([]))
app.post('/api/users', (req, res) => {
  const { email, role } = req.body
  if (!email || !role) return res.status(400).json({ error: 'Campos requeridos' })
  res.status(201).json({ id: Math.random(), email, role })
})

app.get('/api/clinics', (req, res) => res.json([]))
app.post('/api/clinics', (req, res) => {
  const { name } = req.body
  if (!name) return res.status(400).json({ error: 'Nombre requerido' })
  res.status(201).json({ id: Math.random(), name })
})


// 404 handler for unknown API routes (MUST be last)
app.use('/api', (req, res) => res.status(404).json({ error: 'API endpoint not found' }))

const clientDist = path.join(__dirname, 'dist')
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist))
  app.use((req, res) => res.sendFile(path.join(clientDist, 'index.html')))
}

const port = process.env.PORT || 4000
const server = app.listen(port, () => console.log(`Server on port ${port}`))
server.timeout = 30000
server.keepAliveTimeout = 65000
