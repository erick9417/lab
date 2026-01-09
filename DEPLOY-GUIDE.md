# Guía de Deploy - Sistema Lucván LATAM

## 🚀 Deployment al Servidor de Producción

### Credenciales del Servidor
```
Host:     ngx367.inmotionhosting.com
Usuario:  lucvan5
Puerto:   2222 (SSH/SCP)
URL:      https://sistema.lucvanlatam.com
```

---

## 📋 Pre-requisitos

### 1. Verificar configuración local
```bash
# Variables de entorno (.env)
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=lucvan_db

# Gmail SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=lucvan-backups@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx

# Backup
BACKUP_DIR=./backups
BACKUP_EMAIL=admin@lucvanlatam.com
```

### 2. Build local exitoso
```bash
npm run build
# Debe crear carpeta dist/ sin errores
```

### 3. SSH Key configurado (recomendado)
```bash
# Generar key si no existe
ssh-keygen -t rsa -b 4096

# Copiar al servidor
ssh-copy-id -p 2222 lucvan5@ngx367.inmotionhosting.com
```

---

## 🔧 Deployment Automático

### Opción 1: Script PowerShell (Recomendado)
```powershell
# Ejecutar desde raíz del proyecto
.\deploy.ps1
```

**Qué hace:**
1. Build del frontend (`npm run build`)
2. Sube archivos por SCP al servidor
3. Instala dependencias en servidor
4. Reinicia aplicación con PM2

---

## 🛠️ Deployment Manual

### Paso 1: Build Frontend
```bash
npm run build
```

### Paso 2: Subir Archivos al Servidor

**Backend:**
```bash
scp -P 2222 -r backend lucvan5@ngx367.inmotionhosting.com:~/lucvan-sistema/
```

**Frontend (dist):**
```bash
scp -P 2222 -r dist lucvan5@ngx367.inmotionhosting.com:~/lucvan-sistema/
```

**Package files:**
```bash
scp -P 2222 package.json lucvan5@ngx367.inmotionhosting.com:~/lucvan-sistema/
scp -P 2222 package-lock.json lucvan5@ngx367.inmotionhosting.com:~/lucvan-sistema/
```

**Server files:**
```bash
scp -P 2222 index.server.js lucvan5@ngx367.inmotionhosting.com:~/lucvan-sistema/
scp -P 2222 vite.config.js lucvan5@ngx367.inmotionhosting.com:~/lucvan-sistema/
```

### Paso 3: Conectar por SSH
```bash
ssh -p 2222 lucvan5@ngx367.inmotionhosting.com
```

### Paso 4: En el servidor

**Ir a directorio:**
```bash
cd ~/lucvan-sistema
```

**Instalar dependencias:**
```bash
npm install --production
```

**Variables de entorno:**
```bash
# Crear/editar .env
nano .env

# Copiar las variables necesarias:
DB_HOST=localhost
DB_USER=lucvan5_db_user
DB_PASSWORD=contraseña_segura
DB_NAME=lucvan5_sistema

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=lucvan-backups@gmail.com
SMTP_PASSWORD=app_password_generado

BACKUP_DIR=./backups
BACKUP_EMAIL=admin@lucvanlatam.com

# Guardar: Ctrl+O, Enter, Ctrl+X
```

**Reiniciar con PM2:**
```bash
# Si ya está corriendo
pm2 restart lucvan-sistema

# Primera vez
pm2 start index.server.js --name lucvan-sistema

# Ver logs
pm2 logs lucvan-sistema

# Ver estado
pm2 status
```

---

## 📊 Verificación Post-Deploy

### 1. Verificar que el servidor responde
```bash
curl https://sistema.lucvanlatam.com/health
```

Esperado:
```json
{"status":"ok"}
```

### 2. Verificar logs
```bash
ssh -p 2222 lucvan5@ngx367.inmotionhosting.com "pm2 logs lucvan-sistema --lines 50"
```

### 3. Verificar backup automático
```bash
# Logs del scheduler
ssh -p 2222 lucvan5@ngx367.inmotionhosting.com "pm2 logs lucvan-sistema | grep SCHEDULER"
```

