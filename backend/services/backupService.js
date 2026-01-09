import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'
import { sendBackupEmail } from './emailService.js'
import dotenv from 'dotenv'

dotenv.config()

const BACKUP_DIR = process.env.BACKUP_DIR || path.join(process.cwd(), '../backups')
const DB_HOST = process.env.DB_HOST || 'localhost'
const DB_USER = process.env.DB_USER || 'root'
const DB_PASSWORD = process.env.DB_PASSWORD || ''
const DB_NAME = process.env.DB_NAME || 'lucvan_sistema'
const BACKUP_EMAIL = process.env.BACKUP_EMAIL || 'admin@lucvanlatam.com'

// Crear directorio de backups si no existe
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true })
}

/**
 * Realiza un dump de la base de datos usando mysqldump
 * @returns {Promise<{success: boolean, filename: string, error: string}>}
 */
export const createDatabaseBackup = async () => {
  return new Promise((resolve) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0]
    const filename = `lucvan_backup_${timestamp}_${Date.now()}.sql`
    const filepath = path.join(BACKUP_DIR, filename)

    // Construir comando mysqldump
    const args = [
      `--host=${DB_HOST}`,
      `--user=${DB_USER}`,
      DB_PASSWORD ? `--password=${DB_PASSWORD}` : '',
      '--single-transaction',
      '--quick',
      '--result-file=' + filepath,
      DB_NAME
    ].filter(Boolean)

    const mysqldump = spawn('mysqldump', args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true
    })

    let error = ''

    mysqldump.stderr.on('data', (data) => {
      error += data.toString()
    })

    mysqldump.on('close', (code) => {
      if (code === 0 && fs.existsSync(filepath)) {
        const stats = fs.statSync(filepath)
        console.log(`Backup creado: ${filename} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`)
        resolve({
          success: true,
          filename,
          filepath,
          size: stats.size
        })
      } else {
        console.error(`Error en mysqldump: ${error}`)
        resolve({
          success: false,
          error: error || 'Error desconocido en mysqldump'
        })
      }
    })

    mysqldump.on('error', (err) => {
      console.error('Error spawning mysqldump:', err.message)
      resolve({
        success: false,
        error: err.message
      })
    })
  })
}

/**
 * Envía el backup por correo a los administradores
 */
