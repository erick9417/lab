#!/bin/bash
# Fix para que /uploads no sea capturado por el wildcard del SPA

cd /home/lucvan5/server-pro/src

# Backup
cp index.js index.js.backup-uploads-fix

# Aplicar fix
cat > index.js.tmp << 'EOF'
import express from 'express'
import cors from 'cors'
import compression from 'compression'
import dotenv from 'dotenv'
import authRouter from './routes/auth.js'
import usersRouter from './routes/users.js'
import clinicsRouter from './routes/clinics.js'
import requestsRouter from './routes/requests.js'
import patientsRouter from './routes/patients.js'
import backupsRouter from './routes/backups.js'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

dotenv.config()

const app = express()
app.use(cors())
app.use(compression())
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ limit: '1mb', extended: true }))

// Evita cache en las respuestas de la API
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  res.set('Pragma', 'no-cache')
  res.set('Expires', '0')
  res.set('Surrogate-Control', 'no-store')
  next()
})

// Directorio de uploads - ANTES de las rutas API
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadDir = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })
app.use('/uploads', express.static(uploadDir))

// Timeouts para evitar conexiones largas
app.use((req, res, next) => {
  req.setTimeout(30000)
  res.setTimeout(30000)
  next()
})

app.get('/health', (req, res) => res.json({ status: 'ok' }))
app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/clinics', clinicsRouter)
app.use('/api/requests', requestsRouter)
app.use('/api/patients', patientsRouter)
app.use('/api/backups', backupsRouter)

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err.message)
  console.trace(err)
  res.status(500).json({ error: 'Error interno del servidor' })
})

// Serve frontend if built (single-page app)
try {
  const clientDist = path.join(__dirname, '../../lucvan-sistema/dist')
  if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist))
    // SPA fallback - EXCLUYE /uploads y /api para que no interfiera
    app.get('*', (req, res, next) => {
      // Si la ruta es para uploads o api, dejar que siga al siguiente handler
      if (req.path.startsWith('/uploads/') || req.path.startsWith('/api/')) {
        return next()
      }
      res.sendFile(path.join(clientDist, 'index.html'))
    })
  }
} catch (e) {
  console.warn('Static client not served:', e.message)
}

const port = process.env.PORT || 4000
const server = app.listen(port, () => {
  console.log(`API escuchando en puerto ${port}`)
})

// Timeouts del servidor
server.timeout = 30000
server.keepAliveTimeout = 65000
EOF

# Reemplazar
mv index.js.tmp index.js

echo "✅ Fix aplicado. Reinicia el servidor con: pkill -f 'node src/index.js' && nohup node src/index.js >> ../server.log 2>&1 &"
