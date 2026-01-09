# Soluciones de Seguridad y Recuperación - Lucván LATAM

## 📌 Resumen Ejecutivo

Se han implementado tres soluciones para protección de datos:

### 1. ✅ Backup automático diario
- **Cuándo:** Cada día a las 00:00 (media noche)
- **Qué:** Dump completo de BD (todas las tablas)
- **Dónde:** Archivos `.sql` en servidor + correo
- **Retención:** Últimos 30 días

### 2. ✅ Backup manual bajo demanda
- **Cuándo:** Admin hace clic en "Realizar Backup Ahora"
- **Ejecución:** Inmediata (en background)
- **Confirmación:** Correo con archivo adjunto
- **Ubicación:** Panel Admin → Backups

### 3. ✅ Estrategia de recuperación (Rollback)
- **Global:** Restaurar BD completa a fecha específica
- **Parcial:** Restaurar solo datos de un cliente
- **Impacto:** Configurable según necesidad

---

## 🔐 Seguridad: SMTP Externo (Gmail)

### Problema resuelto
```
ANTES:
Servidor ❌ Almacena credenciales SMTP → Riesgo si hacker entra

DESPUÉS:
Servidor ✅ Solo credenciales de aplicación (limitadas)
         ✅ Separado en Gmail
         ✅ Se pueden revocar sin afectar servidor
```

### Configuración recomendada
```env
SMTP_HOST=smtp.gmail.com
SMTP_USER=lucvan-backups@gmail.com  # Cuenta dedicada
SMTP_PASSWORD=xxxx xxxx xxxx xxxx    # App Password (NO contraseña principal)
```

### Ventajas
- ✅ Seguridad de Google
- ✅ Auditoría de envíos
- ✅ 99.9% disponibilidad
- ✅ Escalable a múltiples servidores
- ✅ Fácil de rotar credenciales

**Documentación:** Ver `GMAIL-SMTP-SETUP.md`

---

## 🔄 Backup Automático Semanal

### Cómo funciona
```
[Domingo 3:00 AM]
  ↓
[Scheduler] Dispara trabajo programado
  ↓
[mysqldump] Ejecuta dump de BD
  ↓
[Guardar] Archivo en /backups
  ↓
[Enviar] Gmail envía archivo a admin@lucvanlatam.com
  ↓
[Limpiar] Elimina backups > 30 días
  ↓
✅ Completo
```

### Logs en servidor
```
[SCHEDULER] Running automatic backup (Sunday 3:00 AM)...
[BACKUP] Database backup created successfully (45.23 MB)
[BACKUP] Email sent successfully
[BACKUP CLEANUP] Deleted old backup
```

**Documentación:** Ver `BACKUP-SETUP.md`

---

## 🚀 Backup Manual (Botón en Admin)

### Integración en Dashboard
```
Admin Panel → Sección Backups
  ↓
Botón: "🔄 Realizar Backup Ahora"
  ↓
Cliquea → Confirmación inmediata
  ↓
Backend ejecuta en segundo plano
  ↓
Email llega en ~5-10 segundos
```

### Respuesta al usuario
```json
{
  "success": true,
  "message": "Backup iniciado. Se ejecutará en segundo plano y recibirá un correo cuando se complete.",
  "timestamp": "2025-01-06T10:30:45.123Z"
}
```

**Documentación:** Ver `MANUAL-BACKUP-INTEGRATION.md`

---

## 🔀 Estrategia de Rollback

### Rollback Global (Todo el sistema)
```
Restaurar BD completa a una fecha específica
↓
IMPACTO: Todos los usuarios ❌ (pierden datos posteriores)
↓
USO: Solo emergencias (ataque, corrupción grave)
```

**Proceso:**
1. Detener aplicación
2. Crear respaldo actual (por si acaso)
3. `mysql < backup_2025-01-04.sql`
4. Verificar integridad
5. Reiniciar aplicación

### Rollback Parcial (Clínica específica)
```
Restaurar datos de UNA clínica solamente
↓
IMPACTO: Solo esa clínica ✅ (otros no afectados)
↓
USO: Error de cliente, eliminación accidental, etc.
```

**Proceso:**
1. Extraer datos de clínica del backup
2. Eliminar datos actuales de esa clínica
3. Restaurar datos antiguos
4. Otros clientes continúan normalmente

**Documentación:** Ver `ROLLBACK-STRATEGY.md`

