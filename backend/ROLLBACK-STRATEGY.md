# Estrategia de Rollback - Lucván LATAM

## 🔄 Tipos de Rollback

### 1. Rollback Global (Todo el sistema)
Restaurar BD completa a un punto en el tiempo específico.

**Cuándo usar:**
- Corrupción de datos grave
- Cambio de código fallido afecta todo
- Ataque de seguridad/malware

**Impacto:** ❌ Todos los usuarios pierden datos después de ese momento
**Tiempo de recuperación:** 15-60 minutos

### 2. Rollback Parcial (Cliente específico)
Restaurar datos de UNO o VARIOS clientes específicos.

**Cuándo usar:**
- Cliente solicita revertir cambios
- Error afecta solo a una clínica
- Eliminación accidental por usuario específico

**Impacto:** ✅ Solo afecta al cliente, otros continúan normalmente
**Tiempo de recuperación:** 5-30 minutos

---

## 🌍 Rollback Global

### Proceso

**1. Identificar el momento correcto**
```bash
# Listar backups disponibles
ls -la ../backups/

# Ejemplo:
# lucvan_backup_2025-01-06_123456.sql (2 días atrás)
# lucvan_backup_2025-01-04_123456.sql (4 días atrás)
```

**2. Detener aplicación**
```bash
# Importante: Evitar nuevos datos mientras se restaura
systemctl stop lucvan-api
# O en desarrollo:
Ctrl+C en terminal
```

**3. Crear respaldo actual (por si acaso)**
```bash
# Antes de restaurar, guardar estado actual
mysqldump -u root -p lucvan_sistema > lucvan_respaldo_antes_rollback.sql
```

**4. Restaurar desde backup**
```bash
# Restaurar a punto específico
mysql -u root -p lucvan_sistema < ../backups/lucvan_backup_2025-01-04_123456.sql

# Ingresar contraseña cuando se solicite
```

**5. Verificar datos**
```bash
# Conectar a MySQL
mysql -u root -p lucvan_sistema

# Ver últimos cambios
SELECT * FROM requests ORDER BY created_at DESC LIMIT 5;

# Verificar tablas críticas
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM patients;
SELECT COUNT(*) FROM requests;

# Exit
EXIT;
```

**6. Reiniciar aplicación**
```bash
systemctl start lucvan-api
# O en desarrollo:
npm start
```

**7. Notificar a usuarios**
- Comunicar el rollback realizado
- Informar período de datos restaurados
- Explicar qué se perdió

### Código de Restauración Automática (Backend)

```javascript
// routes/admin.js - Endpoint para rollback global
import { exec } from 'child_process'
import util from 'util'

const execPromise = util.promisify(exec)

export const rollbackDatabase = async (backupFilename) => {
  try {
    // 1. Crear respaldo actual
    await execPromise(`
      mysqldump -u ${process.env.DB_USER} \
        -p${process.env.DB_PASSWORD} \
        ${process.env.DB_NAME} > \
        ../backups/rollback_safeguard_${Date.now()}.sql
    `)

    // 2. Restaurar desde backup
    const backupPath = \`../backups/\${backupFilename}\`
    await execPromise(`
      mysql -u ${process.env.DB_USER} \
        -p${process.env.DB_PASSWORD} \
        ${process.env.DB_NAME} < \${backupPath}
    `)

    console.log('[ROLLBACK] Database restored successfully')
    return { success: true, backup: backupFilename }
  } catch (error) {
    console.error('[ROLLBACK] Error:', error)
    throw error
  }
}

// Endpoint
router.post('/admin/rollback', requireAdmin, async (req, res) => {
  const { backupFilename } = req.body

  if (!backupFilename) {
    return res.status(400).json({ error: 'Backup filename required' })
  }

  try {
    // Confirmación extra de seguridad
    const confirmation = req.headers['x-confirm-rollback']
    if (confirmation !== 'ROLLBACK_CONFIRMED') {
      return res.status(403).json({ 
        error: 'Rollback must be confirmed with header: X-Confirm-Rollback: ROLLBACK_CONFIRMED' 
      })
    }

    const result = await rollbackDatabase(backupFilename)
    res.json({ success: true, message: 'Rollback completed', backup: result.backup })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})
```

---

## 👤 Rollback Parcial (Por Cliente)

Restaurar datos de **un cliente específico** sin afectar a otros.

### Arquitectura necesaria

Tu BD debe soportar rollback parcial. Esto requiere:

**Opción A: Por clínica (Recomendado)**
```
Estructura actual:
- patients.clinic_id → identifica pacientes por clínica
- requests.patient_id → identifica solicitudes por paciente

Poder restaurar:
- Todo de clinic_id = 5
```

**Opción B: Tablas separadas (Mejor escalabilidad)**
```
Base de datos separada por cliente:
- lucvan_clinic_001.sql
- lucvan_clinic_002.sql
- lucvan_clinic_003.sql

Rollback de una = no afecta otras
```

### Proceso de Rollback Parcial

