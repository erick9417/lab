import express from 'express'
import cors from 'cors'
import compression from 'compression'
import dotenv from 'dotenv'
import mysql from 'mysql2/promise'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { sendWelcomeEmail, sendPasswordResetEmail, sendRequestCreatedEmail } from './backend/services/emailService.js'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import multer from 'multer'
import { saveUploadedFiles } from './backend/services/uploadService.js'
import { createDatabaseBackup, getBackupHistory } from './backend/services/backupService.js'
import { restoreGlobalDatabaseAlternative, validateBackup } from './backend/services/restoreService-alternative.js'
import uploadsRouter from './backend/routes/uploads.js'
import http from 'http'
import { Server } from 'socket.io'

// Manejo global de excepciones ANTES de cualquier código
process.on('uncaughtException', (err) => {
  console.error('❌ [FATAL] Uncaught Exception:', err.message)
  console.error(err.stack)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ [FATAL] Unhandled Rejection:', reason)
  console.error('Promise:', promise)
})

dotenv.config({ path: '.env.local' })
dotenv.config() // Fallback a .env si .env.local no existe

console.log('[ENV] DB_HOST:', process.env.DB_HOST || 'NOT SET')
console.log('[ENV] DB_USER:', process.env.DB_USER || 'NOT SET')
console.log('[ENV] DB_NAME:', process.env.DB_NAME || 'NOT SET')
console.log('[ENV] DB_PORT:', process.env.DB_PORT || '3306')

const app = express()
console.log('[INIT] 1. Express app created')
app.use(cors())
console.log('[INIT] 2. CORS configured')
app.use(compression())
console.log('[INIT] 3. Compression configured')
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ limit: '1mb', extended: true }))
console.log('[INIT] 4. Body parsers configured')

// Create HTTP server and initialize Socket.io
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'http://localhost:4000',
      'https://sistema.lucvanlatam.com'
    ],
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling']
})

// Basic socket handlers
io.on('connection', (socket) => {
  console.log('[SOCKET.IO] Client connected:', socket.id)

  socket.on('authenticate', (userId) => {
    if (userId) {
      console.log(`[SOCKET.IO] Authenticated user ${userId}`)
    }
  })

  socket.on('disconnect', () => {
    console.log('[SOCKET.IO] Client disconnected:', socket.id)
  })
})
console.log('[SOCKET.IO] Initialized')

// Cache control
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  res.set('Pragma', 'no-cache')
  res.set('Expires', '0')
  res.set('Surrogate-Control', 'no-store')
  next()
})
console.log('[INIT] 5. Cache control configured')

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Database pool - solo si hay credenciales configuradas
let pool = null
const hasDBConfig = process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME

if (hasDBConfig) {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  })
}

// Timeouts
app.use((req, res, next) => {
  req.setTimeout(30000)
  res.setTimeout(30000)
  next()
})

// ===== Simple Auth Middleware (JWT) =====
// Agrega req.user con { id, role, clinicId } si hay token válido
app.use(async (req, res, next) => {
  try {
    const auth = req.headers['authorization'] || req.headers['Authorization']
    if (auth && typeof auth === 'string' && auth.startsWith('Bearer ')) {
      const token = auth.slice(7)
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret')
      let clinicId = null
      let role = payload && payload.role ? payload.role : null
      let uid = payload && payload.uid ? payload.uid : null

      let userName = null
      if (hasDBConfig && uid) {
        try {
          const [rows] = await pool.query('SELECT id, role, clinic_id, name, email FROM users WHERE id = ?', [uid])
          console.log('[AUTH] Query result for user', uid, ':', rows?.length > 0 ? 'Found' : 'Not found')
          if (rows && rows[0]) {
            clinicId = rows[0].clinic_id
            role = rows[0].role || role
            // Si name es NULL, usar el email o un valor por defecto
            userName = rows[0].name || rows[0].email?.split('@')[0] || `User${uid}`
            // Normalizar rol a minúsculas para comparaciones
            if (role && typeof role === 'string') {
              role = role.toLowerCase()
            }
            console.log('[AUTH] User authenticated - ID:', uid, 'Role:', role, 'ClinicId:', clinicId, 'Name:', userName)
          } else {
            console.log('[AUTH] User row not found for ID:', uid)
          }
        } catch (e) {
          console.warn('[AUTH] DB lookup failed:', e && e.message ? e.message : e)
        }
      }

      req.user = { id: uid, role, clinicId, name: userName }
    }
  } catch (e) {
    console.warn('[AUTH] Token verify failed:', e && e.message ? e.message : e)
    // Continuar sin req.user
  }
  next()
})

