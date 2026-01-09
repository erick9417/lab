# Instalación de Dependencias - Backup & Restore

## 📦 Paquetes Necesarios

Para que funcione completamente el sistema de Backup & Restauración, necesitas instalar:

```bash
npm install multer mysql2 node-schedule nodemailer
```

### Desglose:

| Paquete | Versión | Uso |
|---------|---------|-----|
| `multer` | ^10.0.0 | Subida de archivos .sql |
| `mysql2` | ^3.x | Conexión a BD MySQL |
| `node-schedule` | ^2.1.1 | Cron jobs (backup automático) |
| `nodemailer` | ^6.9.x | Envío de correos con backup |

---

## 🚀 Instalación Paso a Paso

### Paso 1: Abrir terminal
```bash
cd c:\Users\Angie\Documents\Sistemas\Lab\lucvan-sistema
```

### Paso 2: Instalar todas las dependencias
```bash
npm install multer mysql2 node-schedule nodemailer
```

### Paso 3: Verificar instalación
```bash
npm list multer
npm list mysql2
npm list node-schedule
npm list nodemailer
```

**Esperado:**
```
lucvan-sistema@1.0.0
├── multer@...
├── mysql2@...
├── node-schedule@...
└── nodemailer@...
```

---

## ✅ Checklist Post-Instalación

- [ ] `npm install` completado sin errores
- [ ] `node_modules/multer` existe
- [ ] `node_modules/mysql2` existe
- [ ] `node_modules/node-schedule` existe
- [ ] `node_modules/nodemailer` existe
- [ ] `package.json` actualizado
- [ ] `package-lock.json` regenerado

---

## 🔧 Configuración Requerida en `.env`

Asegúrate que tienes estas variables:

```env
# Base de datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=lucvan_db

# SMTP (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=lucvan-backups@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx  # App Password

# Backup
BACKUP_DIR=./backups
BACKUP_EMAIL=admin@lucvanlatam.com
```

---

## 🧪 Verificación

### Test 1: Multer cargado
```javascript
// En cualquier archivo .js
import multer from 'multer'
console.log('Multer cargado ✅')
```

### Test 2: MySQL conecta
```javascript
import mysql from 'mysql2/promise'
const conn = await mysql.createConnection({ ... })
console.log('MySQL conectado ✅')
```

### Test 3: Node-Schedule funciona
```javascript
import schedule from 'node-schedule'
const job = schedule.scheduleJob('0 0 * * *', () => console.log('✅'))
```

---

## 📝 Actualización de package.json

Después de instalar, tu `package.json` debería tener:

```json
{
  "dependencies": {
    "@headlessui/react": "^2.2.9",
    "cors": "^2.8.5",
    "express": "^5.2.1",
    "firebase": "^10.13.0",
    "multer": "^10.0.0",
    "mysql2": "^3.x.x",
    "node-schedule": "^2.1.1",
    "nodemailer": "^6.9.x",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.0"
  }
}
```

---

## 🐛 Troubleshooting

### Error: "Cannot find module 'multer'"
```bash
# Solución
npm install multer
```

### Error: "EACCES: permission denied"
```bash
# En Windows (no es problema)
# En Linux/Mac:
sudo npm install multer --unsafe-perm
```

### Error: "Module not found: mysql2"
```bash
npm install mysql2
```

### npm ERR! code ERESOLVE
```bash
# Forzar instalación
npm install --legacy-peer-deps
```

---

## ✨ Listo para Usar

Una vez instaladas todas las dependencias:

✅ Backup automático funciona
✅ Subida de archivos .sql funciona
✅ Restauración global funciona
✅ Restauración parcial funciona
✅ Correos de backup se envían
✅ Panel de Admin carga sin errores

---

**Tiempo total de instalación: ~2-3 minutos**
