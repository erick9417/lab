import { Router } from 'express'
import pool from '../db.js'

const router = Router()

// Obtener todas las solicitudes
router.get('/', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 100)
    const offset = parseInt(req.query.offset) || 0
    const [rows] = await pool.query(`
      SELECT r.id, r.patient_id, r.doctor_name, r.template_type, r.foot_side, r.shoe_size, r.observations, r.created_at
      FROM requests r
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `, [limit, offset])
    res.json(rows)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Error al obtener solicitudes' })
  }
})

// Crear solicitud de plantilla
router.post('/', async (req, res) => {
  const { patientId, doctorName, templateType, footSide, shoeSize, conditions, observations } = req.body
  if (!patientId || !doctorName || !templateType || !footSide || !shoeSize) {
    return res.status(400).json({ error: 'Campos obligatorios: patientId, doctorName, templateType, footSide, shoeSize' })
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO requests (patient_id, doctor_name, template_type, foot_side, shoe_size, conditions_json, observations) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [patientId, doctorName, templateType, footSide, shoeSize, JSON.stringify(conditions || {}), observations || null]
    )
    res.status(201).json({ id: result.insertId })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Error al crear solicitud' })
  }
})

export default router