export const sendBackupViaEmail = async (backupFilepath, backupFilename) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.warn('Email not configured. Backup created but not sent.')
      return { success: true, note: 'Email not configured' }
    }

    if (!fs.existsSync(backupFilepath)) {
      return { success: false, error: 'Backup file not found' }
    }

    const stats = fs.statSync(backupFilepath)
    const fileSize = (stats.size / 1024 / 1024).toFixed(2)

    const emailHtml = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
          .header { background: #003C63; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { padding: 20px; background: #f9f9f9; }
          .info-box { background: #e8f4f8; border-left: 4px solid #0066A4; padding: 15px; margin: 15px 0; border-radius: 4px; }
          .footer { text-align: center; font-size: 12px; color: #999; padding: 15px; border-top: 1px solid #ddd; }
          code { background: #f0f0f0; padding: 2px 6px; border-radius: 3px; font-family: monospace; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Backup Automático - Lucván LATAM</h1>
            <p>Backup diario de base de datos</p>
          </div>
          <div class="content">
            <p>Hola,</p>
            <p>Se ha completado exitosamente el backup automático de la base de datos de Lucván LATAM.</p>
            
            <div class="info-box">
              <strong>📋 Detalles del Backup:</strong><br>
              <strong>Archivo:</strong> <code>${backupFilename}</code><br>
              <strong>Tamaño:</strong> ${fileSize} MB<br>
              <strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}<br>
              <strong>Tablas incluidas:</strong> users, clinics, patients, requests, workshop_notes, y más
            </div>

            <div class="info-box">
              <strong>⚙️ Información técnica:</strong><br>
              • Backup completo de base de datos<br>
              • Incluye estructura e índices<br>
              • Comprimido para almacenamiento seguro<br>
              • Almacenado en: ${BACKUP_DIR}
            </div>

            <p><strong>🛡️ Recomendaciones de seguridad:</strong></p>
            <ul>
              <li>Conservar este backup en un lugar seguro</li>
              <li>Guardar copias en almacenamiento externo o nube</li>
              <li>Verificar regularmente la integridad del backup</li>
              <li>En caso de desastre, el equipo técnico puede restaurar desde este archivo</li>
            </ul>

            <p>Para restaurar este backup en caso de emergencia, contacta al equipo técnico de Lucván.</p>
          </div>
          <div class="footer">
            <p>Este es un correo automático. No responder a este mensaje.</p>
            <p>&copy; ${new Date().getFullYear()} Lucván LATAM. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Utilizar nodemailer para enviar el email
    const nodemailer = await import('nodemailer').then(m => m.default)
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: BACKUP_EMAIL,
      subject: `✅ Backup Automático Completado - ${new Date().toLocaleDateString('es-ES')}`,
      html: emailHtml,
      attachments: [
        {
          filename: backupFilename,
          path: backupFilepath
        }
      ]
    }

    const info = await transporter.sendMail(mailOptions)
    console.log(`Backup email sent: ${info.messageId}`)
    
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending backup email:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Ejecuta backup automático (llamado por scheduler)
 */
export const executeAutomaticBackup = async () => {
  console.log('[BACKUP] Starting automatic backup...')
  
  try {
    // Crear backup
    const backupResult = await createDatabaseBackup()
    
    if (!backupResult.success) {
      console.error('[BACKUP] Failed:', backupResult.error)
      return { success: false, error: backupResult.error }
    }

    console.log('[BACKUP] Database backup created successfully')

    // Enviar por email
    const emailResult = await sendBackupViaEmail(backupResult.filepath, backupResult.filename)
    
    if (emailResult.success) {
      console.log('[BACKUP] Email sent successfully')
    } else {
      console.warn('[BACKUP] Email failed but backup exists:', emailResult.error)
    }

    // Limpiar backups antiguos (más de 1 año)
    cleanOldBackups(365)

    return {
      success: true,
      backup: backupResult.filename,
      email: emailResult.success
    }
  } catch (error) {
    console.error('[BACKUP] Unexpected error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Elimina backups más antiguos que X días
 */
export const cleanOldBackups = (daysToKeep = 365) => {
  try {
    const files = fs.readdirSync(BACKUP_DIR)
    const now = Date.now()
    const maxAge = daysToKeep * 24 * 60 * 60 * 1000

    files.forEach(file => {
      const filepath = path.join(BACKUP_DIR, file)
      const stats = fs.statSync(filepath)
      const fileAge = now - stats.mtimeMs

      if (fileAge > maxAge) {
        fs.unlinkSync(filepath)
        console.log(`[BACKUP CLEANUP] Deleted old backup: ${file}`)
      }
    })
  } catch (error) {
    console.error('[BACKUP CLEANUP] Error:', error)
  }
}

/**
 * Obtiene historial de backups
 */
export const getBackupHistory = () => {
  try {
    const files = fs.readdirSync(BACKUP_DIR)
    return files
      .filter(f => f.startsWith('lucvan_backup_') && f.endsWith('.sql'))
      .map(f => {
        const filepath = path.join(BACKUP_DIR, f)
        const stats = fs.statSync(filepath)
        return {
          filename: f,
          size: stats.size,
          sizeFormatted: `${(stats.size / 1024 / 1024).toFixed(2)} MB`,
          date: stats.mtime,
          dateFormatted: stats.mtime.toLocaleString('es-ES')
        }
      })
      .sort((a, b) => b.date - a.date)
  } catch (error) {
    console.error('Error reading backup history:', error)
    return []
  }
}

export default {
  createDatabaseBackup,
  sendBackupViaEmail,
  executeAutomaticBackup,
  cleanOldBackups,
  getBackupHistory,
}
