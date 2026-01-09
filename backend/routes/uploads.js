/**
 * Rutas para manejo de descargas de archivos adjuntos
 * GET /api/uploads/:requestId/:filename - Descargar archivo
 */

import express from 'express'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const router = express.Router()
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadsDir = path.join(__dirname, '../uploads')

// Crear directorio si no existe
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

/**
 * GET /api/uploads/:requestId/:filename
 * Descargar archivo adjunto
 */
router.get('/:requestId/:filename', (req, res) => {
  try {
    const { requestId, filename } = req.params
    
    // Validar que el filename no contenga path traversal
    const sanitized = path.basename(filename)
    const filePath = path.join(uploadsDir, requestId.toString(), sanitized)
    
    // Verificar que el archivo está dentro de uploadsDir
    const realPath = path.resolve(filePath)
    if (!realPath.startsWith(path.resolve(uploadsDir))) {
      return res.status(400).json({ error: 'Ruta inválida' })
    }
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Archivo no encontrado' })
    }
    
    // Servir el archivo
    res.setHeader('Content-Type', 'application/octet-stream')
    res.setHeader('Content-Disposition', `attachment; filename="${sanitized}"`)
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    
    const fileStream = fs.createReadStream(filePath)
    fileStream.on('error', (err) => {
      console.error('[UPLOADS] Error reading file:', err)
      res.status(500).json({ error: 'Error al descargar el archivo' })
    })
    fileStream.pipe(res)
  } catch (error) {
    console.error('[UPLOADS] Error:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
