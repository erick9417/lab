import { Router } from "express"
import pool from "../db.js"
import { exec } from "child_process"
import { promisify } from "util"
import fs from "fs/promises"
import path from "path"

const router = Router()
const execAsync = promisify(exec)

// Get backup history and system status
router.get("/", async (req, res) => {
  try {
    // Get backup history from database
    const [backups] = await pool.query(
      "SELECT id, type, created_at as date, size, chunks, status FROM backups ORDER BY created_at DESC LIMIT 50"
    )

    // Get server space usage
    const { stdout: dfOutput } = await execAsync("df -BG ~ | tail -1 | awk '{print $3,$2}'")
    const [usedStr, totalStr] = dfOutput.trim().split(' ')
    const used = parseFloat(usedStr.replace('G', ''))
    const total = parseFloat(totalStr.replace('G', ''))

    // Calculate next backup (next Sunday at 3:00 AM)
    const now = new Date()
    const nextSunday = new Date(now)
    nextSunday.setDate(now.getDate() + ((7 - now.getDay()) % 7 || 7))
    nextSunday.setHours(3, 0, 0, 0)

    // Get last backup
    const lastBackup = backups.length > 0 ? backups[0].date : null

    res.json({
      backups: backups.map(b => ({
        id: b.id,
        type: b.type === 'automatic' ? 'Automático' : 'Manual',
        date: b.date,
        size: b.size || 'Calculando...',
        chunks: b.chunks || 1,
        status: b.status || 'completed'
      })),
      status: {
        lastBackup,
        nextBackup: nextSunday.toISOString(),
        serverSpace: { used, total, unit: 'GB' },
        cloudSpace: { used: 0, total: 5, unit: 'GB' },
        archiveCount: 0
      }
    })
  } catch (e) {
    console.error('Error getting backup data:', e)
    res.status(500).json({ error: "Error al obtener datos de backup" })
  }
})

// Create manual backup
router.post("/manual", async (req, res) => {
  try {
    // Insert backup record with in_progress status
    const [result] = await pool.query(
      "INSERT INTO backups (type, status, created_at) VALUES ('manual', 'in_progress', NOW())"
    )
    
    const backupId = result.insertId

    // Start backup process in background
    setImmediate(async () => {
      try {
        const backupDir = process.env.BACKUP_DIR || '/home/lucvan5/backups'
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0]
        const backupFile = path.join(backupDir, `backup-manual-${timestamp}.sql`)

        // Ensure backup directory exists
        await fs.mkdir(backupDir, { recursive: true })

        // Create database dump
        const dbUser = process.env.DB_USER
        const dbPassword = process.env.DB_PASSWORD
        const dbName = process.env.DB_NAME
        
        await execAsync(`mysqldump -u ${dbUser} -p${dbPassword} ${dbName} > ${backupFile}`)
        
        // Get file size
        const stats = await fs.stat(backupFile)
        const sizeInGB = (stats.size / (1024 * 1024 * 1024)).toFixed(2) + ' GB'

        // Update backup record
        await pool.query(
          "UPDATE backups SET status = 'completed', size = ?, chunks = 1 WHERE id = ?",
          [sizeInGB, backupId]
        )

        console.log(`Manual backup ${backupId} completed successfully`)
      } catch (err) {
        console.error('Error creating backup:', err)
        await pool.query(
          "UPDATE backups SET status = 'failed' WHERE id = ?",
          [backupId]
        )
      }
    })

    res.json({ 
      message: "Backup manual iniciado", 
      backupId 
    })
  } catch (e) {
    console.error('Error starting manual backup:', e)
    res.status(500).json({ error: "Error al iniciar backup manual" })
  }
})

// Download backup
router.get("/:id/download", async (req, res) => {
  try {
    const { id } = req.params
    const [backups] = await pool.query("SELECT * FROM backups WHERE id = ?", [id])
    
    if (backups.length === 0) {
      return res.status(404).json({ error: "Backup no encontrado" })
    }

    const backup = backups[0]
    const backupDir = process.env.BACKUP_DIR || '/home/lucvan5/backups'
    const timestamp = new Date(backup.created_at).toISOString().replace(/[:.]/g, '-').split('T')[0]
    const backupFile = path.join(backupDir, `backup-${backup.type}-${timestamp}.sql`)

    res.download(backupFile)
  } catch (e) {
    console.error('Error downloading backup:', e)
    res.status(500).json({ error: "Error al descargar backup" })
  }
})

export default router
