# Restauración de Backups con GUI

## 📌 Resumen

Se ha implementado una interfaz gráfica completa para restaurar backups desde el panel de administrador.

**Características:**
- ✅ Listar backups disponibles
- ✅ Restauración global (toda BD)
- ✅ Restauración parcial (clínica específica)
- ✅ Confirmaciones de seguridad en 3 pasos
- ✅ Backup de seguridad automático antes de restaurar
- ✅ Auditoría de operaciones

---

## 🛠️ Componentes Creados

### 1. Backend: `restoreService.js`
**Ubicación:** `backend/services/restoreService.js`

**Funciones principales:**
```javascript
restoreGlobalDatabase(backupFilepath, dbConfig)
  // Restaurar BD completa desde backup

restorePartialClinic(backupFilepath, dbConfig, clinicId)
  // Restaurar datos de UNA clínica solamente

createSafetyBackup(dbConfig)
  // Crear backup antes de restaurar (para emergencias)

getAvailableBackups()
  // Listar todos los backups disponibles

getAvailableClinics(dbConfig)
  // Obtener lista de clínicas para seleccionar en partial restore

validateRestoreRequest(restoreData)
  // Validar parámetros de solicitud
```

### 2. Backend: Rutas en `backup.js`
**Ubicación:** `backend/routes/backup.js` (ACTUALIZADO)

**Nuevos endpoints:**
```
GET  /api/backup/restore/list
     → Obtener backups disponibles + lista de clínicas

POST /api/backup/restore
     → Ejecutar restauración (global o parcial)
```

### 3. Frontend: `BackupRestorePanel.jsx`
**Ubicación:** `src/components/BackupRestorePanel.jsx`

**Características React:**
- Tabs: "Backups" y "Restaurar"
- Tabla de backups con acción "Restaurar"
- Modal de 3 pasos para confirmar restauración
- Validación de código de seguridad
- Mensajes de estado en tiempo real

---

## 🔧 Instalación

### Paso 1: Verificar dependencias
El archivo `restoreService.js` requiere:
```bash
npm list mysql2 nodemailer express
```

Si faltan:
```bash
npm install mysql2 nodemailer express
```

### Paso 2: Integrar el componente en AdminDashboard
**Archivo:** `src/pages/AdminDashboard.jsx`

```javascript
// En la parte superior
import BackupRestorePanel from '../components/BackupRestorePanel'

// En el componente AdminDashboard
export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      {/* ... otros componentes ... */}

      {/* Agregar el panel de backup/restore */}
      <BackupRestorePanel />

      {/* ... */}
    </div>
  )
}
```

### Paso 3: Verificar las rutas en `index.server.js`
Asegúrate de que el router está integrado:

```javascript
import backupRouter from './routes/backup.js'

// En la configuración de rutas
app.use('/api', backupRouter)
// O si tienes un prefijo específico:
// app.use('/api/backup', backupRouter)
```

**Nota:** El archivo `backup.js` ya contiene `export default router` actualizado.

### Paso 4: Variables de entorno
Asegúrate de que tu `.env` tenga las variables requeridas:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=lucvan_db

BACKUP_DIR=./backups
BACKUP_EMAIL=admin@lucvanlatam.com
```

---

## 📖 Flujo de Uso en GUI

### Restauración Global
```
Usuario Admin → Panel Admin → Pestaña "Backups"
  ↓
Cliquea "Restaurar" en un backup
  ↓
Dialog Paso 1: Selecciona "Global"
  ↓
Dialog Paso 2: Lee advertencia y confirma
  ↓
Dialog Paso 3: Ingresa código "RESTORE_CONFIRM"
  ↓
Cliquea "Confirmar Restauración"
  ↓
Backend crea safety backup
  ↓
Backend restaura BD completa
  ↓
✅ Confirmación al usuario
```

### Restauración Parcial (Clínica)
```
Usuario Admin → Panel Admin → Pestaña "Backups"
  ↓
Cliquea "Restaurar" en un backup
  ↓
Dialog Paso 1: Selecciona "Parcial"
  ↓
Dialog Paso 1: Selecciona clínica del dropdown
  ↓
Dialog Paso 2: Lee advertencia y confirma
  ↓
Dialog Paso 3: Ingresa código "RESTORE_CONFIRM"
  ↓
Cliquea "Confirmar Restauración"
  ↓
Backend crea safety backup
  ↓
Backend restaura SOLO datos de esa clínica
  ↓
✅ Confirmación al usuario
```

---

## 🔒 Seguridad

### Protecciones Implementadas

1. **Autenticación & Autorización**
   - Solo usuarios con `role === 'admin'` pueden acceder
   - Verificación en cada endpoint

2. **Confirmaciones de Seguridad (3 pasos)**
   - Paso 1: Seleccionar tipo y clínica
   - Paso 2: Leer advertencia de riesgos
   - Paso 3: Ingresar código de confirmación

3. **Código de Confirmación**
   - Código fijo: `RESTORE_CONFIRM` (en producción: usar token o 2FA)
   - Evita clicks accidentales

4. **Safety Backup**
   - Se crea backup antes de restaurar
   - Si restauración falla, puedes recuperar datos actuales

5. **Auditoría**
   - Logs en consola del servidor
   - Incluye qué usuario, cuándo, qué tipo de restauración
   - En producción: guardar en tabla de auditoría

---

## 🧪 Pruebas

### Test 1: Ver backups disponibles
```javascript
// Desde navegador o Postman
GET http://localhost:4000/api/backup/restore/list
Headers: Authorization: Bearer YOUR_TOKEN

