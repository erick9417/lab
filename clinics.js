import { Router } from 'express'
import pool from '../db.js'

const router = Router()

// Obtener todas las clínicas (excluyendo deshabilitadas por defecto)
router.get('/', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 100)
    const offset = parseInt(req.query.offset) || 0
    const [rows] = await pool.query(
      'SELECT id, name, email, phone, address, country, disabled FROM clinics ORDER BY name LIMIT ? OFFSET ?',
      [limit, offset]
    )
    res.json(rows)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Error al obtener clínicas' })
  }
})

// Crear clínica
router.post('/', async (req, res) => {
  const { name, email, phone, address, country } = req.body
  if (!name) return res.status(400).json({ error: 'Nombre de clínica es obligatorio' })
  try {
    const [result] = await pool.query(
      'INSERT INTO clinics (name, email, phone, address, country, disabled) VALUES (?, ?, ?, ?, ?, FALSE)',
      [name, email || null, phone || null, address || null, country || null]
    )
    return res.status(201).json({ id: result.insertId, name, email, phone: phone || null, address: address || null, country: country || null, disabled: false })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Error al guardar clínica' })
  }
})

// Actualizar clínica
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const { name, email, phone, address, country } = req.body
  if (!id || !name) return res.status(400).json({ error: 'ID y nombre son obligatorios' })
  try {
    await pool.query(
      'UPDATE clinics SET name=?, email=?, phone=?, address=?, country=? WHERE id=?',
      [name, email || null, phone || null, address || null, country || null, id]
    )
    return res.json({ id, name, email, phone: phone || null, address: address || null, country: country || null })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Error al actualizar clínica' })
  }
})

// Deshabilitar clínica (y sus usuarios en cascade)
router.patch('/:id/disable', async (req, res) => {
  const id = parseInt(req.params.id)
  if (!id) return res.status(400).json({ error: 'ID inválido' })
  try {
    // Desactivar clínica
    await pool.query('UPDATE clinics SET disabled = TRUE WHERE id = ?', [id])
    // Desactivar todos los usuarios de esta clínica en cascade
    await pool.query('UPDATE users SET disabled = TRUE WHERE clinic_id = ?', [id])
    res.json({ success: true, message: 'Clínica y sus usuarios deshabilitados' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Error al deshabilitar clínica' })
  }
})

// Habilitar clínica
router.patch('/:id/enable', async (req, res) => {
  const id = parseInt(req.params.id)
  if (!id) return res.status(400).json({ error: 'ID inválido' })
  try {
    await pool.query('UPDATE clinics SET disabled = FALSE WHERE id = ?', [id])
    res.json({ success: true, message: 'Clínica habilitada' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Error al habilitar clínica' })
  }
})

// Eliminar clínica (solo si no tiene usuarios)
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  if (!id) return res.status(400).json({ error: 'ID inválido' })
  try {
    // Verificar si tiene usuarios
    const [users] = await pool.query('SELECT COUNT(*) as count FROM users WHERE clinic_id = ?', [id])
    if (users[0].count > 0) {
      return res.status(400).json({ error: `No se puede eliminar. La clínica tiene ${users[0].count} usuario(s) asociado(s). Primero desactívelos o elimínelos.` })
    }

    await pool.query('DELETE FROM clinics WHERE id = ?', [id])
    res.json({ success: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Error al eliminar clínica' })
  }
})

export default router