// Configurar multer para archivos en memoria
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
    
    if (allowedMimes.includes(file.mimetype) || file.originalname.match(/\.(pdf|jpg|jpeg|png|webp|doc|docx|xls|xlsx)$/i)) {
      cb(null, true)
    } else {
      cb(new Error('Tipo de archivo no permitido'))
    }
  }
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
    if (!hasDBConfig) {
      console.log('[AUTH] Using mock users (no DB configured)')
      const mockUsers = {
        'admin@lucvanlatam.com': { id: 1, name: 'Admin', email: 'admin@lucvanlatam.com', password: 'admin123', role: 'admin', clinic_id: null },
        'taller@lucvanlatam.com': { id: 2, name: 'Taller', email: 'taller@lucvanlatam.com', password: 'taller123', role: 'workshop', clinic_id: null },
        'produccion@lucvanlatam.com': { id: 3, name: 'Producción', email: 'produccion@lucvanlatam.com', password: 'produccion123', role: 'production', clinic_id: null }
      }
      
      const mockUser = mockUsers[email.toLowerCase()]
      if (!mockUser || mockUser.password !== password) {
        return res.status(401).json({ error: 'Usuario o contraseña inválidos' })
      }
      
      const token = jwt.sign(
        { uid: mockUser.id, role: mockUser.role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '7d' }
      )
      
      return res.json({
        token,
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          role: mockUser.role,
          clinicId: mockUser.clinic_id
        },
        mustChangePassword: false
      })
    }
    
    // Si llegamos aquí, hay DB configurada
    const [rows] = await pool.query(
      'SELECT id, name, email, password_hash, role, clinic_id, disabled, must_change_password FROM users WHERE email = ?',
      [email]
    )
    
    const user = rows[0]
    if (!user) {
      return res.status(401).json({ error: 'Usuario o contraseña inválidos' })
    }

    // Verificar si el usuario está habilitado
    if (user.disabled === true || user.disabled === 1) {
      return res.status(403).json({ 
        error: 'Tu cuenta ha sido deshabilitada. Por favor contacta al administrador en admin@lucvanlatam.com para reactivarla.' 
      })
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
    
    const mustChangePassword = Boolean(user.must_change_password)

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

app.put('/api/auth/change-password', async (req, res) => {
  if (!hasDBConfig) {
    return res.status(503).json({ error: 'Base de datos no configurada' })
  }

  try {
    const { email, currentPassword, newPassword } = req.body || {}

    if (!email || !currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Email, contraseña actual y nueva son requeridos' })
    }

    const [rows] = await pool.query('SELECT id, password_hash FROM users WHERE email = ?', [email])
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    const user = rows[0]
    const valid = await bcrypt.compare(currentPassword, user.password_hash || '')
    if (!valid) {
      return res.status(401).json({ error: 'Contraseña actual incorrecta' })
    }

    const newHash = await bcrypt.hash(newPassword, 10)
    await pool.query(
      'UPDATE users SET password_hash = ?, must_change_password = 0, updated_at = NOW() WHERE id = ?',
      [newHash, user.id]
    )

    res.json({ success: true })
  } catch (e) {
    console.error('[AUTH] Change password error:', e)
    res.status(500).json({ error: 'Error al cambiar la contraseña' })
  }
})

// ===== USERS ROUTES =====
app.get('/api/users', async (req, res) => {
  if (!hasDBConfig) {
    return res.status(503).json({ error: 'Base de datos no configurada' })
  }
  try {
    const [rows] = await pool.query('SELECT id, name, email, role, clinic_id, created_at FROM users ORDER BY created_at DESC')
    res.json(rows)
  } catch (e) {
    console.error('[USERS] List error:', e)
    res.status(500).json({ error: 'Error al obtener usuarios' })
  }
})

// Crear usuario y enviar email de bienvenida
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, password, role, clinic_id, clinicId } = req.body || {}
    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Email, contraseña y rol son requeridos' })
    }

    const clinicIdValue = clinic_id ?? clinicId ?? null
    if (role === 'clinic' && !clinicIdValue) {
      return res.status(400).json({ error: 'Debe seleccionar una clínica para usuarios con rol clínica' })
    }

    let createdUser = { id: Math.floor(Math.random()*1000000), name, email, role, clinicId: clinic_id || null, mustChangePassword: false }

    // Insertar en BD si está configurado
    if (process.env.DB_NAME && process.env.DB_USER) {
      const [exists] = await pool.query('SELECT id FROM users WHERE email = ?', [email])
      if (exists.length > 0) {
        return res.status(409).json({ error: 'El email ya está registrado' })
      }
      const hash = await bcrypt.hash(password, 10)
      const [result] = await pool.query(
        'INSERT INTO users (name, email, password_hash, role, clinic_id, must_change_password, created_at) VALUES (?, ?, ?, ?, ?, 1, NOW())',
        [name || null, email, hash, role, clinicIdValue]
      )
      createdUser.id = result.insertId
      createdUser.mustChangePassword = true
      createdUser.clinicId = clinicIdValue
    }

    const systemUrl = process.env.SYSTEM_URL || `http://localhost:${process.env.PORT || 4000}`
    const emailResult = await sendWelcomeEmail({ email, name }, password, systemUrl)
    if (!emailResult.success && !emailResult.skipped) {
      console.warn('[USERS] Welcome email failed:', emailResult.error)
    }

    res.status(201).json(createdUser)
  } catch (e) {
    console.error('[USERS] Create error:', e)
    res.status(500).json({ error: 'Error creando usuario' })
  }
})

