# Gmail SMTP para Backup - Seguridad y Escalabilidad

## 🔒 ¿Por qué usar Gmail en lugar de SMTP local?

### Problema: SMTP en mismo servidor
- ❌ Si el servidor es comprometido, el hacker tiene acceso a configuración de email
- ❌ Sin redundancia si el servidor cae
- ❌ Limitado a una sola máquina
- ❌ Difícil de auditar y rastrear

### Solución: Gmail / Servicio SMTP externo
- ✅ Separación de seguridad (diferentes infraestructuras)
- ✅ Redundancia geográfica (Google data centers)
- ✅ Logs y auditoría en Gmail
- ✅ Escalable a múltiples servidores
- ✅ Cumple GDPR/normativas de seguridad

## 📧 Configuración con Gmail

### 1. Crear cuenta Gmail de administración
```
Ejemplo: lucvan-backups@gmail.com
```

### 2. Habilitar 2FA y crear contraseña de aplicación

**Pasos:**
1. Ir a: https://myaccount.google.com/security
2. Activar "2-Step Verification"
3. Ir a: https://myaccount.google.com/apppasswords
4. Seleccionar: Mail → Windows Computer (o tu SO)
5. Google genera contraseña segura de 16 caracteres: `xxxx xxxx xxxx xxxx`

### 3. Configurar `.env`

```env
# SMTP Gmail (cuenta dedicada para backups)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=backuplucvanlatam@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx
SMTP_FROM=backuplucvanlatam@gmail.com
SMTP_REPLY_TO=admin@lucvanlatam.com

# Backup - Los archivos .sql se envían a este correo (fuera del servidor)
BACKUP_EMAIL=backuplucvanlatam@gmail.com
```

**IMPORTANTE:** El correo de backup se configura a `backuplucvanlatam@gmail.com` para que los backups se guarden en una cuenta SEPARADA del servidor. Así en caso de emergencia tienes acceso a los backups aunque el servidor esté comprometido.

### 4. Probar conexión

```bash
# Test rápido con node
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'lucvan-backups@gmail.com',
    pass: 'xxxx xxxx xxxx xxxx'
  }
});
transporter.verify((error, success) => {
  if (error) console.error('Error:', error);
  else console.log('✅ SMTP ready');
});
"
```

## 🔐 Alternativas a Gmail

### SendGrid (Recomendado para producción)
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=SG.xxxxxxxxxxxxx
```
- ✅ Mejor para alto volumen
- ✅ API avanzada
- ✅ Tracking de entregas

### AWS SES (Simple Email Service)
```env
SMTP_HOST=email-smtp.region.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=usuario-iam
SMTP_PASSWORD=contraseña-iam
```
- ✅ Integración con AWS
- ✅ Económico para alto volumen

### Office 365 / Outlook
```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-email@tudominio.com
SMTP_PASSWORD=tu-contraseña
```

## 🛡️ Recomendaciones de seguridad

### 1. Usar contraseñas de aplicación (NO contraseña principal)
```
Gmail genera: xxxx xxxx xxxx xxxx (16 caracteres)
NO usar tu contraseña de Gmail principal
```

### 2. Variables de entorno en archivo `.env` local
```bash
# NUNCA commits `.env` a git
echo ".env" >> .gitignore

# En servidor: configurar variables en sistema operativo
export SMTP_PASSWORD="xxxx xxxx xxxx xxxx"
```

### 3. Auditoría de logs en Gmail
```
Revisar logs de:
- Actividad de inicio de sesión: https://myaccount.google.com/security
- Ubicaciones nuevas: alertas en tiempo real
- Dispositivos conectados
```

### 4. Rotación periódica de contraseñas
- Cambiar contraseña de aplicación cada 90 días
- Generar nueva desde App Passwords
- Actualizar `.env` en servidor

## 📋 Flujo de backup con Gmail

```
Servidor Lucván
    ↓
[Scheduler] 00:00 → executeAutomaticBackup()
    ↓
[BD] mysqldump → archivo.sql
    ↓
[Nodemailer] Conecta a smtp.gmail.com:587
    ↓
[Gmail] Autentica con credenciales de app
    ↓
[Envía] Adjunta archivo y envía a admin@lucvanlatam.com
    ↓
✅ Log en Gmail (historial de envíos)
```

## 🔍 Monitoreo y troubleshooting

### Ver logs de envío en Gmail
1. Ir a: https://mail.google.com
2. Carpeta "Elementos enviados"
3. Ver cada correo enviado automáticamente

### Error: "Less secure app access"
- Gmail bloquea apps antiguas
- **Solución:** Usar contraseña de aplicación (App Passwords)

### Error: "Invalid login credentials"
- ❌ Contraseña incorrecta
- ❌ 2FA no habilitado
- **Solución:** Verificar contraseña de app en: https://myaccount.google.com/apppasswords

### Email no llega
- Revisar carpeta SPAM
- Verificar que BACKUP_EMAIL es correcto
- Verificar logs del servidor: `[BACKUP] Email sent successfully`

## 📊 Ejemplo de log

```
[SCHEDULER] Running automatic backup...
[BACKUP] Starting automatic backup...
[BACKUP] Database backup created successfully (45.23 MB)
[SMTP] Connecting to smtp.gmail.com:587
[SMTP] Authentication successful
[BACKUP] Email sent successfully: MessageID=xxxxx
[BACKUP CLEANUP] Deleted old backup: lucvan_backup_2025-11-01_123456.sql
✅ Complete
```

## 🚀 Implementación en Producción

### Paso 1: Crear cuenta Gmail dedicada
```
lucvan-backups@gmail.com
Contraseña segura: xxxxxxxxxxxxxxxx
```

### Paso 2: Habilitar 2FA
### Paso 3: Generar contraseña de aplicación
### Paso 4: Configurar variables en servidor
```bash
# En servidor Linux/Mac
export SMTP_HOST="smtp.gmail.com"
export SMTP_USER="lucvan-backups@gmail.com"
export SMTP_PASSWORD="xxxx xxxx xxxx xxxx"
export BACKUP_EMAIL="admin@lucvanlatam.com"

# En Windows (PowerShell)
$env:SMTP_HOST = "smtp.gmail.com"
```

### Paso 5: Reiniciar servidor
```bash
# Node
npm start

# Docker/systemd
systemctl restart lucvan-api
```

## 💡 Ventajas de escalabilidad

Con Gmail/SMTP externo, puedes:
- ✅ Tener múltiples servidores de aplicación
- ✅ Todos envían backups a Gmail
- ✅ Historial centralizado en Gmail
- ✅ Migrar servidor sin perder configuración de email
- ✅ Cambiar proveedor SMTP sin cambiar aplicación

## 🔒 Checklist de seguridad

- [ ] Crear cuenta Gmail dedicada (no personal)
- [ ] Habilitar 2FA en Gmail
- [ ] Generar contraseña de aplicación (APP PASSWORDS)
- [ ] Agregar variables de entorno en servidor
- [ ] Probar envío de email (`npm run test:email`)
- [ ] Verificar que backups llegan por correo
- [ ] Documentar proceso para equipo
- [ ] Revisar logs de actividad mensualmente
- [ ] Rotar contraseña cada 90 días
