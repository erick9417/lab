import { Router } from 'express'
import pool from '../db.js'

const router = Router()

// GET /api/patients - lista de pacientes (hasta 1000 registros)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, phone, email, birth_date AS birthDate, clinic, notes FROM patients ORDER BY id DESC LIMIT 1000'
    )
    res.json(rows)
  } catch (err) {
    console.error('Error fetching patients', err)
    res.status(500).json({ error: 'Error al obtener pacientes' })
  }
})

export default router