// Actualizar usuario existente
app.put('/api/users/:id', async (req, res) => {
  if (!hasDBConfig) {
    return res.status(503).json({ error: 'Base de datos no configurada' })
  }

  try {
    const userId = req.params.id
    const { name, email, role, clinic_id, disabled, password } = req.body || {}

    // Campos obligatorios básicos
    if (!email || !role) {
      return res.status(400).json({ error: 'Email y rol son requeridos' })
    }

    // Verificar existencia
    const [existing] = await pool.query('SELECT id FROM users WHERE id = ?', [userId])
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    // Prevenir duplicado de email con otro usuario
    const [dup] = await pool.query('SELECT id FROM users WHERE email = ? AND id <> ?', [email, userId])
    if (dup.length > 0) {
      return res.status(409).json({ error: 'El email ya está registrado en otro usuario' })
    }

    const fields = []
    const values = []

    if (name !== undefined) {
      fields.push('name = ?')
      values.push(name)
    }
    if (email !== undefined) {
      fields.push('email = ?')
      values.push(email)
    }
    if (role !== undefined) {
      fields.push('role = ?')
      values.push(role)
    }
    if (clinic_id !== undefined) {
      fields.push('clinic_id = ?')
      values.push(clinic_id || null)
    }
    if (disabled !== undefined) {
      fields.push('disabled = ?')
      values.push(disabled ? 1 : 0)
    }

    if (password) {
      const hash = await bcrypt.hash(password, 10)
      fields.push('password_hash = ?')
      values.push(hash)
      // must_change_password no existe en el esquema actual; se omite
    }

    // Siempre actualizar updated_at
    fields.push('updated_at = NOW()')

    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`
    values.push(userId)

    await pool.query(sql, values)

    res.json({ success: true })
  } catch (e) {
    console.error('[USERS] Update error:', e)
    res.status(500).json({ error: 'Error actualizando usuario' })
  }
})

app.delete('/api/users/:id', async (req, res) => {
  if (!hasDBConfig) {
    return res.status(503).json({ error: 'Base de datos no configurada' })
  }

  try {
    const userId = req.params.id

    // Verificar existencia
    const [existing] = await pool.query('SELECT id FROM users WHERE id = ?', [userId])
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    await pool.query('DELETE FROM users WHERE id = ?', [userId])

    res.json({ success: true })
  } catch (e) {
    console.error('[USERS] Delete error:', e)
    res.status(500).json({ error: 'Error eliminando usuario' })
  }
})

// Deshabilitar/Habilitar usuario
app.patch('/api/users/:id/disable', async (req, res) => {
  if (!hasDBConfig) {
    return res.status(503).json({ error: 'Base de datos no configurada' })
  }

  try {
    const userId = req.params.id
    const { disabled } = req.body || {}
    const targetDisabled = disabled === undefined ? true : !!disabled

    const [existing] = await pool.query('SELECT id FROM users WHERE id = ?', [userId])
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    await pool.query('UPDATE users SET disabled = ?, updated_at = NOW() WHERE id = ?', [targetDisabled ? 1 : 0, userId])

    res.json({ success: true })
  } catch (e) {
    console.error('[USERS] Disable error:', e)
    res.status(500).json({ error: 'Error actualizando estado del usuario' })
  }
})

app.patch('/api/users/:id/enable', async (req, res) => {
  if (!hasDBConfig) {
    return res.status(503).json({ error: 'Base de datos no configurada' })
  }

  try {
    const userId = req.params.id
    const { disabled } = req.body || {}
    const targetDisabled = disabled === undefined ? false : !!disabled

    const [existing] = await pool.query('SELECT id FROM users WHERE id = ?', [userId])
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    await pool.query('UPDATE users SET disabled = ?, updated_at = NOW() WHERE id = ?', [targetDisabled ? 1 : 0, userId])

    res.json({ success: true })
  } catch (e) {
    console.error('[USERS] Enable error:', e)
    res.status(500).json({ error: 'Error actualizando estado del usuario' })
  }
})

// ===== CLINICS ROUTES =====
app.get('/api/clinics', async (req, res) => {
  if (!hasDBConfig) {
    return res.status(503).json({ error: 'Base de datos no configurada' })
  }
  try {
    const [rows] = await pool.query('SELECT * FROM clinics WHERE deleted = 0 OR deleted IS NULL ORDER BY name')
    res.json(rows)
  } catch (e) {
    console.error('[CLINICS] List error:', e)
    res.status(500).json({ error: 'Error al obtener clínicas' })
  }
})

app.post('/api/clinics', async (req, res) => {
  if (!hasDBConfig) {
    return res.status(503).json({ error: 'Base de datos no configurada' })
  }
  try {
    const { name, address, phone, email, country } = req.body || {}
    if (!name) {
      return res.status(400).json({ error: 'El nombre de la clínica es requerido' })
    }

    // Validar que el teléfono solo contenga dígitos y opcionalmente + al inicio (si se proporciona)
    if (phone && !/^\+?\d+$/.test(phone)) {
      return res.status(400).json({ error: 'El teléfono solo debe contener números' })
    }

    const [result] = await pool.query(
      'INSERT INTO clinics (name, address, phone, email, country) VALUES (?, ?, ?, ?, ?)',
      [name, address || null, phone || null, email || null, country || null]
    )

    res.status(201).json({ id: result.insertId, name, address, phone, email, country })
  } catch (e) {
    console.error('[CLINICS] Create error:', e)
    res.status(500).json({ error: 'Error creando clínica' })
  }
})

app.put('/api/clinics/:id', async (req, res) => {
  if (!hasDBConfig) {
    return res.status(503).json({ error: 'Base de datos no configurada' })
  }
  try {
    const id = parseInt(req.params.id)
    const { name, address, phone, email, country } = req.body || {}
    
    if (!id || !name) {
      return res.status(400).json({ error: 'ID y nombre son requeridos' })
    }

    // Validar que el teléfono solo contenga dígitos y opcionalmente + al inicio (si se proporciona)
    if (phone && !/^\+?\d+$/.test(phone)) {
      return res.status(400).json({ error: 'El teléfono solo debe contener números' })
    }

    await pool.query(
      'UPDATE clinics SET name = ?, address = ?, phone = ?, email = ?, country = ? WHERE id = ? AND (deleted = 0 OR deleted IS NULL)',
      [name, address || null, phone || null, email || null, country || null, id]
    )

    res.json({ id, name, address, phone, email, country })
  } catch (e) {
    console.error('[CLINICS] Update error:', e)
    res.status(500).json({ error: 'Error actualizando clínica' })
  }
})

app.delete('/api/clinics/:id', async (req, res) => {
  if (!hasDBConfig) {
    return res.status(503).json({ error: 'Base de datos no configurada' })
  }
  try {
    const id = parseInt(req.params.id)
    const { confirmText } = req.body || {}
    
    if (!id) {
      return res.status(400).json({ error: 'ID inválido' })
    }

    // Verificar texto de confirmación
    if (confirmText !== 'eliminar clinica') {
      return res.status(400).json({ error: 'Texto de confirmación inválido. Debe escribir: eliminar clinica' })
    }

    // Contar pacientes y usuarios asociados
    const [patients] = await pool.query('SELECT COUNT(*) as count FROM patients WHERE clinic_id = ?', [id])
    const [users] = await pool.query('SELECT COUNT(*) as count FROM users WHERE clinic_id = ?', [id])
    const patientCount = patients[0].count
    const userCount = users[0].count

    // Eliminar pacientes primero (CASCADE)
    if (patientCount > 0) {
      await pool.query('DELETE FROM patients WHERE clinic_id = ?', [id])
    }

    // Eliminar usuarios de la clínica
    if (userCount > 0) {
      await pool.query('DELETE FROM users WHERE clinic_id = ?', [id])
    }

    // Finalmente eliminar la clínica
    await pool.query('DELETE FROM clinics WHERE id = ?', [id])
    
    res.json({ 
      success: true, 
      message: `Clínica eliminada exitosamente junto con ${patientCount} paciente(s) y ${userCount} usuario(s)` 
    })
  } catch (e) {
    console.error('[CLINICS] Delete error:', e)
    res.status(500).json({ error: 'Error eliminando clínica' })
  }
})

// Deshabilitar/Habilitar clínica
app.patch('/api/clinics/:id/disable', async (req, res) => {
  if (!hasDBConfig) {
    return res.status(503).json({ error: 'Base de datos no configurada' })
  }

  try {
    const id = parseInt(req.params.id)
    const { disabled } = req.body || {}
    const targetDisabled = disabled === undefined ? true : !!disabled

    if (!id) {
      return res.status(400).json({ error: 'ID inválido' })
    }

    const [existing] = await pool.query('SELECT id FROM clinics WHERE id = ? AND (deleted = 0 OR deleted IS NULL)', [id])
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Clínica no encontrada' })
    }

    await pool.query('UPDATE clinics SET disabled = ?, updated_at = NOW() WHERE id = ?', [targetDisabled ? 1 : 0, id])

    res.json({ success: true })
  } catch (e) {
    console.error('[CLINICS] Disable error:', e)
    res.status(500).json({ error: 'Error actualizando estado de la clínica' })
  }
})

app.patch('/api/clinics/:id/enable', async (req, res) => {
  if (!hasDBConfig) {
    return res.status(503).json({ error: 'Base de datos no configurada' })
  }

  try {
    const id = parseInt(req.params.id)
    const { disabled } = req.body || {}
    const targetDisabled = disabled === undefined ? false : !!disabled

    if (!id) {
      return res.status(400).json({ error: 'ID inválido' })
    }

    const [existing] = await pool.query('SELECT id FROM clinics WHERE id = ? AND (deleted = 0 OR deleted IS NULL)', [id])
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Clínica no encontrada' })
    }

    await pool.query('UPDATE clinics SET disabled = ?, updated_at = NOW() WHERE id = ?', [targetDisabled ? 1 : 0, id])

    res.json({ success: true })
  } catch (e) {
    console.error('[CLINICS] Enable error:', e)
    res.status(500).json({ error: 'Error actualizando estado de la clínica' })
  }
})

// ===== PATIENTS ROUTES =====
app.get('/api/patients', async (req, res) => {
  if (!hasDBConfig) {
    return res.status(503).json({ error: 'Base de datos no configurada' })
  }
  try {
    // Admin y workshop/production pueden ver todos; clinic solo su clínica
    const isAdmin = req.user && req.user.role === 'admin'
    const isWorkshop = req.user && (req.user.role === 'workshop' || req.user.role === 'production')
    const requestedClinicId = req.query.clinic_id || req.query.clinicId

    // Para roles no-admin/workshop, forzar a la clínica del usuario (ignorar query param)
    let clinicId = null
    if (isAdmin || isWorkshop) {
      clinicId = requestedClinicId || null
    } else {
      clinicId = req.user ? req.user.clinicId : null
    }

    console.log('[PATIENTS] GET - User:', req.user?.id, 'Role:', req.user?.role, 'ClinicId:', req.user?.clinicId, 'Requested:', requestedClinicId, 'Final:', clinicId)
    // Si no hay usuario autenticado
    if (!req.user) {
      console.log('[PATIENTS] ERROR - No authenticated user')
      return res.status(401).json({ error: 'No autenticado' })
    }


    if (!isAdmin && !isWorkshop && !clinicId) {
      return res.status(400).json({ error: 'Falta clinic_id: usuario no administrador requiere clínica asociada' })
    }

    let rows = []
    if (clinicId) {
      const [filtered] = await pool.query(
        `SELECT p.*, c.name as clinic_name 
         FROM patients p 
         LEFT JOIN clinics c ON p.clinic_id = c.id 
         WHERE p.clinic_id = ? 
         ORDER BY p.created_at DESC`,
        [clinicId]
      )
      rows = filtered
      console.log('[PATIENTS] Filtered query returned', rows.length, 'patients for clinic', clinicId)
    } else {
      const [all] = await pool.query(
        `SELECT p.*, c.name as clinic_name 
         FROM patients p 
         LEFT JOIN clinics c ON p.clinic_id = c.id 
         ORDER BY p.created_at DESC`
      )
      rows = all
      console.log('[PATIENTS] Admin query returned', rows.length, 'total patients')
    }
    res.json(rows)
  } catch (e) {
    console.error('[PATIENTS] List error:', e)
    res.status(500).json({ error: 'Error al obtener pacientes' })
  }
})

// Obtener paciente por ID
app.get('/api/patients/:id', async (req, res) => {
  if (!hasDBConfig) {
    return res.status(503).json({ error: 'Base de datos no configurada' })
  }

  try {
    const patientId = req.params.id
    const isAdmin = req.user && req.user.role === 'admin'
    const userClinicId = req.user ? req.user.clinicId : null

    const [rows] = await pool.query(
      `SELECT p.*, c.name as clinic_name
       FROM patients p
       LEFT JOIN clinics c ON p.clinic_id = c.id
       WHERE p.id = ?`,
      [patientId]
    )

    if (!rows.length) {
      return res.status(404).json({ error: 'Paciente no encontrado' })
    }

    const patient = rows[0]

    // Si no es admin, validar que el paciente pertenece a su clínica
    if (!isAdmin) {
      if (!userClinicId || patient.clinic_id !== userClinicId) {
        return res.status(403).json({ error: 'No autorizado para ver este paciente' })
      }
    }

    return res.json(patient)
  } catch (e) {
    console.error('[PATIENTS] Get by id error:', e)
    return res.status(500).json({ error: 'Error al obtener paciente' })
  }
})

app.post('/api/patients', async (req, res) => {
  if (!hasDBConfig) {
    return res.status(503).json({ error: 'Base de datos no configurada' })
  }

  try {
    const { name, clinic_id, clinicId, notes } = req.body || {}

    if (!name) {
      return res.status(400).json({ error: 'El nombre del paciente es requerido' })
    }

    const userRole = req.user && req.user.role
    const userClinicId = req.user ? req.user.clinicId : null

    // Solo rol clínica puede crear
    if (userRole !== 'clinic') {
      return res.status(403).json({ error: 'Solo usuarios de clínica pueden crear pacientes' })
    }

    // Forzar a la clínica del usuario
    const clinicIdValue = userClinicId
    if (!clinicIdValue) {
      return res.status(400).json({ error: 'No se puede crear paciente sin clínica asociada al usuario' })
    }
    
    console.log('[PATIENTS] Creating patient:', { name, clinicIdValue, bodyData: { clinic_id, clinicId } })

    const [result] = await pool.query(
      'INSERT INTO patients (name, clinic_id, notes, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
      [name, clinicIdValue, notes || null]
    )

    res.status(201).json({
      id: result.insertId,
      name,
      clinic_id: clinicIdValue,
      notes: notes || null,
      created_at: new Date(),
      updated_at: new Date()
    })
  } catch (e) {
    console.error('[PATIENTS] Create error:', e)
    res.status(500).json({ error: 'Error al crear paciente' })
  }
})

app.put('/api/patients/:id', async (req, res) => {
  if (!hasDBConfig) {
    return res.status(503).json({ error: 'Base de datos no configurada' })
  }

  try {
    const patientId = req.params.id
    const { name, notes } = req.body || {}

    if (!name) {
      return res.status(400).json({ error: 'El nombre del paciente es requerido' })
    }

    const userRole = req.user && req.user.role
    const userClinicId = req.user ? req.user.clinicId : null

    // Solo rol clínica puede editar
    if (userRole !== 'clinic') {
      return res.status(403).json({ error: 'Solo usuarios de clínica pueden modificar pacientes' })
    }

    // Cargar paciente y validar pertenencia
    const [existingRows] = await pool.query('SELECT clinic_id FROM patients WHERE id = ?', [patientId])
    if (!existingRows.length) {
      return res.status(404).json({ error: 'Paciente no encontrado' })
    }
    const targetClinicId = existingRows[0].clinic_id
    if (!userClinicId || targetClinicId !== userClinicId) {
      return res.status(403).json({ error: 'No autorizado para modificar pacientes de otra clínica' })
    }

    await pool.query(
      'UPDATE patients SET name = ?, notes = ?, updated_at = NOW() WHERE id = ?',
      [name, notes || null, patientId]
    )

    res.json({
      id: parseInt(patientId),
      name,
      notes: notes || null,
      updated_at: new Date()
    })
  } catch (e) {
    console.error('[PATIENTS] Update error:', e)
    res.status(500).json({ error: 'Error al actualizar paciente' })
  }
})

app.delete('/api/patients/:id', async (req, res) => {
  if (!hasDBConfig) {
    return res.status(503).json({ error: 'Base de datos no configurada' })
  }

  try {
    const patientId = req.params.id
    const userRole = req.user && req.user.role
    const userClinicId = req.user ? req.user.clinicId : null

    const [existingRows] = await pool.query('SELECT clinic_id FROM patients WHERE id = ?', [patientId])
    if (!existingRows.length) {
      return res.status(404).json({ error: 'Paciente no encontrado' })
    }
    const targetClinicId = existingRows[0].clinic_id

    // Admin puede borrar pacientes huérfanos (sin clínica)
    if (userRole === 'admin') {
      if (targetClinicId === null || targetClinicId === undefined) {
        await pool.query('DELETE FROM patients WHERE id = ?', [patientId])
        return res.json({ success: true, message: 'Paciente huérfano eliminado correctamente' })
      } else {
        return res.status(403).json({ error: 'Solo se pueden eliminar pacientes huérfanos' })
      }
    }

    // Solo rol clínica puede eliminar sus propios pacientes
    if (userRole !== 'clinic') {
      return res.status(403).json({ error: 'Solo usuarios de clínica pueden eliminar pacientes' })
    }

    if (!userClinicId || targetClinicId !== userClinicId) {
      return res.status(403).json({ error: 'No autorizado para eliminar pacientes de otra clínica' })
    }

    await pool.query('DELETE FROM patients WHERE id = ?', [patientId])
    res.json({ success: true, message: 'Paciente eliminado correctamente' })
  } catch (e) {
    console.error('[PATIENTS] Delete error:', e)
    res.status(500).json({ error: 'Error al eliminar paciente' })
  }
})

// ===== BACKUPS ROUTES =====
app.get('/api/backups', (req, res) => {
  try {
    const history = getBackupHistory()

    // Próximo backup a las 3 AM del siguiente día
    const now = new Date()
    const nextBackup = new Date(now)
    nextBackup.setHours(3, 0, 0, 0)
    if (nextBackup <= now) nextBackup.setDate(nextBackup.getDate() + 1)

    res.json({
      success: true,
      backups: history.map((b, idx) => ({
        id: idx + 1,
        filename: b.filename,
        size: b.size,
        sizeFormatted: b.sizeFormatted,
        date: b.date,
        dateFormatted: b.dateFormatted,
        status: 'Completado'
      })),
      status: {
        lastBackup: history.length > 0 ? history[0].date : null,
        nextBackup: nextBackup.toISOString(),
        serverSpace: { used: 0, total: 22, unit: 'GB' },
        cloudSpace: { used: 0, total: 5, unit: 'GB' },
        archiveCount: history.length
      },
      total: history.length
    })
  } catch (error) {
    console.error('[BACKUPS] Error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

app.post('/api/backups/manual', async (req, res) => {
  try {
    // Responder inmediatamente y ejecutar en background
    res.json({ success: true, message: 'Backup iniciado en segundo plano', timestamp: new Date().toISOString() })
    setImmediate(async () => {
      try {
        const result = await createDatabaseBackup()
        if (result.success) {
          console.log('[BACKUP] Manual creado:', result.filename)
        } else {
          console.error('[BACKUP] Error manual:', result.error)
        }
      } catch (e) {
        console.error('[BACKUP] Error inesperado:', e)
      }
    })
  } catch (error) {
    console.error('[BACKUPS] Manual error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

app.get('/api/backups/:id/download', (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const history = getBackupHistory()
    if (isNaN(id) || id < 1 || id > history.length) {
      return res.status(404).json({ error: 'Backup no encontrado' })
    }
    const backup = history[id - 1]
    const backupDir = process.env.BACKUP_DIR || path.join(process.cwd(), '../backups')
    const backupPath = path.join(backupDir, backup.filename)
    if (!fs.existsSync(backupPath)) {
      return res.status(404).json({ error: 'Archivo de backup no encontrado' })
    }
    res.setHeader('Content-Type', 'application/octet-stream')
    res.setHeader('Content-Disposition', `attachment; filename="${backup.filename}"`)
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0')
    res.sendFile(backupPath)
  } catch (error) {
    console.error('[BACKUPS] Download error:', error)
    res.status(500).json({ error: 'Error al descargar backup' })
  }
})

// ===== RESTORE BACKUP =====
app.post('/api/backups/:id/restore', async (req, res) => {
  try {
    if (!hasDBConfig) {
      return res.status(503).json({ error: 'Base de datos no configurada' })
    }

    const id = parseInt(req.params.id)
    const history = getBackupHistory()
    
    if (isNaN(id) || id < 1 || id > history.length) {
      return res.status(404).json({ error: 'Backup no encontrado' })
    }

    const backup = history[id - 1]
    const backupDir = process.env.BACKUP_DIR || path.join(process.cwd(), '../backups')
    const backupPath = path.join(backupDir, backup.filename)

    // Validar que el archivo existe
    if (!fs.existsSync(backupPath)) {
      return res.status(404).json({ error: 'Archivo de backup no encontrado' })
    }

    // Validar que el backup es válido
    console.log('[RESTORE] Validando backup:', backupPath)
    const validation = await validateBackup(backupPath)
    if (!validation.valid) {
      return res.status(400).json({ 
        error: 'Archivo de backup no válido: ' + validation.error 
      })
    }

    // Advertencia: esta operación sobrescribe toda la BD
    console.log('[RESTORE] ⚠️  ADVERTENCIA: Iniciando restauración completa de la base de datos')
    console.log('[RESTORE] Archivo:', backup.filename)
    console.log('[RESTORE] Tamaño:', (validation.fileSize / 1024 / 1024).toFixed(2), 'MB')

    // Responder inmediatamente y ejecutar en background
    res.json({ 
      success: true, 
      message: 'Restauración iniciada. El sistema se reiniciará durante el proceso.',
      backup: backup.filename
    })

    // Ejecutar restauración en background
    setImmediate(async () => {
      try {
        const dbConfig = {
          host: process.env.DB_HOST || 'localhost',
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME
        }

        const result = await restoreGlobalDatabaseAlternative(backupPath, dbConfig)
        console.log('[RESTORE] ✅ Restauración completada:', result)
      } catch (error) {
        console.error('[RESTORE] ❌ Error en restauración:', error.message)
        console.error(error)
      }
    })
  } catch (error) {
    console.error('[RESTORE] Error:', error)
    res.status(500).json({ error: 'Error al iniciar la restauración: ' + error.message })
  }
})

// ===== AUTH: Forgot Password (send email) =====
// Rate limiting para prevenir spam (1 intento por email cada 60 segundos)
const forgotPasswordAttempts = new Map()

app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body || {}
    if (!email) return res.status(400).json({ error: 'Email requerido' })

    // Rate limiting por email
    const now = Date.now()
    const lastAttempt = forgotPasswordAttempts.get(email)
    if (lastAttempt && (now - lastAttempt) < 60000) { // 60 segundos
      const waitSeconds = Math.ceil((60000 - (now - lastAttempt)) / 1000)
      return res.status(429).json({ 
        error: `Por favor espera ${waitSeconds} segundos antes de intentar nuevamente`,
        waitSeconds 
      })
    }

    // Registrar intento
    forgotPasswordAttempts.set(email, now)
    
    // Limpiar intentos viejos cada 5 minutos
    if (forgotPasswordAttempts.size > 100) {
      const fiveMinutesAgo = now - 300000
      for (const [key, value] of forgotPasswordAttempts.entries()) {
        if (value < fiveMinutesAgo) forgotPasswordAttempts.delete(key)
      }
    }

    // Siempre responder igual (sin revelar si el correo existe o no)
    const successMessage = {
      message: 'Se han enviado instrucciones para resetear tu contraseña. Por favor revisa tu correo. Si no ves el mensaje, verifica la carpeta de SPAM o promociones.',
      info: 'Las instrucciones están disponibles por 1 hora'
    }

    // Si hay DB configurada, validar que el email existe
    if (hasDBConfig) {
      try {
        const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email])
        if (!rows || rows.length === 0) {
          // Email no existe en BD, pero no lo decimos (seguridad)
          return res.json(successMessage)
        }
      } catch (e) {
        console.error('[AUTH] DB check error:', e.message)
        // Si hay error en la BD, aún así responder exitosamente por seguridad
        return res.json(successMessage)
      }
    }

    // Generar token JWT sin persistencia
    const token = jwt.sign({ email }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' })
    const base = process.env.SYSTEM_URL || `http://localhost:${process.env.PORT || 4000}`
    const resetLink = `${base}/reset-password?token=${encodeURIComponent(token)}`

    // Enviar email
    const result = await sendPasswordResetEmail(email, resetLink, base)
    if (!result.success && !result.skipped) {
      console.warn('[AUTH] Password reset email failed:', result.error)
    }

    res.json(successMessage)
  } catch (e) {
    console.error('[AUTH] Forgot password error:', e)
    // No revelar detalles del error por seguridad
    res.json({ 
      message: 'Se han enviado instrucciones para resetear tu contraseña. Por favor revisa tu correo. Si no ves el mensaje, verifica la carpeta de SPAM o promociones.',
      info: 'Las instrucciones están disponibles por 1 hora'
    })
  }
})