---

## 📊 Endpoints de API

```
GET  /api/backup
     ↓ Obtener historial de backups realizados

POST /api/backup/manual
     ↓ Ejecutar backup manual inmediato

GET  /api/backup/status
     ↓ Estado del sistema de backup
```

Todos requieren **rol admin** para acceso.

---

## 📋 Archivos documentados

```
backend/
├── services/
│   ├── backupService.js          # Lógica de backup
│   └── emailService.js           # Envío de correos
├── routes/
│   └── backup.js                 # Endpoints de API
├── scheduler.js                  # Cron jobs (media noche)
│
├── BACKUP-README.md              # ⭐ Guía rápida
├── BACKUP-SETUP.md               # Instalación y configuración
├── GMAIL-SMTP-SETUP.md           # ⭐ SMTP seguro con Gmail
├── ROLLBACK-STRATEGY.md          # ⭐ Recuperación de datos
├── MANUAL-BACKUP-INTEGRATION.md  # Botón en admin panel
└── BACKUP-INTEGRATION-EXAMPLE.md # Ejemplo en index.server.js
```

---

## 🛠️ Instalación rápida

### Paso 1: Dependencias
```bash
cd backend
npm install node-schedule
```

### Paso 2: Configurar Gmail
1. Crear cuenta: `lucvan-backups@gmail.com`
2. Habilitar 2FA
3. Generar contraseña de app: https://myaccount.google.com/apppasswords
4. Copiar contraseña (16 caracteres)

### Paso 3: Variables de entorno (`.env`)
```env
# Base de datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña

# Gmail SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=lucvan-backups@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx

# Backup
BACKUP_EMAIL=admin@lucvanlatam.com
```

### Paso 4: Integrar scheduler
Ver `BACKUP-INTEGRATION-EXAMPLE.md`

### Paso 5: Agregar rutas
```javascript
import backupRouter from './routes/backup.js'
app.use('/api/backup', backupRouter)
```

### Paso 6: Probar
```bash
npm start
# Deberías ver: [SCHEDULER] Scheduled jobs configured
```

---

## 🔍 Verificación

### Test 1: Email SMTP
```bash
node -e "
const nodemailer = require('nodemailer');
const t = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: { user: 'lucvan-backups@gmail.com', pass: 'xxxx xxxx xxxx xxxx' }
});
t.verify((e, ok) => console.log(e ? 'Error: ' + e : '✅ OK'));
"
```

### Test 2: Backup manual
```bash
curl -X POST http://localhost:4000/api/backup/manual \
  -H "Authorization: Bearer TOKEN"
```

### Test 3: Ver historial
```bash
curl http://localhost:4000/api/backup \
  -H "Authorization: Bearer TOKEN"
```

---

## 📈 Monitoreo en producción

### Logs diarios
```
[SCHEDULER] Running automatic backup...
[BACKUP] Database backup created successfully
[BACKUP] Email sent successfully
```

### Alertas a configurar
- Email llega cada noche → ✅ OK
- Email no llega → ⚠️ Revisar SMTP
- Archivo vacío → ⚠️ Revisar mysqldump

### Revisión mensual
- Verificar que backups se pueden restaurar
- Revisar tamaño y retención
- Rotar credenciales de Gmail (cada 90 días)

---

## 🆘 Troubleshooting

### "mysqldump not found"
```bash
# Windows: Agregar MySQL a PATH
# Linux: sudo apt-get install mysql-client
which mysqldump  # Verificar
```

### "Email not configured"
- Backup se crea pero no se envía
- Revisar variables SMTP en `.env`

### "Cannot connect to SMTP"
- Verificar credenciales
- Asegurar 2FA habilitado en Gmail
- Usar App Password (NO contraseña principal)

---

## 🎯 Checklist pre-producción

- [ ] Dependencies instaladas (`npm install`)
- [ ] Cuenta Gmail creada y 2FA habilitado
- [ ] App Password generada
- [ ] Variables `.env` configuradas
- [ ] Scheduler integrado en `index.server.js`
- [ ] Rutas de backup agregadas
- [ ] Test de SMTP realizado
- [ ] Test de backup manual realizado
- [ ] Confirmado que email llega
- [ ] Documentación entregada al equipo
- [ ] Procedimiento de rollback documentado

---

✅ **Sistema de backup y recuperación listo para producción**
