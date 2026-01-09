/**
 * Servicio para manejo de uploads de archivos
 * Guarda archivos y genera URLs accesibles
 */

import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadsDir = path.join(__dirname, '../uploads')

// Crear directorio si no existe
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

/**
 * Guarda un archivo y retorna su URL
 * @param {Object} file - Objeto de archivo (Express multer)
 * @param {number} requestId - ID de la solicitud
 * @returns {Object} { filename, url, path, size }
 */
export function saveUploadedFile(file, requestId) {
  if (!file) return null
  
  try {
    // Crear directorio para la solicitud si no existe
    const requestDir = path.join(uploadsDir, requestId.toString())
    if (!fs.existsSync(requestDir)) {
      fs.mkdirSync(requestDir, { recursive: true })
    }
    
    // Guardar archivo con timestamp para evitar conflictos
    const timestamp = Date.now()
    const filename = `${timestamp}-${sanitizeFilename(file.originalname)}`
    const filePath = path.join(requestDir, filename)
    
    // Escribir archivo
    fs.writeFileSync(filePath, file.buffer)
    
    // Retornar objeto con metadatos
    return {
      name: file.originalname,
      filename: filename,
      url: `/api/uploads/${requestId}/${filename}`,
      path: filePath,
      size: file.size,
      mimetype: file.mimetype
    }
  } catch (error) {
    console.error('[UPLOADS] Error saving file:', error)
    throw error
  }
}

/**
 * Guarda múltiples archivos
 * @param {Array} files - Array de archivos (Express multer)
 * @param {number} requestId - ID de la solicitud
 * @returns {Array} Array de objetos con metadatos
 */
export function saveUploadedFiles(files, requestId) {
  if (!files || files.length === 0) return []
  
  return files.map(file => saveUploadedFile(file, requestId))
}

/**
 * Sanitiza nombre de archivo
 */
function sanitizeFilename(filename) {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .substring(0, 255)
}

/**
 * Elimina archivos de una solicitud
 * @param {number} requestId - ID de la solicitud
 */
export function deleteRequestFiles(requestId) {
  try {
    const requestDir = path.join(uploadsDir, requestId.toString())
    if (fs.existsSync(requestDir)) {
      fs.rmSync(requestDir, { recursive: true })
    }
  } catch (error) {
    console.error('[UPLOADS] Error deleting files:', error)
  }
}

/**
 * Obtiene URL para un archivo
 * @param {number} requestId - ID de la solicitud
 * @param {string} filename - Nombre del archivo
 * @returns {string} URL del archivo
 */
export function getFileUrl(requestId, filename) {
  return `/api/uploads/${requestId}/${filename}`
}