// ===== AUTH: Reset Password (con token JWT) =====
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body || {}
    
    if (!token || !password) {
      return res.status(400).json({ error: 'Token y contraseña son requeridos' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' })
    }

    // Validar el token JWT
    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    } catch (e) {
      console.error('[AUTH] Invalid or expired token:', e.message)
      return res.status(401).json({ error: 'Token inválido o expirado' })
    }

    const email = decoded.email
    if (!email) {
      return res.status(400).json({ error: 'Email no encontrado en el token' })
    }

    // Si hay DB configurada, actualizar la contraseña
    if (hasDBConfig) {
      try {
        // Verificar que el usuario existe
        const [userRows] = await pool.query('SELECT id FROM users WHERE email = ?', [email])
        if (!userRows || userRows.length === 0) {
          return res.status(404).json({ error: 'Usuario no encontrado' })
        }

        // Hashear la nueva contraseña
        const newHash = await bcrypt.hash(password, 10)

        // Actualizar la contraseña
        const [result] = await pool.query(
          'UPDATE users SET password_hash = ?, must_change_password = 0, updated_at = NOW() WHERE email = ?',
          [newHash, email]
        )

        if (result.affectedRows === 0) {
          throw new Error('No se actualizó la contraseña')
        }

        console.log('[AUTH] Password reset successful for:', email)
        res.json({ 
          success: true,
          message: 'Contraseña actualizada exitosamente. Puedes iniciar sesión con tu nueva contraseña.' 
        })
      } catch (dbErr) {
        console.error('[AUTH] Reset password DB error:', dbErr)
        res.status(500).json({ error: 'Error al actualizar la contraseña' })
      }
    } else {
      // Sin DB, no podemos resetear
      res.status(503).json({ error: 'Base de datos no configurada' })
    }
  } catch (e) {
    console.error('[AUTH] Reset password error:', e)
    res.status(500).json({ error: 'Error al resetear la contraseña' })
  }
})

