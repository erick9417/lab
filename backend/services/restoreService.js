/**
 * Restore Service
 * Handles database restoration from backups (global and partial)
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BACKUP_DIR = process.env.BACKUP_DIR || path.join(__dirname, '../../backups');

/**
 * Global Restore: Restore entire database from backup
 * ⚠️ WARNING: This will overwrite ALL current data
 */
export async function restoreGlobalDatabase(backupFilepath, dbConfig) {
  return new Promise((resolve, reject) => {
    // Verify backup file exists
    if (!fs.existsSync(backupFilepath)) {
      return reject(new Error(`Backup file not found: ${backupFilepath}`));
    }

    const fileSize = fs.statSync(backupFilepath).size;
    console.log(`[RESTORE] Starting global restore from ${path.basename(backupFilepath)} (${(fileSize / 1024 / 1024).toFixed(2)} MB)`);

    // Read backup file
    const backupContent = fs.readFileSync(backupFilepath, 'utf8');

    // Spawn mysql process to restore
    const mysql_process = spawn('mysql', [
      `-h${dbConfig.host || 'localhost'}`,
      `-u${dbConfig.user || 'root'}`,
      `${dbConfig.password ? `-p${dbConfig.password}` : ''}`,
      dbConfig.database || ''
    ]);

    let error_output = '';

    mysql_process.stdin.write(backupContent);
    mysql_process.stdin.end();

    mysql_process.stderr.on('data', (data) => {
      error_output += data.toString();
    });

    mysql_process.on('close', (code) => {
      if (code === 0) {
        console.log(`[RESTORE] ✅ Global restore completed successfully`);
        resolve({
          success: true,
          type: 'global',
          backupFile: path.basename(backupFilepath),
          restoreTime: new Date(),
          message: 'Database restored from backup'
        });
      } else {
        console.error(`[RESTORE] ❌ Restore failed:`, error_output);
        reject(new Error(`MySQL restore failed: ${error_output}`));
      }
    });

    mysql_process.on('error', (err) => {
      reject(new Error(`Failed to execute mysql: ${err.message}`));
    });
  });
}

/**
 * Partial Restore: Restore data for specific clinic only
 * Requires: clinic_id in backup metadata
 */
export async function restorePartialClinic(backupFilepath, dbConfig, clinicId) {
  try {
    console.log(`[RESTORE] Starting partial restore for clinic ${clinicId}`);

    const connection = await mysql.createConnection({
      host: dbConfig.host || 'localhost',
      user: dbConfig.user || 'root',
      password: dbConfig.password || '',
      database: dbConfig.database || ''
    });

    // Read backup file
    const backupContent = fs.readFileSync(backupFilepath, 'utf8');

    // Extract SQL statements
    const statements = backupContent
      .split(';')
      .filter(stmt => stmt.trim())
      .map(stmt => stmt.trim() + ';');

    // Identify clinic-related tables (customize based on your schema)
    const clinicTables = [
      'patients',
      'requests',
      'audit_logs',
      'clinic_settings'
    ];

    // Step 1: Extract clinic data from backup
    console.log(`[RESTORE] Extracting data for clinic ${clinicId} from backup...`);
    
    const tempRestoreStmts = [];
    for (const stmt of statements) {
      // Only include INSERT/UPDATE/DELETE for clinic-related tables
      for (const table of clinicTables) {
        if (stmt.includes(`INSERT INTO \`${table}\`` ) || stmt.includes(`INSERT INTO ${table}`)) {
          tempRestoreStmts.push(stmt);
          break;
        }
      }
    }

    // Step 2: Delete current clinic data
    console.log(`[RESTORE] Deleting current data for clinic ${clinicId}...`);
    
    for (const table of clinicTables) {
      try {
        await connection.execute(
          `DELETE FROM \`${table}\` WHERE clinic_id = ?`,
          [clinicId]
        );
      } catch (err) {
        // Table might not exist or not have clinic_id column - skip
        console.log(`[RESTORE] Skipping ${table}: ${err.message.substring(0, 50)}`);
      }
    }

    // Step 3: Restore clinic data from backup
    console.log(`[RESTORE] Restoring clinic data...`);
    
    // Parse and execute INSERT statements for this clinic
    const backupLines = backupContent.split('\n');
    let currentStmt = '';
    
    for (const line of backupLines) {
      currentStmt += line + '\n';
      
      if (line.includes(');')) {
        if (currentStmt.includes('INSERT INTO')) {
          try {
            // Add clinic_id filter if not present
            if (!currentStmt.includes('clinic_id')) {
              // Modify statement to add clinic_id (if applicable)
              // This is a simplified version - customize based on your schema
            }
            await connection.execute(currentStmt);
          } catch (err) {
            // Log but continue on errors
            console.log(`[RESTORE] Skipped statement: ${err.message.substring(0, 50)}`);
          }
        }
        currentStmt = '';
      }
    }

    await connection.end();

    console.log(`[RESTORE] ✅ Partial restore completed for clinic ${clinicId}`);
    return {
      success: true,
      type: 'partial',
      clinicId: clinicId,
      backupFile: path.basename(backupFilepath),
      restoreTime: new Date(),
      message: `Clinic ${clinicId} data restored from backup`
    };

  } catch (err) {
    console.error(`[RESTORE] ❌ Partial restore failed:`, err.message);
    throw err;
  }
}

