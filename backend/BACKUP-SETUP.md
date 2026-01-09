# Sistema de Backup Automático - Lucván LATAM

## Visión General

El sistema incluye **backup automático diario** de la base de datos a media noche (00:00), con envío automático por correo al administrador. Esto garantiza disaster recovery en caso de pérdida de datos.

## Componentes

### 1. `backupService.js`
Servicio que maneja:
- **`createDatabaseBackup()`** - Genera dump SQL usando `mysqldump`
- **`sendBackupViaEmail()`** - Envía backup por correo con detalles
- **`executeAutomaticBackup()`** - Orquesta backup y envío
- **`cleanOldBackups()`** - Elimina backups de más de 30 días
- **`getBackupHistory()`** - Lista backups disponibles

### 2. `scheduler.js`
Gestor de trabajos programados:
- Configura cron jobs con `node-schedule`
- Ejecuta backup automáticamente a media noche
- Permite agregar otros trabajos programados

## Instalación

### 1. Instalar dependencia de scheduler
```bash
npm install node-schedule
```

### 2. Asegurar que mysqldump está disponible
- **Windows**: Incluido con MySQL Community Server. Asegurar que está en PATH.
- **Linux/Mac**: `sudo apt-get install mysql-server` o similar
- Verificar: `mysqldump --version`

### 3. Configurar variables de entorno en `.env`

```env
# Base de datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=lucvan_sistema

# Backup
BACKUP_DIR=../backups          # Directorio donde guardar backups
BACKUP_EMAIL=admin@lucvanlatam.com  # Email que recibe los backups

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=tu-app-password
SMTP_FROM=tu-email@gmail.com
SMTP_REPLY_TO=soporte@lucvanlatam.com
```

## Integración en el Servidor

En tu archivo **`index.server.js`** (o entrada principal del backend):

```javascript
import { setupScheduledJobs, cancelScheduledJobs } from './scheduler.js'

// ... después de configurar express ...

// Inicializar trabajos programados
let scheduledJobs
try {
  scheduledJobs = setupScheduledJobs()
  console.log('✅ Scheduled jobs initialized')
} catch (error) {
  console.error('Error initializing scheduler:', error)
}

// Manejar shutdown gracefully
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received')
  if (scheduledJobs) {
    cancelScheduledJobs(scheduledJobs)
  }
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})

const port = process.env.PORT || 4000
const server = app.listen(port, () => {
  console.log(`API running on port ${port}`)
})
```

## Endpoint de API (Opcional)

Para permitir backups manuales desde el admin panel:

```javascript
// routes/backup.js
import express from 'express'
import { executeAutomaticBackup, getBackupHistory } from '../services/backupService.js'
import { authenticate } from '../middleware/auth.js'  // Solo admin

const router = express.Router()

// GET: Obtener historial de backups
router.get('/', authenticate, async (req, res) => {
  try {
    const history = getBackupHistory()
    res.json({ success: true, backups: history })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// POST: Ejecutar backup manual
router.post('/manual', authenticate, async (req, res) => {
  try {
    const result = await executeAutomaticBackup()
    if (result.success) {
      res.json({ success: true, backup: result.backup })
    } else {
      res.status(500).json({ error: result.error })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
```

Agregar a `index.server.js`:
```javascript
import backupRouter from './routes/backup.js'
app.use('/api/backup', backupRouter)
```

## Flujo de Backup Automático

```
00:00 (Medianoche)
    ↓
[Scheduler] Dispara executeAutomaticBackup()
    ↓
[createDatabaseBackup] Ejecuta mysqldump
    ↓
[archivo.sql] Creado en BACKUP_DIR
    ↓
[sendBackupViaEmail] Envía archivo por correo
    ↓
[cleanOldBackups] Elimina backups > 30 días
    ↓
✅ Proceso completado (log en servidor)
```

## Monitoreo

### Logs
El servidor registra cada paso:
```
[SCHEDULER] Running automatic backup...
[BACKUP] Starting automatic backup...
[BACKUP] Database backup created successfully
[BACKUP] Email sent successfully
[BACKUP CLEANUP] Deleted old backup: lucvan_backup_2025-11-01_123456.sql
```

### Verificación Manual
```bash
# Ver backups disponibles
ls -la ../backups/

# Probar mysqldump
mysqldump -h localhost -u root -p lucvan_sistema > test_backup.sql

# Restaurar desde backup (ADVERTENCIA: sobrescribe datos)
mysql -h localhost -u root -p lucvan_sistema < backup_file.sql
```

## Almacenamiento y Seguridad

### Recomendaciones
1. **Ubicación**: Guardar backups en disco con suficiente espacio
2. **Respaldo externo**: Copiar backups a AWS S3, Azure Blob, o nube
3. **Encriptación**: En producción, encriptar archivos de backup
4. **Permisos**: Restringir acceso a directorio `/backups` (chmod 700)
5. **Retención**: Mantener mínimo 30 días de histórico

### Solución recomendada con AWS S3 (Futuro)
```javascript
// Agregar a backupService.js
import AWS from 'aws-sdk'

export const uploadBackupToS3 = async (filepath, filename) => {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
  })

  const fileContent = fs.readFileSync(filepath)
  const params = {
    Bucket: process.env.AWS_BACKUP_BUCKET,
    Key: `backups/${filename}`,
    Body: fileContent,
    ServerSideEncryption: 'AES256'
  }

  return s3.upload(params).promise()
}
```

## Documentos Adjuntos (Futuro)

Referente a mover documentos cada cierto tiempo:
- Implementar archivado automático (archivos > 12 meses a carpeta `/archived`)
- Usar scheduled job similar a backups
- Mover a almacenamiento más económico (ej: AWS Glacier)

```javascript
// scheduleJob para documentos
schedule.scheduleJob('0 1 * * 0', async () => {  // Cada domingo a 01:00
  console.log('[SCHEDULER] Running document archival...')
  await archiveOldDocuments(12)  // Archivos > 12 meses
})
```

## Troubleshooting

### "mysqldump not found"
```bash
# Windows: Agregar MySQL al PATH
# Linux: sudo apt-get install mysql-client

# Verificar
which mysqldump  # Linux/Mac
where mysqldump  # Windows
```

### "Email not configured"
- Backups se crean pero no se envían
- Verificar variables SMTP_* en `.env`
- Testear conexión SMTP

### Backup muy lento
- Reducir límite de backups frecuentes
- Ejecutar en horario de menos carga
- Optimizar BD (indices, purgas)

## Testing

```bash
# Ejecutar backup manual
curl -X POST http://localhost:4000/api/backup/manual \
  -H "Authorization: Bearer TOKEN"

# Ver historial
curl http://localhost:4000/api/backup \
  -H "Authorization: Bearer TOKEN"
```