// ===== REQUESTS ROUTES =====
/**
 * POST /api/requests
 * Crear nueva solicitud con archivos
 */
app.post('/api/requests', upload.array('files', 10), async (req, res) => {
  try {
    const {
      patientId,
      doctorName,
      templateType,
      footSide,
      shoeSize,
      specs,
      observations
    } = req.body

    console.log('[REQUESTS] POST body:', { patientId, doctorName, templateType, footSide, shoeSize })

    // Validar campos obligatorios
    if (!patientId || !doctorName || !templateType || !footSide || !shoeSize) {
      return res.status(400).json({
        error: 'Campos obligatorios faltantes: patientId, doctorName, templateType, footSide, shoeSize'
      })
    }

    if (!hasDBConfig) {
      return res.status(503).json({ error: 'Base de datos no configurada' })
    }

    // Obtener clinic_id del paciente
    const [patientRows] = await pool.query('SELECT clinic_id FROM patients WHERE id = ?', [patientId])
    if (!patientRows || patientRows.length === 0) {
      return res.status(404).json({ error: 'Paciente no encontrado' })
    }
    const clinicId = patientRows[0].clinic_id

    // Parsear specs si viene como string
    const specsObj = typeof specs === 'string' ? JSON.parse(specs) : specs

    // Insertar solicitud en BD (files se actualiza después si hay adjuntos)
    const [result] = await pool.query(
      `INSERT INTO requests (
        patient_id, doctor_name, template_type, foot_side, shoe_size, 
        specs, observations, files, status, clinic_id, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, JSON_ARRAY(), 'pending', ?, NOW())`,
      [patientId, doctorName, templateType, footSide, parseFloat(shoeSize), JSON.stringify(specsObj), observations || null, clinicId]
    )

    const requestId = result.insertId

    // Procesar archivos si existen y persistir referencias
    let files = []
    if (req.files && req.files.length > 0) {
      files = saveUploadedFiles(req.files, requestId)
      console.log('[REQUESTS] Files saved:', files.length, 'files')

      await pool.query('UPDATE requests SET files = ? WHERE id = ?', [JSON.stringify(files), requestId])
    }

    const request = {
      id: requestId,
      patient_id: parseInt(patientId),
      doctor_name: doctorName,
      template_type: templateType,
      foot_side: footSide,
      shoe_size: parseFloat(shoeSize),
      specs: specsObj,
      observations,
      files,
      status: 'pending',
      clinic_id: clinicId,
      created_at: new Date(),
      updated_at: new Date()
    }

    console.log('[REQUESTS] Created request in DB:', requestId, 'for patient', patientId, 'clinic', clinicId)

    res.status(201).json({
      success: true,
      request: request,
      message: 'Solicitud creada exitosamente'
    })

    // Enviar correos (no bloquea la respuesta)
    setImmediate(async () => {
      try {
        const clinicEmail = req.body.clinicEmail || null
        const workshopEmail = process.env.WORKSHOP_EMAIL || 'taller@lucvanlatam.com'
        
        await sendRequestCreatedEmail({
          request,
          clinicEmail,
          workshopEmail,
          systemUrl: process.env.SYSTEM_URL || `http://localhost:${process.env.PORT || 4000}`
        })
      } catch (e) {
        console.warn('[EMAIL] Error sending request created emails:', e?.message || e)
      }
    })
  } catch (error) {
    console.error('[REQUESTS] Error creating request:', error)
    res.status(500).json({
      error: 'Error al crear la solicitud: ' + error.message
    })
  }
})

