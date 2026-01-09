# Solución de Backup Automático - Lucván LATAM

## 📋 Resumen

Se ha implementado un **sistema de backup automático diario** que:
- ✅ Se ejecuta a **media noche (00:00)** cada día
- ✅ Realiza dump de **todas las tablas de BD**
- ✅ Envía backup por **correo al administrador**
- ✅ Elimina backups antiguos (>30 días) **automáticamente**
- ✅ Mantiene **historial accesible** en servidor

## 🚀 Rápido inicio

### 1. Instalar dependencia
```bash
cd backend
npm install node-schedule
```

### 2. Configurar variables de entorno
Crear/actualizar `.env` con:
```env
# Base de datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=lucvan_sistema

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=tu-app-password
SMTP_FROM=tu-email@gmail.com

# Backup
BACKUP_DIR=../backups
BACKUP_EMAIL=admin@lucvanlatam.com
```

### 3. Integrar en servidor
Agregar en `index.server.js`:
```javascript
import { setupScheduledJobs } from './scheduler.js'

// Después de crear app
let scheduledJobs = setupScheduledJobs()

// Al cerrar servidor
process.on('SIGTERM', () => {
  if (scheduledJobs) scheduledJobs.backupJob.cancel()
  server.close()
})
```

## 📁 Archivos implementados

```
backend/
├── services/
│   └── backupService.js          # Lógica de backup y email
├── scheduler.js                   # Cron jobs (media noche)
├── BACKUP-SETUP.md               # Documentación detallada
└── BACKUP-INTEGRATION-EXAMPLE.md # Ejemplo de integración
```

## 🔄 Cómo funciona

```
Diariamente a las 00:00
    ↓
1. Genera dump SQL (mysqldump)
    ↓
2. Guarda archivo en /backups
    ↓
3. Envía archivo por correo
    ↓
4. Limpia backups > 30 días
    ↓
✅ Done
```

## 📧 Email de backup

El administrador recibe:
- ✅ Archivo SQL adjunto
- ✅ Detalles: tamaño, fecha, tablas incluidas
- ✅ Instrucciones de restauración
- ✅ Recomendaciones de seguridad

## 📊 Monitoreo

Ver logs en consola del servidor:
```
[SCHEDULER] Running automatic backup...
[BACKUP] Starting automatic backup...
[BACKUP] Database backup created successfully (45.23 MB)
[BACKUP] Email sent successfully
[BACKUP CLEANUP] Deleted old backup: lucvan_backup_2025-11-01.sql
```

## 🛡️ Disaster Recovery

En caso de pérdida de datos:
1. El equipo técnico accede al directorio `/backups`
2. Elige el backup más reciente
3. Ejecuta: `mysql lucvan_sistema < backup_file.sql`
4. ✅ Datos restaurados

## 🔐 Seguridad

- Backups guardados en servidor protegido
- Email enviado con credenciales SMTP seguras
- Acceso restringido a `/backups` (chmod 700)
- Limpieza automática de archivos antiguos

## 📈 Futuro (No urgente)

### Documentos adjuntos (files)
- Agregar scheduler para archivar documentos > 12 meses
- Mover a almacenamiento económico (AWS Glacier)
- Mantener histórico de 2 años

### Mejorar backups
- Subir a AWS S3 o Azure (redundancia geográfica)
- Encriptar archivos backup
- Dashboard en admin para visualizar/descargar backups

## 📞 Soporte

Para preguntas o problemas:
- Revisar `BACKUP-SETUP.md` para detalles técnicos
- Ver logs del servidor: `[SCHEDULER]` o `[BACKUP]`
- Verificar variables de entorno `.env`
- Confirmar que `mysqldump` está disponible en PATH

---

✅ **Sistema de backup automático listo para producción**
