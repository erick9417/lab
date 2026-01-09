/**
 * RUTAS DE BACKUP Y RESTORE - Backend API (simplificado, sin BD)
 * 
 * GET  /api/backups              - Obtener historial de backups
 * POST /api/backups/manual       - Ejecutar backup manual inmediato
 * GET  /api/backups/:id/download - Descargar un backup
 * POST /api/backups/:id/restore  - Restaurar un backup
 */

import express from 'express'
import { createDatabaseBackup, getBackupHistory } from '../services/backupService.js'
import path from 'path'
import fs from 'fs'
import { spawn } from 'child_process'

const router = express.Router()

/**
 * GET /api/backups
 * Obtener historial de backups realizados
 */
router.get('/', (req, res) => {
  try {
    const history = getBackupHistory()
    
    // Calcular próximo backup (hoy a las 3 AM)
    const now = new Date()
    const nextBackup = new Date(now)
    nextBackup.setHours(3, 0, 0, 0)
    if (nextBackup <= now) {
      nextBackup.setDate(nextBackup.getDate() + 1)
    }

    res.json({
      success: true,
      backups: history.map((b, idx) => ({
        id: idx + 1,
        type: 'Manual',
        date: b.date,
        size: b.sizeFormatted,
        chunks: 1,
        status: 'Completado',
        filename: b.filename
      })),
      status: {
        lastBackup: history.length > 0 ? history[0].date : null,
        nextBackup: nextBackup.toISOString(),
        serverSpace: { used: 8566, total: 29639, unit: 'GB' },
        cloudSpace: { used: 0, total: 5, unit: 'GB' },
        archiveCount: 0
      },
      total: history.length,
      message: `${history.length} backups disponibles`
    })
  } catch (error) {
    console.error('[BACKUPS] Error:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

/**
 * POST /api/backups/manual
 * Ejecutar backup manual inmediato
 * Respuesta inmediata + ejecución en background
 */
router.post('/manual', async (req, res) => {
  try {
    // Responder inmediatamente al cliente
    res.json({
      success: true,
      message: 'Backup iniciado. Se ejecutará en segundo plano.',
      timestamp: new Date().toISOString()
    })

    // Ejecutar backup en background (sin esperar)
    setImmediate(async () => {
      try {
        const result = await createDatabaseBackup()
        console.log('[BACKUP MANUAL] Completed:', result)
      } catch (error) {
        console.error('[BACKUP MANUAL] Error:', error)
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

/**
 * GET /api/backups/:id/download
 * Descargar un backup
 */
router.get('/:id/download', (req, res) => {
  try {
    const backupId = parseInt(req.params.id)
    const history = getBackupHistory()
    
    if (backupId < 1 || backupId > history.length) {
      return res.status(404).json({ error: 'Backup no encontrado' })
    }

    const backup = history[backupId - 1]
    const backupDir = process.env.BACKUP_DIR || path.join(process.cwd(), '../backups')
    const backupPath = path.join(backupDir, backup.filename)

    if (!fs.existsSync(backupPath)) {
      return res.status(404).json({ error: 'Archivo de backup no encontrado en el servidor' })
    }

    // Set headers explicitly for file download
    res.setHeader('Content-Type', 'application/octet-stream')
    res.setHeader('Content-Disposition', `attachment; filename="${backup.filename}"`)
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0')
    
    // Send file directly
    res.sendFile(backupPath)
    const backupPath = path.join(backupDir, backup.filename)

    if (!fs.existsSync(backupPath)) {
      return res.status(404).json({ error: 'Archivo de backup no encontrado en el servidor' })
    }

    // Responder inmediatamente
    res.json({
      success: true,
      message: 'Restauración iniciada en segundo plano.',
      backupFile: backup.filename,
      timestamp: new Date().toISOString()
    })

    // Ejecutar restauración en background de forma segura
    setImmediate(() => {
      try {
        console.log(`[RESTORE] Iniciando restauración desde ${backup.filename}`)
        
        // Verificar que el archivo existe y es legible
        const stats = fs.statSync(backupPath)
        console.log(`[RESTORE] Tamaño del backup: ${(stats.size / 1024 / 1024).toFixed(2)} MB`)
        
        // Si mysql está disponible, ejecutar restauración
        const mysqlCmd = spawn('mysql', [
          `-h${process.env.DB_HOST || 'localhost'}`,
          `-u${process.env.DB_USER || 'root'}`,
          `${process.env.DB_PASSWORD ? `-p${process.env.DB_PASSWORD}` : ''}`,
          process.env.DB_NAME || 'lucvan_sistema'
        ], { stdio: ['pipe', 'pipe', 'pipe'] })

        const backupContent = fs.readFileSync(backupPath, 'utf8')
        mysqlCmd.stdin.write(backupContent)
        mysqlCmd.stdin.end()

        let stderr = ''
        mysqlCmd.stderr.on('data', (data) => {
          stderr += data.toString()
        })

        mysqlCmd.on('close', (code) => {
          if (code === 0) {
            console.log(`[RESTORE] ✅ Restauración completada desde ${backup.filename}`)
          } else {
            console.error(`[RESTORE] ❌ Error en restauración (código ${code}): ${stderr}`)
          }
        })

        mysqlCmd.on('error', (err) => {
          console.error('[RESTORE] Error ejecutando mysql:', err.message)
          console.log('[RESTORE] Nota: MySQL podría no estar instalado o en el PATH')
        })
      } catch (error) {
        console.error('[RESTORE] Error en restauración:', error.message)
      }
    })
  } catch (error) {
    console.error('[RESTORE] Error:', error.message)
    res.status(500).json({ error: 'Error al procesar restauración: ' + error.message })
  }
})

export default router
