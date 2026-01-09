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
      "SELECT id, name, email, password_hash, role, clinic_id, disabled, must_change_password FROM users WHERE email = ?",
      [email]
    )
    const user = rows[0]
    if (!user) return res.status(401).json({ error: "Usuario o contraseña inválidos" })
    
    // Verificar si el usuario está deshabilitado
    if (user.disabled) return res.status(403).json({ error: "Usuario deshabilitado. Contacte al administrador" })
    
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
  const { email, role, clinicId } = req.body
  if (!email || !role) return res.status(400).json({ error: "Faltan campos obligatorios: email, role" })
  try {
    const token = crypto.randomBytes(20).toString("hex")
    await pool.query(
      "INSERT INTO invites (email, role, clinic_id, token, expires_at) VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))",
      [email, role, clinicId || null, token]
    )
    const inviteLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/invite/${token}`
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    })
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Invitación al Sistema Lucvan",
      html: `<p>Has sido invitado al sistema Lucvan.</p><p><a href="${inviteLink}">Haz clic aquí para crear tu cuenta</a></p>`
    })
    res.json({ success: true, inviteLink })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: "Error al enviar invitación" })
  }
})

// Obtener invitación por token
router.get("/invite/:token", async (req, res) => {
  const { token } = req.params
  try {
    const [rows] = await pool.query(
      "SELECT id, email, role, clinic_id, expires_at, used FROM invites WHERE token = ?",
      [token]
    )
    const invite = rows[0]
    if (!invite) return res.status(404).json({ error: "Invitación no encontrada" })
    if (invite.used) return res.status(400).json({ error: "Esta invitación ya fue utilizada" })
    if (new Date(invite.expires_at) < new Date()) return res.status(400).json({ error: "Invitación expirada" })
    res.json({
      email: invite.email,
      role: invite.role,
      clinicId: invite.clinic_id
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: "Error al obtener invitación" })
  }
})

// Aceptar invitación
router.post("/invite/accept", async (req, res) => {
  const { token, password, name } = req.body
  if (!token || !password) return res.status(400).json({ error: "Token y contraseña son requeridos" })
  try {
    const [rows] = await pool.query("SELECT * FROM invites WHERE token = ?", [token])
    const invite = rows[0]
    if (!invite) return res.status(404).json({ error: "Invitación no encontrada" })
    if (invite.used) return res.status(400).json({ error: "Esta invitación ya fue utilizada" })
    if (new Date(invite.expires_at) < new Date()) return res.status(400).json({ error: "Invitación expirada" })
    const password_hash = await bcrypt.hash(password, 10)
    const [result] = await pool.query(
      "INSERT INTO users (email, name, password_hash, role, clinic_id) VALUES (?, ?, ?, ?, ?)",
      [invite.email, name || null, password_hash, invite.role, invite.clinic_id]
    )
    await pool.query("UPDATE invites SET used = TRUE WHERE id = ?", [invite.id])
    const jwtToken = jwt.sign({ uid: result.insertId, role: invite.role }, process.env.JWT_SECRET || "secret", { expiresIn: "7d" })
    res.json({
      token: jwtToken,
      user: {
        id: result.insertId,
        name: name || null,
        email: invite.email,
        role: invite.role,
        clinicId: invite.clinic_id
      }
    })
  } catch (e) {
    console.error(e)
    if (e.code === "ER_DUP_ENTRY") return res.status(409).json({ error: "El email ya existe" })
    res.status(500).json({ error: "Error al aceptar invitación" })
  }
})

// Cambiar contraseña (requiere autenticación)
router.put("/change-password", async (req, res) => {
  const { email, currentPassword, newPassword } = req.body
  if (!email || !currentPassword || !newPassword) {
    return res.status(400).json({ error: "Email, contraseña actual y nueva contraseña son requeridos" })
  }
  try {
    const [rows] = await pool.query("SELECT id, password_hash FROM users WHERE email = ?", [email])
    const user = rows[0]
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" })
    const ok = await bcrypt.compare(currentPassword, user.password_hash)
    if (!ok) return res.status(401).json({ error: "Contraseña actual incorrecta" })
    const newPasswordHash = await bcrypt.hash(newPassword, 10)
    await pool.query(
      "UPDATE users SET password_hash = ?, must_change_password = FALSE WHERE id = ?",
      [newPasswordHash, user.id]
    )
    res.json({ success: true, message: "Contraseña actualizada exitosamente" })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: "Error al cambiar contraseña" })
  }
})

export default router
