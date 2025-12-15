import { Router } from 'express'
import pool from '../db.js'

const router = Router()

// Obtener todas las clínicas
router.get('/', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 100)
    const offset = parseInt(req.query.offset) || 0
    const [rows] = await pool.query(
      'SELECT id, name, phone, email, address FROM clinics ORDER BY name LIMIT ? OFFSET ?',
      [limit, offset]
    )
    res.json(rows)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Error al obtener clínicas' })
  }
})

// Crear/actualizar clínica
router.post('/', async (req, res) => {
  const { id, name, phone, email, address } = req.body
  if (!name) return res.status(400).json({ error: 'Nombre de clínica es obligatorio' })
  try {
    if (id) {
      await pool.query(
        'UPDATE clinics SET name=?, phone=?, email=?, address=? WHERE id=?',
        [name, phone || null, email || null, address || null, id]
      )
      return res.json({ id, name, phone, email, address })
    } else {
      const [result] = await pool.query(
        'INSERT INTO clinics (name, phone, email, address) VALUES (?, ?, ?, ?)',
        [name, phone || null, email || null, address || null]
      )
      return res.status(201).json({ id: result.insertId, name, phone, email, address })
    }
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Error al guardar clínica' })
  }
})

// Eliminar clínica
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  if (!id) return res.status(400).json({ error: 'ID inválido' })
  try {
    await pool.query('DELETE FROM clinics WHERE id = ?', [id])
    res.json({ success: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Error al eliminar clínica' })
  }
})

export default router
