import { Router } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import pool from '../db.js'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

const router = Router()

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Credenciales incompletas' })
  try {
    const [rows] = await pool.query('SELECT id, email, password_hash, role FROM users WHERE email = ?', [email])
    const user = rows[0]
    if (!user) return res.status(401).json({ error: 'Usuario o contraseña inválidos' })
    const ok = await bcrypt.compare(password, user.password_hash)
    if (!ok) return res.status(401).json({ error: 'Usuario o contraseña inválidos' })
    const token = jwt.sign({ uid: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' })
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Error en el servidor' })
  }
})

// POST /api/auth/invite  -- create invite token and send email (admin only expected)
router.post('/invite', async (req, res) => {
  const { email, role = 'clinic', clinicId = null } = req.body
  if (!email) return res.status(400).json({ error: 'Email es requerido' })
  try {
    // create token
    const token = crypto.randomBytes(20).toString('hex')
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    await pool.query('INSERT INTO invites (email, token, role, clinic_id, expires_at) VALUES (?, ?, ?, ?, ?)', [email, token, role, clinicId, expiresAt])

    // Try to send email if SMTP configured
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        })

        const acceptUrl = (process.env.APP_URL || '') + `/invite/accept?token=${token}`
        await transporter.sendMail({
          from: process.env.SMTP_FROM || 'no-reply@example.com',
          to: email,
          subject: 'Invitación a Lucván — Completa tu registro',
          html: `Hola,<br/><br/>Has sido invitado al sistema. Abre el siguiente enlace para completar tu registro:<br/><a href="${acceptUrl}">${acceptUrl}</a><br/><br/>El enlace expira en 7 días.`
        })
      } catch (mailErr) {
        console.error('Error enviando email de invitación', mailErr)
      }
    }

    // Return token in response for testing when email not configured
    res.json({ message: 'Invitación creada', token })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Error creando invitación' })
  }
})

// GET /api/auth/invite/:token  -- validate
router.get('/invite/:token', async (req, res) => {
  const { token } = req.params
  try {
    const [rows] = await pool.query('SELECT id, email, role, clinic_id, used, expires_at FROM invites WHERE token = ?', [token])
    const invite = rows[0]
    if (!invite) return res.status(404).json({ error: 'Invitación no encontrada' })
    if (invite.used) return res.status(400).json({ error: 'Invitación ya utilizada' })
    if (invite.expires_at && new Date(invite.expires_at) < new Date()) return res.status(400).json({ error: 'Invitación expirada' })
    res.json({ email: invite.email, role: invite.role, clinicId: invite.clinic_id })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Error verificando invitación' })
  }
})

// POST /api/auth/invite/accept  -- accept invite and set password
router.post('/invite/accept', async (req, res) => {
  const { token, password } = req.body
  if (!token || !password) return res.status(400).json({ error: 'Token y contraseña son requeridos' })
  try {
    const [rows] = await pool.query('SELECT id, email, role, clinic_id, used, expires_at FROM invites WHERE token = ?', [token])
    const invite = rows[0]
    if (!invite) return res.status(404).json({ error: 'Invitación no encontrada' })
    if (invite.used) return res.status(400).json({ error: 'Invitación ya utilizada' })
    if (invite.expires_at && new Date(invite.expires_at) < new Date()) return res.status(400).json({ error: 'Invitación expirada' })

    // check user not exists
    const [uRows] = await pool.query('SELECT id FROM users WHERE email = ?', [invite.email])
    if (uRows.length > 0) return res.status(400).json({ error: 'Usuario ya existe' })

    const hash = await bcrypt.hash(password, 10)
    const result = await pool.query('INSERT INTO users (email, password_hash, role, clinic_id) VALUES (?, ?, ?, ?)', [invite.email, hash, invite.role, invite.clinic_id])

    // mark invite used
    await pool.query('UPDATE invites SET used = 1 WHERE id = ?', [invite.id])

    res.json({ message: 'Cuenta creada' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Error al aceptar invitación' })
  }
})

export default router