app.get('/api/requests', async (req, res) => {
  if (!hasDBConfig) {
    return res.status(503).json({ error: 'Base de datos no configurada' })
  }
  try {
    const isAdmin = req.user && req.user.role === 'admin'
    const isWorkshop = req.user && (req.user.role === 'workshop' || req.user.role === 'production')
    const userClinicId = req.user ? req.user.clinicId : null
    const requestedClinicId = req.query.clinic_id || req.query.clinicId || null
    const patientId = req.query.patientId || req.query.patient_id || null

    console.log('[REQUESTS] GET - User:', req.user?.id, 'Role:', req.user?.role, 'isAdmin:', isAdmin, 'isWorkshop:', isWorkshop, 'ClinicId:', userClinicId, 'req.user exists:', !!req.user)

    // Si no hay usuario autenticado
    if (!req.user) {
      console.log('[REQUESTS] ERROR - No authenticated user')
      return res.status(401).json({ error: 'No autenticado' })
    }

    // Si no es admin o workshop/production, forzar clínica del usuario
    let clinicId = null
    if (isAdmin) {
      clinicId = requestedClinicId || null
    } else if (!isWorkshop && !userClinicId) {
      console.log('[REQUESTS] ERROR - Not admin/workshop and no clinic_id')
      return res.status(400).json({ error: 'Falta clinic_id: usuario no administrador requiere clínica asociada' })
    } else if (!isWorkshop) {
      clinicId = userClinicId
    }
    // isWorkshop: clinicId stays null, show all requests

    const params = []
    let where = 'WHERE 1=1'
    if (clinicId) {
      where += ' AND r.clinic_id = ?'
      params.push(clinicId)
    }
    if (patientId) {
      where += ' AND r.patient_id = ?'
      params.push(patientId)
    }

    const [rows] = await pool.query(`
      SELECT r.*, p.name as patient_name, c.name as clinic_name
      FROM requests r
      LEFT JOIN patients p ON r.patient_id = p.id
      LEFT JOIN clinics c ON r.clinic_id = c.id
      ${where}
      ORDER BY r.created_at DESC
    `, params)

    res.json(rows)
  } catch (e) {
    console.error('[REQUESTS] List error:', e)
    res.status(500).json({ error: 'Error al obtener solicitudes' })
  }
})

