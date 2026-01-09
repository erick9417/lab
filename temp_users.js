import { Router } from "express"
import bcrypt from "bcryptjs"
import pool from "../db.js"

const router = Router()

// Obtener todos los usuarios (incluyendo deshabilitados) para poder gestionarlos
router.get("/", async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit ?? 50), 100)
    const offset = Number(req.query.offset ?? 0)
    const [rows] = await pool.query(
      "SELECT u.id, u.email, u.name, u.role, u.clinic_id, u.disabled, u.must_change_password, c.name as clinic_name FROM users u LEFT JOIN clinics c ON u.clinic_id = c.id ORDER BY u.email LIMIT ? OFFSET ?",
      [limit, offset]
    )
    res.json(rows)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: "Error al obtener usuarios" })
  }
})

// Crear usuario (solo Admin)
router.post("/", async (req, res) => {
  const { email, password, role, clinicId, name } = req.body
  if (!email || !password || !role) return res.status(400).json({ error: "Campos obligatorios: email, password, role" })
  try {
    const password_hash = await bcrypt.hash(password, 10)
    const [result] = await pool.query(
      "INSERT INTO users (email, name, password_hash, role, clinic_id, disabled, must_change_password) VALUES (?, ?, ?, ?, ?, FALSE, TRUE)",
      [email, name ?? null, password_hash, role, clinicId ?? null]
    )
    res.status(201).json({ id: result.insertId, email, name: name ?? null, role, clinicId: clinicId ?? null, disabled: false })
  } catch (e) {
    console.error(e)
    if (e.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "El email ya existe" })
    }
    res.status(500).json({ error: "Error al crear usuario" })
  }
})

// Deshabilitar usuario
router.patch("/:id/disable", async (req, res) => {
  const id = parseInt(req.params.id)
  if (!id) return res.status(400).json({ error: "ID inválido" })
  try {
    await pool.query("UPDATE users SET disabled = TRUE WHERE id = ?", [id])
    res.json({ success: true, message: "Usuario deshabilitado" })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: "Error al deshabilitar usuario" })
  }
})

// Habilitar usuario
router.patch("/:id/enable", async (req, res) => {
  const id = parseInt(req.params.id)
  if (!id) return res.status(400).json({ error: "ID inválido" })
  try {
    const [userRows] = await pool.query("SELECT clinic_id FROM users WHERE id = ?", [id])
    if (userRows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" })

    const clinicId = userRows[0].clinic_id
    if (clinicId) {
      const [clinicRows] = await pool.query("SELECT disabled FROM clinics WHERE id = ?", [clinicId])
      if (clinicRows.length && clinicRows[0].disabled) {
        return res.status(400).json({ error: "No puedes habilitar un usuario si su clínica está desactivada" })
      }
    }

    await pool.query("UPDATE users SET disabled = FALSE WHERE id = ?", [id])
    res.json({ success: true, message: "Usuario habilitado" })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: "Error al habilitar usuario" })
  }
})

// Eliminar usuario
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id)
  if (!id) return res.status(400).json({ error: "ID inválido" })
  try {
    await pool.query("DELETE FROM users WHERE id = ?", [id])
    res.json({ success: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: "Error al eliminar usuario" })
  }
})

// Actualizar usuario
router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id)
  const { email, role, clinicId, clinic_id, name } = req.body
  const finalClinicId = clinic_id !== undefined ? clinic_id : clinicId

  // Actualización parcial solo de clínica
  if (clinic_id !== undefined && email === undefined && role === undefined && name === undefined) {
    try {
      await pool.query("UPDATE users SET clinic_id = ? WHERE id = ?", [finalClinicId ?? null, id])
      return res.json({ success: true, id, clinic_id: finalClinicId })
    } catch (e) {
      console.error(e)
      return res.status(500).json({ error: "Error al actualizar usuario" })
    }
  }

  // Actualización completa
  if (!id || !email || !role) return res.status(400).json({ error: "Campos obligatorios: email, role" })
  try {
    await pool.query("UPDATE users SET email=?, name=?, role=?, clinic_id=? WHERE id=?", [email, name ?? null, role, finalClinicId ?? null, id])
    return res.json({ id, email, name: name ?? null, role, clinicId: finalClinicId ?? null })
  } catch (e) {
    console.error(e)
    if (e.code === "ER_DUP_ENTRY") return res.status(409).json({ error: "El email ya existe" })
    return res.status(500).json({ error: "Error al actualizar usuario" })
  }
})

export default router
