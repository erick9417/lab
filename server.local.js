import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() })
})

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña requeridos' })
  }
  // Demo: acepta cualquier contraseña no vacía
  const user = {
    id: 1,
    email,
    role: email === 'admin@lucvanlatam.com' ? 'admin' : 'clinic',
    name: 'Usuario Demo',
    clinicId: null,
    mustChangePassword: false,
  }
  const token = 'demo-token-123'
  res.json({ user, token })
})

app.post('/api/users', (req, res) => {
  const { name, email, password, role, clinic_id } = req.body || {}
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña requeridos' })
  }
  
  const newUser = {
    id: Math.floor(Math.random() * 10000),
    name,
    email,
    role: role || 'clinic',
    clinic_id,
    created_at: new Date().toISOString(),
    mustChangePassword: true, // Siempre true para nuevos usuarios
  }
  
  // Log simulando envío de email
  console.log(`[EMAIL] Sending welcome email to ${email}`)
  console.log(`[EMAIL] Temporary password: ${password}`)
  console.log(`[EMAIL] System URL: https://sistema.lucvanlatam.com`)
  
  res.status(201).json(newUser)
})

app.post('/api/patients', (req, res) => {
  const { name, notes } = req.body || {}
  if (!name) {
    return res.status(400).json({ error: 'Nombre del paciente requerido' })
  }
  
  const newPatient = {
    id: Math.floor(Math.random() * 10000),
    name,
    notes: notes || null,
    created_at: new Date().toISOString(),
  }
  
  console.log(`[PATIENT] New patient registered: ${name}`)
  if (notes) console.log(`[PATIENT] Clinical notes: ${notes}`)
  
  res.status(201).json(newPatient)
})

app.get('/api/patients', (req, res) => {
  // Mock list of patients
  res.json([
    { id: 1, name: 'Juan Pérez García', notes: 'Sin alergias conocidas', created_at: '2025-01-01' },
    { id: 2, name: 'María López Rodríguez', notes: null, created_at: '2025-01-02' },
  ])
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`Stub API listening on http://localhost:${port}`)
})
