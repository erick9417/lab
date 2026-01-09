import { Router } from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import pool from "../db.js"
import crypto from "crypto"
import nodemailer from "nodemailer"

const router = Router()

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: "Por favor ingrese email y contraseña" })
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, password_hash, role, clinic_id, must_change_password FROM users WHERE email = ?",
      [email]
    )
    const user = rows[0]
    if (!user) return res.status(401).json({ error: "Usuario o contraseña inválidos" })
    const ok = await bcrypt.compare(password, user.password_hash)
    if (!ok) return res.status(401).json({ error: "Usuario o contraseña inválidos" })

    const token = jwt.sign({ uid: user.id, role: user.role }, process.env.JWT_SECRET || "secret", { expiresIn: "7d" })
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
    console.error(e)
    res.status(500).json({ error: "Error en el servidor. Intente nuevamente" })
  }
})

// Crear invitación
router.post("/invite", async (req, res) => {
  const { name, email, role = "clinic", clinicId } = req.body
  const finalClinicId = clinicId || null
  if (!email) return res.status(400).json({ error: "El email es obligatorio" })
  if (role === "clinic" && !clinicId) return res.status(400).json({ error: "Debe seleccionar una clínica para usuarios con rol Clínica" })
  try {
    const token = crypto.randomBytes(20).toString("hex")
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    await pool.query(
      "INSERT INTO invites (name, email, token, role, clinic_id, expires_at) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, token, role, finalClinicId, expiresAt]
    )

    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || "587"),
          secure: process.env.SMTP_SECURE === "true",
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        })
        const acceptUrl = (process.env.APP_URL || "") + `/invite/accept?token=${token}`
        await transporter.sendMail({
          from: process.env.SMTP_FROM || "no-reply@example.com",
          to: email,
          subject: "Invitación a Lucván — Completa tu registro",
          html: `Hola,<br/><br/>Has sido invitado al sistema. Abre el siguiente enlace para completar tu registro:<br/><a href="${acceptUrl}">${acceptUrl}</a><br/><br/>El enlace expira en 7 días.`
        })
      } catch (mailErr) {
        console.error("Error enviando email de invitación", mailErr)
      }
    }

    res.json({ message: "Invitación creada", token })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: "Error creando invitación" })
  }
})

// Validar invitación
router.get("/invite/:token", async (req, res) => {
  const { token } = req.params
  try {
    const [rows] = await pool.query("SELECT id, email, role, clinic_id, used, expires_at FROM invites WHERE token = ?", [token])
    const invite = rows[0]
    if (!invite) return res.status(404).json({ error: "Invitación no encontrada" })
    if (invite.used) return res.status(400).json({ error: "Esta invitación ya fue utilizada" })
    if (invite.expires_at && new Date(invite.expires_at) < new Date()) return res.status(400).json({ error: "Invitación expirada" })
    res.json({ email: invite.email, role: invite.role, clinicId: invite.clinic_id })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: "Error verificando invitación" })
  }
})

// Aceptar invitación
router.post("/invite/accept", async (req, res) => {
  const { token, password } = req.body
  if (!token || !password) return res.status(400).json({ error: "Token y contraseña son obligatorios" })
  try {
    const [rows] = await pool.query("SELECT id, email, role, clinic_id, used, expires_at FROM invites WHERE token = ?", [token])
    const invite = rows[0]
    if (!invite) return res.status(404).json({ error: "Invitación no encontrada" })
    if (invite.used) return res.status(400).json({ error: "Esta invitación ya fue utilizada" })
    if (invite.expires_at && new Date(invite.expires_at) < new Date()) return res.status(400).json({ error: "Invitación expirada" })

    const [uRows] = await pool.query("SELECT id FROM users WHERE email = ?", [invite.email])
    if (uRows.length > 0) return res.status(400).json({ error: "Ya existe un usuario con este email" })

    const hash = await bcrypt.hash(password, 10)
    await pool.query("INSERT INTO users (email, password_hash, role, clinic_id, must_change_password) VALUES (?, ?, ?, ?, TRUE)", [invite.email, hash, invite.role, invite.clinic_id])
    await pool.query("UPDATE invites SET used = 1 WHERE id = ?", [invite.id])

    res.json({ message: "Cuenta creada" })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: "Error al aceptar la invitación" })
  }
})

// Cambiar contraseña
router.put("/change-password", async (req, res) => {
  const { email, currentPassword, newPassword } = req.body
  if (!email || !currentPassword || !newPassword) {
    return res.status(400).json({ error: "Email, contraseña actual y nueva contraseña son obligatorios" })
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: "La nueva contraseña debe tener al menos 6 caracteres" })
  }
  try {
    const [rows] = await pool.query("SELECT id, password_hash FROM users WHERE email = ?", [email])
    const user = rows[0]
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" })

    const validPassword = await bcrypt.compare(currentPassword, user.password_hash)
    if (!validPassword) return res.status(401).json({ error: "Contraseña actual incorrecta" })

    const newHash = await bcrypt.hash(newPassword, 10)
    await pool.query("UPDATE users SET password_hash = ?, must_change_password = FALSE WHERE id = ?", [newHash, user.id])
    res.json({ message: "Contraseña actualizada exitosamente" })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: "Error al cambiar la contraseña" })
  }
})

export default router
