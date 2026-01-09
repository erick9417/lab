/**
 * EJEMPLO: Integración de Backup Automático en index.server.js
 * 
 * Copiar y adaptar estos snippets en tu servidor Express principal
 */

// ======================================
// 1. AGREGAR IMPORTS AL PRINCIPIO
// ======================================
import { setupScheduledJobs, cancelScheduledJobs } from './scheduler.js'
import backupRouter from './routes/backup.js'  // Si implementas endpoints

// ======================================
// 2. CONFIGURAR SCHEDULER (después de crear app)
// ======================================

const app = express()
// ... middleware y configuración ...

// Inicializar trabajos programados
let scheduledJobs = null

try {
  scheduledJobs = setupScheduledJobs()
  console.log('✅ Scheduled jobs initialized')
} catch (error) {
  console.error('Error initializing scheduler:', error)
}

// ======================================
// 3. AGREGAR RUTA DE BACKUP (opcional)
// ======================================

app.use('/api/backup', backupRouter)

// ======================================
// 4. GRACEFUL SHUTDOWN
// ======================================

const port = process.env.PORT || 4000
const server = app.listen(port, () => {
  console.log(`API escuchando en puerto ${port}`)
})

// Manejar SIGTERM para shutdown limpio
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  if (scheduledJobs) {
    cancelScheduledJobs(scheduledJobs)
  }
  server.close(() => {
    console.log('HTTP server closed')
    process.exit(0)
  })
})

// Manejar errores no capturados
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  process.exit(1)
})

// Timeouts
server.timeout = 30000
server.keepAliveTimeout = 65000

// ======================================
// ESTRUCTURA COMPLETA EJEMPLO (si partes de cero)
// ======================================

/*
import express from 'express'
import cors from 'cors'
import compression from 'compression'
import dotenv from 'dotenv'
import { setupScheduledJobs, cancelScheduledJobs } from './scheduler.js'

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(compression())
app.use(express.json({ limit: '1mb' }))

// Setup scheduler ANTES de iniciar servidor
let scheduledJobs = null
try {
  scheduledJobs = setupScheduledJobs()
  console.log('✅ Backup scheduler initialized')
} catch (error) {
  console.error('Error initializing scheduler:', error)
}

// Rutas
app.get('/health', (req, res) => res.json({ status: 'ok' }))
// ... más rutas ...

// Graceful shutdown
const port = process.env.PORT || 4000
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

process.on('SIGTERM', () => {
  if (scheduledJobs) {
    cancelScheduledJobs(scheduledJobs)
  }
  server.close(() => process.exit(0))
})
*/
