/**
 * Rutas para manejo de solicitudes (requests)
 * Incluye: crear, obtener, actualizar estado, agregar notas
 */

import express from 'express'
import multer from 'multer'
import { saveUploadedFiles } from '../services/uploadService.js'

const router = express.Router()

// Configurar multer para archivos en memoria
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
  fileFilter: (req, file, cb) => {
    // Validar tipos de archivo
    const allowedMimes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
    
    if (allowedMimes.includes(file.mimetype) || file.originalname.match(/\.(pdf|jpg|jpeg|png|webp|doc|docx|xls|xlsx)$/i)) {
      cb(null, true)
    } else {
      cb(new Error('Tipo de archivo no permitido'))
    }
  }
})

/**
 * POST /api/requests
 * Crear nueva solicitud con archivos
 */
router.post('/', upload.array('files', 10), async (req, res) => {
  try {
    const {
      patientId,
      doctorName,
      templateType,
      footSide,
      shoeSize,
      specs,
      observations
    } = req.body

    // Validar campos obligatorios
    if (!patientId || !doctorName || !templateType || !footSide || !shoeSize) {
      return res.status(400).json({
        error: 'Campos obligatorios faltantes: patientId, doctorName, templateType, footSide, shoeSize'
      })
    }

    // Procesar archivos si existen
    let files = []
    let requestId = Math.floor(Math.random() * 1000000) // Simular ID de solicitud
    
    if (req.files && req.files.length > 0) {
      files = saveUploadedFiles(req.files, requestId)
      console.log('[REQUESTS] Files saved:', files)
    }

    // Crear objeto de solicitud (esto debería guardarse en BD)
    const request = {
      id: requestId,
      patientId: parseInt(patientId),
      doctorName,
      templateType,
      footSide,
      shoeSize: parseFloat(shoeSize),
      specs: typeof specs === 'string' ? JSON.parse(specs) : specs,
      observations,
      files: files,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    console.log('[REQUESTS] Created request:', request.id, 'with', files.length, 'files')

    res.status(201).json({
      success: true,
      request: request,
      message: 'Solicitud creada exitosamente'
    })
  } catch (error) {
    console.error('[REQUESTS] Error creating request:', error)
    res.status(500).json({
      error: 'Error al crear la solicitud: ' + error.message
    })
  }
})

/**
 * GET /api/requests
 * Obtener todas las solicitudes
 */
router.get('/', (req, res) => {
  // Stub - retornar array vacío o desde BD
  res.json([])
})

/**
 * GET /api/requests/:id
 * Obtener solicitud por ID
 */
router.get('/:id', (req, res) => {
  // Stub - obtener desde BD
  res.json({})
})

/**
 * PUT /api/requests/:id
 * Actualizar solicitud
 */
router.put('/:id', (req, res) => {
  // Stub - actualizar en BD
  res.json({ success: true })
})

/**
 * POST /api/requests/:id/notes
 * Agregar nota a solicitud
 */
router.post('/:id/notes', (req, res) => {
  const { note } = req.body
  if (!note) {
    return res.status(400).json({ error: 'Nota requerida' })
  }
  res.json({ success: true })
})

export default router
