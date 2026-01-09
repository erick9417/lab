import express from 'express'
import cors from 'cors'
import compression from 'compression'
import dotenv from 'dotenv'
import mysql from 'mysql2/promise'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

dotenv.config()

const app = express()
app.use(cors())
app.use(compression())
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ limit: '1mb', extended: true }))

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

// Database pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

// Timeouts
app.use((req, res, next) => {
  req.setTimeout(30000)
  res.setTimeout(30000)
  next()
})

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }))

// ===== AUTH ROUTES =====
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body
  try { console.log('[AUTH] Content-Type:', req.headers['content-type']); console.log('[AUTH] Body typeof:', typeof req.body, 'body:', req.body); } catch {}
  if (!email || !password) {
    return res.status(400).json({ error: 'Por favor ingrese email y contraseña' })
  }
  
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, password_hash, role, clinic_id, must_change_password FROM users WHERE email = ?',
      [email]
    )
    
    const user = rows[0]
    if (!user) {
      return res.status(401).json({ error: 'Usuario o contraseña inválidos' })
    }
    
    const ok = await bcrypt.compare(password, user.password_hash)
    if (!ok) {
      return res.status(401).json({ error: 'Usuario o contraseña inválidos' })
    }

    const token = jwt.sign(
      { uid: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    )
    
    const mustChangePassword = !!user.must_change_password

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        clinicId: user.clinic_id,
        mustChangePassword
      }
    })
  } catch (e) {
    console.error('[AUTH] Login error:', e && e.message ? e.message : e)
    if (e && e.stack) console.error(e.stack)
    res.status(500).json({ error: 'Error en el servidor. Intente nuevamente' })
  }
})

// ===== USERS ROUTES =====
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, role, clinic_id, created_at FROM users ORDER BY created_at DESC')
    res.json(rows)
  } catch (e) {
    console.error('[USERS] List error:', e)
    res.status(500).json({ error: 'Error al obtener usuarios' })
  }
})

// ===== CLINICS ROUTES =====
app.get('/api/clinics', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clinics ORDER BY name')
    res.json(rows)
  } catch (e) {
    console.error('[CLINICS] List error:', e)
    res.status(500).json({ error: 'Error al obtener clínicas' })
  }
})

// ===== PATIENTS ROUTES =====
app.get('/api/patients', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM patients ORDER BY created_at DESC')
    res.json(rows)
  } catch (e) {
    console.error('[PATIENTS] List error:', e)
    res.status(500).json({ error: 'Error al obtener pacientes' })
  }
})

// ===== REQUESTS ROUTES =====
app.get('/api/requests', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT r.*, p.name as patient_name, c.name as clinic_name
      FROM requests r
      LEFT JOIN patients p ON r.patient_id = p.id
      LEFT JOIN clinics c ON r.clinic_id = c.id
      ORDER BY r.created_at DESC
    `)
    res.json(rows)
  } catch (e) {
    console.error('[REQUESTS] List error:', e)
    res.status(500).json({ error: 'Error al obtener solicitudes' })
  }
})

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message)
  res.status(500).json({ error: 'Error interno del servidor' })
})

// Serve SPA
const clientDist = path.join(__dirname, 'dist')
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist))
  app.use((req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'))
  })
} else {
  console.warn('Frontend dist not found at', clientDist)
}

const port = process.env.PORT || 4000
const server = app.listen(port, () => {
  console.log(`✅ API listening on port ${port}`)
  console.log(`   Mode: ${process.env.NODE_ENV || 'development'}`)
  console.log(`   Database: ${process.env.DB_NAME}`)
  console.log(`   Time: ${new Date().toISOString()}`)
})

server.timeout = 30000
server.keepAliveTimeout = 65000