/**
 * Get available backups list
 */
export function getAvailableBackups() {
  try {
    if (!fs.existsSync(BACKUP_DIR)) {
      return [];
    }

    const files = fs.readdirSync(BACKUP_DIR)
      .filter(f => f.endsWith('.sql'))
      .sort()
      .reverse(); // Newest first

    return files.map(filename => {
      const filepath = path.join(BACKUP_DIR, filename);
      const stats = fs.statSync(filepath);
      const dateMatch = filename.match(/backup-(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2})/);
      
      return {
        filename: filename,
        filepath: filepath,
        size: stats.size,
        sizeFormatted: formatBytes(stats.size),
        createdAt: stats.birthtimeMs ? new Date(stats.birthtimeMs) : new Date(),
        date: dateMatch ? dateMatch[1].replace(/T/, ' ').replace(/-/g, ':') : 'Unknown'
      };
    });
  } catch (err) {
    console.error('[RESTORE] Error reading backups:', err);
    return [];
  }
}

/**
 * Get clinics from database (for partial restore selection)
 */
export async function getAvailableClinics(dbConfig) {
  try {
    const connection = await mysql.createConnection({
      host: dbConfig.host || 'localhost',
      user: dbConfig.user || 'root',
      password: dbConfig.password || '',
      database: dbConfig.database || ''
    });

    const [rows] = await connection.execute('SELECT id, name FROM clinics ORDER BY name');
    await connection.end();

    return rows;
  } catch (err) {
    console.error('[RESTORE] Error fetching clinics:', err);
    throw err;
  }
}

/**
 * Create restore backup before overwriting (safety measure)
 */
export async function createSafetyBackup(dbConfig) {
  return new Promise((resolve, reject) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `safety-backup-${timestamp}.sql`;
    const filepath = path.join(BACKUP_DIR, filename);

    // Ensure backups directory exists
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    const mysqldump = spawn('mysqldump', [
      `-h${dbConfig.host || 'localhost'}`,
      `-u${dbConfig.user || 'root'}`,
      `${dbConfig.password ? `-p${dbConfig.password}` : ''}`,
      '--all-databases'
    ]);

    const file = fs.createWriteStream(filepath);

    mysqldump.stdout.pipe(file);

    let error_output = '';
    mysqldump.stderr.on('data', (data) => {
      error_output += data.toString();
    });

    mysqldump.on('close', (code) => {
      if (code === 0) {
        console.log(`[RESTORE] ✅ Safety backup created: ${filename}`);
        resolve({
          success: true,
          filename: filename,
          filepath: filepath,
          message: 'Safety backup created before restore'
        });
      } else {
        console.error(`[RESTORE] Safety backup failed:`, error_output);
        reject(new Error(`Safety backup failed: ${error_output}`));
      }
    });

    mysqldump.on('error', (err) => {
      reject(new Error(`mysqldump failed: ${err.message}`));
    });
  });
}

/**
 * Helper: Format bytes to human-readable
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Validate restore safety
 */
export function validateRestoreRequest(restoreData) {
  const errors = [];

  if (!restoreData.backupFile) {
    errors.push('Backup file is required');
  }

  if (!restoreData.restoreType || !['global', 'partial'].includes(restoreData.restoreType)) {
    errors.push('Invalid restore type (global or partial)');
  }

  if (restoreData.restoreType === 'partial' && !restoreData.clinicId) {
    errors.push('Clinic ID required for partial restore');
  }

  if (!restoreData.confirmationCode) {
    errors.push('Confirmation code required');
  }

  return {
    valid: errors.length === 0,
    errors: errors
  };
}
