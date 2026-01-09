# Integración de Backup Manual en Admin Dashboard

## 📋 Resumen

Se ha creado el endpoint `/api/backup/manual` que permite hacer backup **inmediato** desde el dashboard admin.

## 🖥️ Componente Frontend (React)

Agregar esto en `src/pages/AdminDashboard.jsx` en la sección de backups:

```jsx
// Estado
const [manualBackupInProgress, setManualBackupInProgress] = useState(false)
const [manualBackupMessage, setManualBackupMessage] = useState('')

// Función
const handleManualBackupNow = async () => {
  setManualBackupInProgress(true)
  setManualBackupMessage('')
  
  try {
    const response = await apiFetch('/api/backup/manual', {
      method: 'POST'
    })
    
    if (response.ok) {
      const data = await response.json()
      setManualBackupMessage('✅ Backup iniciado. Se ejecutará en segundo plano y recibirá un correo cuando se complete.')
    } else {
      setManualBackupMessage('❌ Error iniciando backup')
    }
  } catch (error) {
    setManualBackupMessage(`❌ ${error.message}`)
  } finally {
    setManualBackupInProgress(false)
  }
}

// En el JSX
<button
  onClick={handleManualBackupNow}
  disabled={manualBackupInProgress}
  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
>
  {manualBackupInProgress ? 'Iniciando...' : '🔄 Realizar Backup Ahora'}
</button>

{manualBackupMessage && (
  <div className={`mt-2 p-3 rounded ${manualBackupMessage.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
    {manualBackupMessage}
  </div>
)}
```

## 🔌 Backend - Rutas configuradas

```javascript
// GET /api/backup
// Obtener historial de backups

// POST /api/backup/manual
// Ejecutar backup manual ahora

// GET /api/backup/status
// Ver estado del sistema de backup
```

## 🚀 Flujo de ejecución

```
Usuario hace clic en "Realizar Backup Ahora"
    ↓
POST /api/backup/manual
    ↓
[Respuesta inmediata] "Backup iniciado..."
    ↓
[Background job] executeAutomaticBackup()
    ↓
[mysqldump] Crea archivo SQL
    ↓
[Gmail SMTP] Envía por correo
    ↓
✅ Email recibido con backup
```

## 🔐 Seguridad

- Solo admin puede ejecutar backups manuales
- Requiere autenticación
- Respuesta inmediata al usuario
- Ejecución en background sin bloquear API

## 📊 Monitoreo

Ver en consola del servidor:
```
[BACKUP MANUAL] Completed: { success: true, backup: 'lucvan_backup_2025-01-06_123456.sql' }
```
