/**
 * GUÍA: Integración de Email en el Backend
 * 
 * Este archivo describe cómo integrar el servicio de email en tus rutas del backend.
 */

// En tu archivo routes/users.js o similar, importa el servicio:
import { sendWelcomeEmail } from '../services/emailService.js'

// Ejemplo de endpoint POST /api/users que crea usuario y envía email:
/*
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, email, password, role, clinic_id } = req.body

    // 1. Validaciones básicas
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' })
    }

    // 2. Verificar si email ya existe
    const existingUser = await db.query('SELECT id FROM users WHERE email = ?', [email])
    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'El email ya está registrado' })
    }

    // 3. Hash de contraseña (usar bcrypt)
    const hashedPassword = await bcrypt.hash(password, 10)

    // 4. Insertar usuario en BD
    const result = await db.query(
      'INSERT INTO users (name, email, password_hash, role, clinic_id, must_change_password, created_at) VALUES (?, ?, ?, ?, ?, true, NOW())',
      [name, email, hashedPassword, role, clinic_id || null]
    )

    const newUser = {
      id: result.insertId,
      name,
      email,
      role,
      clinicId: clinic_id,
      mustChangePassword: true,
    }

    // 5. Enviar correo de bienvenida con contraseña temporal
    const emailResult = await sendWelcomeEmail(
      newUser,
      password, // La contraseña temporal
      'https://sistema.lucvanlatam.com' // O desde env var
    )

    if (!emailResult.success) {
      console.warn('Email not sent but user created:', newUser)
      // Decidir si fallar completamente o continuar sin email
    }

    res.status(201).json({
      ...newUser,
      message: 'Usuario creado. Se envió un correo de bienvenida.',
    })
  } catch (error) {
    console.error('Error creating user:', error)
    res.status(500).json({ error: 'Error creando usuario' })
  }
})
*/

/**
 * VARIABLES DE ENTORNO REQUERIDAS (.env):
 */
const exampleEnv = `
# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=tu-app-password
SMTP_FROM=tu-email@gmail.com
SMTP_REPLY_TO=soporte@lucvanlatam.com

# Sistema URL para email
SYSTEM_URL=https://sistema.lucvanlatam.com
`

/**
 * INSTALACIÓN:
 * npm install nodemailer
 */

/**
 * TESTING:
 * 
 * const { sendWelcomeEmail } = await import('./services/emailService.js')
 * 
 * await sendWelcomeEmail(
 *   { email: 'test@example.com', name: 'Test User' },
 *   'TempPassword123',
 *   'https://sistema.lucvanlatam.com'
 * )
 */
