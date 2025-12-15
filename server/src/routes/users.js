import { Router } from 'express'
import bcrypt from 'bcryptjs'
import pool from '../db.js'

const router = Router()

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 100)
    const offset = parseInt(req.query.offset) || 0
    const [rows] = await pool.query(`
      SELECT u.id, u.email, u.role, u.clinic_id, c.name as clinic_name
      FROM users u
      LEFT JOIN clinics c ON u.clinic_id = c.id
      ORDER BY u.email
      LIMIT ? OFFSET ?
    `, [limit, offset])
    res.json(rows)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Error al obtener usuarios' })
  }
})

// Crear usuario (solo Admin)
router.post('/', async (req, res) => {
  const { email, password, role, clinicId } = req.body
  if (!email || !password || !role) return res.status(400).json({ error: 'Campos obligatorios: email, password, role' })
  try {
    const password_hash = await bcrypt.hash(password, 10)
    const [result] = await pool.query(
      'INSERT INTO users (email, password_hash, role, clinic_id) VALUES (?, ?, ?, ?)',
      [email, password_hash, role, clinicId || null]
    )
    res.status(201).json({ id: result.insertId, email, role, clinicId: clinicId || null })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Error al crear usuario' })
  }
})

// Eliminar usuario
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  if (!id) return res.status(400).json({ error: 'ID inválido' })
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [id])
    res.json({ success: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Error al eliminar usuario' })
  }
})

// Actualizar usuario
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const { email, role, clinicId } = req.body
  if (!id || !email || !role) return res.status(400).json({ error: 'Campos obligatorios: email, role' })
  try {
    await pool.query('UPDATE users SET email=?, role=?, clinic_id=? WHERE id=?', [email, role, clinicId || null, id])
    res.json({ id, email, role, clinicId: clinicId || null })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Error al actualizar usuario' })
  }
})

export default router