// Esperado:
{
  "success": true,
  "backups": [
    {
      "filename": "backup-2025-01-06T10-30-45.sql",
      "size": 45234,
      "sizeFormatted": "45.23 MB",
      "createdAt": "2025-01-06T10:30:45.000Z",
      "date": "2025-01-06 10:30:45"
    }
  ],
  "clinics": [
    { "id": 1, "name": "Clínica Central" },
    { "id": 2, "name": "Sucursal Norte" }
  ]
}
```

### Test 2: Restauración global desde CLI
```bash
curl -X POST http://localhost:4000/api/backup/restore \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "backupFile": "backup-2025-01-06T10-30-45.sql",
    "restoreType": "global",
    "confirmationCode": "RESTORE_CONFIRM"
  }'

# Esperado:
{
  "success": true,
  "message": "Restauración global iniciada...",
  "type": "global",
  "timestamp": "2025-01-06T10:35:12.345Z"
}
```

### Test 3: Restauración parcial desde CLI
```bash
curl -X POST http://localhost:4000/api/backup/restore \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "backupFile": "backup-2025-01-06T10-30-45.sql",
    "restoreType": "partial",
    "clinicId": 1,
    "confirmationCode": "RESTORE_CONFIRM"
  }'

# Esperado:
{
  "success": true,
  "message": "Restauración parcial iniciada...",
  "type": "partial",
  "timestamp": "2025-01-06T10:35:12.345Z"
}
```

---

## 📊 Logs Esperados en Servidor

### Restauración Global
```
[RESTORE] Starting global restore from backup-2025-01-06T10-30-45.sql (45.23 MB)
[RESTORE] Creating safety backup before restore...
[RESTORE] ✅ Safety backup created: safety-backup-2025-01-06T10-40-15-123.sql
[RESTORE] ✅ Global restore completed successfully
```

### Restauración Parcial
```
[RESTORE] Starting partial restore for clinic 1
[RESTORE] Creating safety backup before restore...
[RESTORE] ✅ Safety backup created: safety-backup-2025-01-06T10-40-15-123.sql
[RESTORE] Extracting data for clinic 1 from backup...
[RESTORE] Deleting current data for clinic 1...
[RESTORE] Restoring clinic data...
[RESTORE] ✅ Partial restore completed for clinic 1
```

---

## 🚨 Troubleshooting

### "mysql: command not found"
**Problema:** mysqldump o mysql no está en PATH

**Solución (Windows):**
```powershell
# Agregar MySQL al PATH
$env:Path += ";C:\Program Files\MySQL\MySQL Server 8.0\bin"

# Verificar
mysql --version
```

**Solución (Linux/Mac):**
```bash
# Instalar MySQL client
sudo apt-get install mysql-client  # Debian/Ubuntu
brew install mysql-client  # macOS
```

### "Access denied for user 'root'@'localhost'"
**Problema:** Credenciales de BD incorrectas

**Solución:**
- Verificar `.env` con usuario/contraseña correcta
- Asegurar que el usuario tiene permisos de INSERT, UPDATE, DELETE

### "Código de confirmación inválido"
**Problema:** Usuario escribió código mal

**Solución:**
- El código es: `RESTORE_CONFIRM` (exacto, sin espacios)
- Hay botón para copiar en el dialog

### "Partial restore no restaura datos de la clínica"
**Problema:** El servicio de partial restore es un esqueleto que requiere customización

**Solución:** Ver sección "Customización" abajo

---

## 🔧 Customización

### Cambiar código de confirmación
**Archivo:** `backend/routes/backup.js` línea ~175
```javascript
// ANTES
if (confirmationCode !== 'RESTORE_CONFIRM') {

// DESPUÉS (más seguro)
const validCode = process.env.RESTORE_CONFIRM_CODE || 'RESTORE_CONFIRM'
if (confirmationCode !== validCode) {
```

### Agregar 2FA para restauraciones
**Archivo:** `src/components/BackupRestorePanel.jsx`

Agregar paso 2.5 que envíe código por correo:
```javascript
const [twoFaCode, setTwoFaCode] = useState('')
const [twoFaSent, setTwoFaSent] = useState(false)

// En handleRestore
if (!twoFaSent) {
  // Enviar código por email
  // Mostrar input para que usuario ingrese
}
```

### Customizar tabla de clínicas
**Archivo:** `backend/services/restoreService.js` línea ~60

Modifica la lista `clinicTables` según tu esquema:
```javascript
const clinicTables = [
  'patients',       // Datos de pacientes
  'requests',       // Solicitudes
  'audit_logs',     // Logs
  'clinic_settings' // Configuración de clínica
  // Agregar más tablas si es necesario
]
```

---

## 📋 Checklist pre-producción

- [ ] `restoreService.js` en `backend/services/`
- [ ] `backup.js` actualizado con nuevos endpoints
- [ ] `BackupRestorePanel.jsx` en `src/components/`
- [ ] Integrado en `AdminDashboard.jsx`
- [ ] Variables `.env` configuradas
- [ ] mysql/mysqldump en PATH
- [ ] Test de restauración global realizado
- [ ] Test de restauración parcial realizado
- [ ] Equipo capacitado en uso de GUI
- [ ] Documentación entregada

---

## 🎯 Próximos Pasos Opcionales

1. **2FA para restauraciones críticas**
   - Enviar código OTP por correo
   - Usuario debe ingresar código recibido

2. **Historial de restauraciones**
   - Tabla en BD: `restore_operations`
   - Quién restauró, cuándo, qué tipo, desde qué backup

3. **Restauración programada**
   - Schedule restauración para cierta hora
   - Notificación cuando se complete

4. **Pre-restore validation**
   - Verificar integridad del backup
   - Comparar tablas y registros
   - Avisar si hay inconsistencias

5. **Backup en AWS S3**
   - Guardar backups en cloud
   - Restore desde AWS S3 directamente
   - Georredundancia

---

✅ **GUI de restauración lista para usar**