app.get('/api/requests/:id', async (req, res) => {
  if (!hasDBConfig) {
    return res.status(503).json({ error: 'Base de datos no configurada' })
  }
  try {
    const requestId = req.params.id
    
    const [rows] = await pool.query(`
      SELECT r.*, 
             p.name as patient_name, 
             p.phone as patient_phone,
             c.name as clinic_name,
             c.address as clinic_address,
             c.phone as clinic_phone
      FROM requests r
      LEFT JOIN patients p ON r.patient_id = p.id
      LEFT JOIN clinics c ON r.clinic_id = c.id
      WHERE r.id = ?
    `, [requestId])
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Solicitud no encontrada' })
    }
    
    res.json(rows[0])
  } catch (e) {
    console.error('[REQUESTS] Get error:', e)
    res.status(500).json({ error: 'Error al obtener solicitud' })
  }
})

// Activar garantía
app.post('/api/requests/:id/warranty', async (req, res) => {
  if (!hasDBConfig) {
    return res.status(503).json({ error: 'Base de datos no configurada' })
  }
  try {
    const requestId = req.params.id
    const { reason } = req.body || {}

    if (!reason || !reason.trim()) {
      return res.status(400).json({ error: 'Motivo de garantía requerido' })
    }

    // Verificar que la solicitud exista y esté entregada
    const [rows] = await pool.query('SELECT id, status, created_at FROM requests WHERE id = ?', [requestId])
    if (!rows.length) {
      return res.status(404).json({ error: 'Solicitud no encontrada' })
    }

    const request = rows[0]
    if (request.status !== 'delivered') {
      return res.status(400).json({ error: 'Solo se puede activar garantía en solicitudes entregadas' })
    }

    // Actualizar a estado warranty
    await pool.query(
      'UPDATE requests SET status = ?, warranty_reason = ?, warranty_date = NOW() WHERE id = ?',
      ['warranty', reason.trim(), requestId]
    )

    // Crear nota automática
    try {
      await pool.query(
        'INSERT INTO workshop_notes (request_id, user_name, comment, created_at, is_system_note) VALUES (?, ?, ?, NOW(), 1)',
        [requestId, 'Sistema', `🔧 Garantía activada: ${reason.trim()}`]
      )
    } catch (noteErr) {
      console.warn('[WARRANTY] Note creation failed:', noteErr?.message)
    }

    return res.json({ success: true, message: 'Garantía activada' })
  } catch (e) {
    console.error('[WARRANTY] Error:', e)
    return res.status(500).json({ error: 'Error al activar garantía' })
  }
})

// Actualizar solicitud
app.put('/api/requests/:id', async (req, res) => {
  if (!hasDBConfig) {
    return res.status(503).json({ error: 'Base de datos no configurada' })
  }
  try {
    const requestId = req.params.id
    const { status, doctorName, templateType, footSide, shoeSize, observations, specs } = req.body || {}

    // Verificar existencia
    const [exists] = await pool.query('SELECT id FROM requests WHERE id = ?', [requestId])
    if (!exists.length) {
      return res.status(404).json({ error: 'Solicitud no encontrada' })
    }

    const fields = []
    const values = []
    let statusChanged = false
    
    if (status !== undefined) { 
      fields.push('status = ?'); 
      values.push(status);
      statusChanged = true
    }
    if (doctorName !== undefined) { fields.push('doctor_name = ?'); values.push(doctorName) }
    if (templateType !== undefined) { fields.push('template_type = ?'); values.push(templateType) }
    if (footSide !== undefined) { fields.push('foot_side = ?'); values.push(footSide) }
    if (shoeSize !== undefined) { fields.push('shoe_size = ?'); values.push(parseFloat(shoeSize)) }
    if (observations !== undefined) { fields.push('observations = ?'); values.push(observations || null) }
    if (specs !== undefined) { fields.push('specs = ?'); values.push(typeof specs === 'string' ? specs : JSON.stringify(specs)) }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' })
    }

    // Agregar updated_at para registrar cambios generales
    fields.push('updated_at = NOW()')
    
    // Si el estado cambió, actualizar también status_updated_at
    if (statusChanged) {
      fields.push('status_updated_at = NOW()')
    }
    
    const sql = `UPDATE requests SET ${fields.join(', ')} WHERE id = ?`
    values.push(requestId)
    await pool.query(sql, values)

    const [rows] = await pool.query('SELECT * FROM requests WHERE id = ?', [requestId])
    return res.json(rows[0])
  } catch (e) {
    console.error('[REQUESTS] Update error:', e)
    return res.status(500).json({ error: 'Error al actualizar solicitud' })
  }
})