Esperado:
```
[SCHEDULER] ✅ Scheduled jobs configured:
  • Automatic database backup: Every Sunday at 3:00 AM
```

### 4. Probar login
1. Ir a https://sistema.lucvanlatam.com
2. Login con credenciales de prueba:
   - Email: `admin@lucvanlatam.com`
   - Password: `test`

---

## 🔄 Actualizar Sistema (Deployments posteriores)

```powershell
# Desde Windows (PowerShell)
.\deploy.ps1
```

O manualmente:
```bash
# 1. Build local
npm run build

# 2. Subir solo archivos modificados
scp -P 2222 -r dist lucvan5@ngx367.inmotionhosting.com:~/lucvan-sistema/
scp -P 2222 -r backend lucvan5@ngx367.inmotionhosting.com:~/lucvan-sistema/

# 3. Reiniciar
ssh -p 2222 lucvan5@ngx367.inmotionhosting.com "pm2 restart lucvan-sistema"
```

---

## 🐛 Troubleshooting

### Error: "Permission denied (publickey)"
```bash
# Verificar que SSH key existe
ls ~/.ssh/id_rsa.pub

# Copiar al servidor
ssh-copy-id -p 2222 lucvan5@ngx367.inmotionhosting.com
```

### Error: "Connection refused"
```bash
# Verificar puerto
telnet ngx367.inmotionhosting.com 2222

# Verificar credenciales
ssh -p 2222 -v lucvan5@ngx367.inmotionhosting.com
```

### Error: "npm install failed"
```bash
# En el servidor, limpiar cache
ssh -p 2222 lucvan5@ngx367.inmotionhosting.com
cd ~/lucvan-sistema
rm -rf node_modules
npm cache clean --force
npm install --production
```

### Error: "PM2 not found"
```bash
# Instalar PM2 globalmente
ssh -p 2222 lucvan5@ngx367.inmotionhosting.com "npm install -g pm2"
```

### Aplicación no responde
```bash
# Ver logs en tiempo real
ssh -p 2222 lucvan5@ngx367.inmotionhosting.com "pm2 logs lucvan-sistema"

# Reiniciar forzado
ssh -p 2222 lucvan5@ngx367.inmotionhosting.com "pm2 delete lucvan-sistema && pm2 start index.server.js --name lucvan-sistema"
```

---

## 📝 Checklist de Deploy

### Pre-deploy
- [ ] Build local exitoso (`npm run build`)
- [ ] Variables `.env` configuradas
- [ ] SSH key configurado
- [ ] Credenciales del servidor disponibles

### Deploy
- [ ] Archivos subidos al servidor
- [ ] Dependencias instaladas (`npm install --production`)
- [ ] Variables `.env` en servidor
- [ ] Aplicación iniciada con PM2

### Post-deploy
- [ ] `/health` endpoint responde
- [ ] Login funciona
- [ ] Backups configurados (logs del scheduler)
- [ ] Email SMTP configurado
- [ ] PM2 muestra aplicación running

### Validación
- [ ] Dashboard de admin accesible
- [ ] Clínicas pueden crear solicitudes
- [ ] Taller/Producción pueden actualizar estados
- [ ] Backup manual funciona
- [ ] Emails de notificación se envían

---

## 🔐 Seguridad

### Archivos NO subir
```
.env                 # Variables locales
node_modules/        # Reinstalar en servidor
.git/                # No necesario en producción
*.log                # Logs locales
```

### Protección de credenciales
- Nunca commitear `.env`
- Usar diferentes passwords en local vs producción
- Rotar App Passwords de Gmail cada 90 días

---

## 📞 Soporte

**Errores críticos:**
1. Verificar logs: `pm2 logs lucvan-sistema`
2. Revisar estado: `pm2 status`
3. Reiniciar: `pm2 restart lucvan-sistema`

**Backup emergencia:**
- Backups automáticos cada domingo 3:00 AM
- Backups manuales desde panel admin
- Retención: 1 año (365 días)
- Archivos en: `~/lucvan-sistema/backups/`

---

✅ **Sistema listo para producción**
