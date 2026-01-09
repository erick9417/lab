import schedule from 'node-schedule'
import { executeAutomaticBackup } from './services/backupService.js'

/**
 * Configura trabajos programados (cron jobs) para el sistema
 */
export function setupScheduledJobs() {
  console.log('[SCHEDULER] Initializing scheduled jobs...')

  // Backup automático todos los domingos a las 3:00 AM
  const backupJob = schedule.scheduleJob('0 3 * * 0', async () => {
    console.log('[SCHEDULER] Running automatic backup (Sunday 3:00 AM)...')
    try {
      const result = await executeAutomaticBackup()
      if (result.success) {
        console.log(`[SCHEDULER] ✅ Backup completed: ${result.backup}`)
      } else {
        console.error(`[SCHEDULER] ❌ Backup failed: ${result.error}`)
      }
    } catch (error) {
      console.error('[SCHEDULER] Backup job error:', error)
    }
  })

  console.log('[SCHEDULER] ✅ Scheduled jobs configured:')
  console.log('  • Automatic database backup: Every Sunday at 3:00 AM')
  
  // Retornar trabajos para poder cancelarlos si es necesario
  return {
    backupJob
  }
}

/**
 * Cancela todos los trabajos programados
 */
export function cancelScheduledJobs(jobs) {
  if (jobs && jobs.backupJob) {
    jobs.backupJob.cancel()
    console.log('[SCHEDULER] Scheduled jobs cancelled')
  }
}

export default { setupScheduledJobs, cancelScheduledJobs }