/**
 * GET /api/requests/:id/workshop-notes
 * Obtener todas las notas del ticket
 */
app.get('/api/requests/:id/workshop-notes', async (req, res) => {
  try {
    const { id } = req.params
    
    if (hasDBConfig) {
      // Asegurar que la tabla existe
      try {
        await pool.query(`
          CREATE TABLE IF NOT EXISTS workshop_notes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            request_id VARCHAR(50) NOT NULL,
            user_id INT,
            user_name VARCHAR(255),
            comment LONGTEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            is_system_note TINYINT(1) DEFAULT 0,
            INDEX idx_request_id (request_id),
            INDEX idx_created_at (created_at)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `)
      } catch (createErr) {
        console.warn('[WORKSHOP-NOTES] Could not create table:', createErr?.message)
      }
      
      // Consultar notas
      try {
        const [notes] = await pool.query(
          `SELECT id, request_id, user_id, user_name, comment, created_at, is_system_note
           FROM workshop_notes 
           WHERE request_id = ? 
           ORDER BY created_at ASC`,
          [id]
        )
        console.log('[WORKSHOP-NOTES] Found', notes?.length || 0, 'notes for request', id)
        return res.json(notes || [])
      } catch (dbErr) {
        console.error('[WORKSHOP-NOTES] Query error:', dbErr?.message)
        return res.json([])
      }
    } else {
      // Mock: retornar array vacío
      res.json([])
    }
  } catch (err) {
    console.error('[WORKSHOP-NOTES] Get error:', err)
    res.status(500).json({ error: 'Error al obtener notas' })
  }
})

/**
 * POST /api/requests/:id/workshop-notes
 * Crear nueva nota en el ticket
 */
// Función para obtener timestamp UTC en milisegundos
// La conversión a Costa Rica (UTC-6) se hace en el frontend
function getCostaRicaTimestamp() {
  // Retornar timestamp UNIX en milisegundos (siempre UTC)
  return Date.now()
}

app.post('/api/requests/:id/workshop-notes', async (req, res) => {
  try {
    const { id } = req.params
    const { comment, isSystemNote } = req.body
    
    if (!comment || typeof comment !== 'string' || !comment.trim()) {
      return res.status(400).json({ error: 'Comentario requerido' })
    }
    
    console.log('[WORKSHOP-NOTES] req.user:', req.user)
    
    // Obtener el usuario autenticado (si existe)
    let userName = 'Sistema'
    if (req.user && req.user.name) {
      userName = req.user.name
      console.log('[WORKSHOP-NOTES] Using user name from req.user:', userName)
    } else if (req.user && req.user.email) {
      userName = req.user.email.split('@')[0]
      console.log('[WORKSHOP-NOTES] Using user email:', userName)
    } else {
      console.log('[WORKSHOP-NOTES] No user found, using "Sistema"')
    }
    
    const trimmedComment = comment.trim()
    const timestampMs = getCostaRicaTimestamp()  // Milisegundos UNIX
    // Guardar como número UNIX - MySQL BIGINT, frontend convierte con new Date(milliseconds)
    const created_at = timestampMs
    const noteId = Math.floor(Math.random() * 1000000)
    
    if (hasDBConfig) {
      // Guardar en BD si la tabla existe; si falla, continuar
      try {
        // Primero asegurar que la columna existe
        try {
          await pool.query(`ALTER TABLE workshop_notes ADD COLUMN is_system_note TINYINT(1) DEFAULT 0`)
        } catch (alterErr) {
          // La columna ya existe o hay otro error, ignorar
        }
        
        // NOTA: En servidor local (CR), usar NOW()
        // En servidor de producción (otra región), usar created_at con timestamp ajustado
        const result = await pool.query(
          `INSERT INTO workshop_notes (request_id, user_name, comment, created_at, is_system_note)
           VALUES (?, ?, ?, ?, ?)`,
          [id, userName, trimmedComment, created_at, isSystemNote ? 1 : 0]
        )
        console.log('[WORKSHOP-NOTES] Inserted note for request', id, '- result:', result)
      } catch (dbErr) {
        console.warn('[WORKSHOP-NOTES] Insert failed (continuing without DB):', dbErr?.message)
      }
    }
    
    // Retornar la nota creada
    const note = {
      id: noteId,
      request_id: id,
      user_name: userName,
      comment: trimmedComment,
      created_at: created_at,
      is_system_note: isSystemNote ? 1 : 0
    }
    
    res.status(201).json(note)
    console.log('[WORKSHOP-NOTES] Created note for request', id, 'by', userName)
  } catch (err) {
    console.error('[WORKSHOP-NOTES] Create error:', err)
    res.status(500).json({ error: 'Error al crear nota' })
  }
})

// Servir archivos adjuntos (uploads)
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, 'backend', 'uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
  console.log('[UPLOADS] Created directory:', uploadDir)
}
app.use('/uploads', express.static(uploadDir))
console.log('[UPLOADS] Serving static files from:', uploadDir)

// API downloads with validation
app.use('/api/uploads', uploadsRouter)

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message)
  res.status(500).json({ error: 'Error interno del servidor' })
})

// Serve SPA (DEBE excluir /uploads y /api)
const clientDist = path.join(__dirname, 'dist')
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist))
  app.use((req, res, next) => {
    // NO servir index.html para /uploads ni /api
    if (req.path.startsWith('/uploads/') || req.path.startsWith('/api/') || req.path.startsWith('/socket.io/')) {
      return next()
    }
    res.sendFile(path.join(clientDist, 'index.html'))
  })
} else {
  console.warn('Frontend dist not found at', clientDist)
}

const port = process.env.PORT || 4000
console.log('[INIT] About to call app.listen()')
server.listen(port, () => {
  console.log(`✅ API listening on port ${port}`)
  console.log(`   Mode: ${process.env.NODE_ENV || 'development'}`)
  console.log(`   Database: ${process.env.DB_NAME}`)
  console.log(`   Time: ${new Date().toLocaleString('es-CR', { timeZone: 'America/Costa_Rica' })}`)
})

server.timeout = 30000
server.keepAliveTimeout = 65000