**1. Extraer datos del cliente del backup**
```bash
# Restaurar backup completo a BD temporal
mysql < backup_2025-01-04.sql --database=lucvan_temp

# Exportar solo datos del cliente 5
mysqldump --where="clinic_id=5" lucvan_temp patients > clinic_5_patients.sql
mysqldump --where="clinic_id=5" lucvan_temp requests > clinic_5_requests.sql
```

**2. Truncar datos actuales del cliente**
```sql
DELETE FROM requests WHERE patient_id IN (
  SELECT id FROM patients WHERE clinic_id = 5
);
DELETE FROM patients WHERE clinic_id = 5;
```

**3. Restaurar datos del cliente**
```bash
mysql < clinic_5_patients.sql
mysql < clinic_5_requests.sql
```

### Código para Rollback Parcial

```javascript
export const rollbackClinic = async (clinicId, backupFilename) => {
  try {
    // 1. Restaurar backup a BD temporal
    await execPromise(`
      mysql -u root -p${process.env.DB_PASSWORD} < \
      ../backups/\${backupFilename} --init-command="CREATE DATABASE IF NOT EXISTS lucvan_temp"
    `)

    const backupDb = 'lucvan_temp'
    const liveDb = process.env.DB_NAME

    // 2. Extraer datos del cliente desde backup temporal
    await execPromise(`
      mysqldump -u root -p${process.env.DB_PASSWORD} \
        --where="clinic_id=\${clinicId}" \
        \${backupDb} patients > /tmp/clinic_patients.sql
    `)

    // 3. Eliminar datos actuales del cliente
    const db = await getDBConnection()
    await db.query('DELETE FROM requests WHERE patient_id IN (SELECT id FROM patients WHERE clinic_id = ?)', [clinicId])
    await db.query('DELETE FROM patients WHERE clinic_id = ?', [clinicId])

    // 4. Restaurar datos del cliente
    await execPromise(`mysql -u root -p${process.env.DB_PASSWORD} \
      \${liveDb} < /tmp/clinic_patients.sql`)

    // 5. Limpiar
    await execPromise('DROP DATABASE lucvan_temp')

    return { success: true, clinic: clinicId }
  } catch (error) {
    console.error('[ROLLBACK CLINIC] Error:', error)
    throw error
  }
}

// Endpoint
router.post('/admin/rollback-clinic', requireAdmin, async (req, res) => {
  const { clinicId, backupFilename, confirmPassword } = req.body

  // Requerir contraseña del admin como confirmación
  const adminPassword = await getAdminPassword()
  if (confirmPassword !== adminPassword) {
    return res.status(403).json({ error: 'Invalid confirmation' })
  }

  try {
    const result = await rollbackClinic(clinicId, backupFilename)
    res.json({ success: true, message: `Clinic ${clinicId} rolled back` })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})
```

---

## 🛡️ Mejores prácticas

### 1. Prueba de restauración mensual
```bash
# Cada mes, verificar que backups pueden restaurarse
# Sin afectar BD actual
mysql < backup_test_2025-01-01.sql --init-command="CREATE DATABASE IF NOT EXISTS test_restore"
```

### 2. Documentar rollbacks realizados
```
Registro de cambios:
- 2025-01-06: Rollback global a 2025-01-04 por corrupción de datos
- 2025-01-03: Rollback clínica #5 por error de usuario
```

### 3. Alertas de cambios críticos
```javascript
// Log de cambios
app.use((req, res, next) => {
  if (req.method === 'DELETE') {
    console.warn(`[AUDIT] DELETE ${req.path} by ${req.user.id}`)
  }
  next()
})
```

### 4. Backup adicional antes de cambios
```bash
# Antes de cambios grandes
mysqldump lucvan_sistema > pre_migration_backup.sql

# Luego proceder con cambios
```

---

## ⚡ Comparación

| Aspecto | Rollback Global | Rollback Parcial |
|---------|-----------------|-----------------|
| **Alcance** | BD Completa | Clínica específica |
| **Impacto** | Todos pierden datos | Solo 1 cliente |
| **Complejidad** | Bajo | Alto |
| **Tiempo** | 15-60 min | 5-30 min |
| **Riesgo** | Alto | Bajo |
| **Frecuencia** | Rara | Ocasional |

---

## 🚨 Emergencias

### Si se corrompen datos
1. DETENER el sistema inmediatamente
2. Crear respaldo del estado actual
3. Ejecutar rollback a último backup conocido bueno
4. Verificar integridad de datos
5. Investigar causa

### Si hay un ataque/malware
1. DESCONECTAR del internet
2. Hacer rollback a backup antes del ataque
3. Actualizar seguridad
4. Realizar auditoría de seguridad
5. Volver a conectar

---

## 📋 Checklist antes de producción

- [ ] Backups se ejecutan diariamente
- [ ] Backups se envían por email
- [ ] Se probó al menos una restauración completa
- [ ] Se documentó proceso de rollback
- [ ] Se entreó al equipo cómo hacer rollback
- [ ] Existe dashboard o endpoint para ver historial de backups
- [ ] Se tienen múltiples copias (local + email)
