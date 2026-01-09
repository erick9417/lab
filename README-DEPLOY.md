# Lucván LATAM - Sistema Completo

## Estructura

```
Lab/
├── lucvan-sistema/     (Frontend - React + Vite)
├── server/             (Backend - Express + Node.js)
└── node_modules/       (Deps compartidas)
```

## Base de Datos (MySQL)

El backend usa:
- **Host**: localhost
- **Usuario**: lucvan
- **Contraseña**: lucvan123
- **BD**: lucvan_sistema
- **Puerto**: 3306

Script SQL (ya ejecutado según el setup):
```sql
CREATE DATABASE IF NOT EXISTS lucvan_sistema;
USE lucvan_sistema;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'clinic',
  clinic_id INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (email, password_hash, role)
VALUES ('admin@lucvanlatam.com', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8bVjQ5lFQm6k8i0zYhZq6a3bG2K7uW', 'admin');
```

## Desarrollo Local (LISTO PARA PROBAR)

### Terminal 1: Backend
```powershell
cd C:\Users\Angie\Documents\Sistemas\Lab\server
npm start
# Escucha en http://localhost:4000
```

### Terminal 2: Frontend
```powershell
cd C:\Users\Angie\Documents\Sistemas\Lab\lucvan-sistema
npm run dev
# Sirve en http://localhost:5173
```

### Probar el Login
1. Abre http://localhost:5173/login
2. Email: `admin@lucvanlatam.com`
3. Contraseña: `test`

El proxy de Vite reenviará `/api/*` a `http://localhost:4000/api/*`.

---

## Despliegue en Servidor

### Opción A: Reverse Proxy (Recomendado - Nginx/Apache)

**Estructura en servidor:**
```
/var/www/lucvan/
├── dist/           (frontend compilado)
├── server/         (backend Node)
└── ...
```

**Pasos:**

1. **Compila el frontend** (en local):
```powershell
cd lucvan-sistema
npm run build
```

2. **Copia los artefactos al servidor:**
```bash
# Scp (reemplaza user, dominio, path según tu setup)
scp -r dist/* user@tu-servidor:/var/www/lucvan/

# O si es Windows/Local:
# Copia manualmente dist/* a tu servidor
```

3. **Configura Nginx** (en servidor):
```nginx
server {
  listen 80;
  server_name tu-dominio.com;

  # Servir frontend estático
  root /var/www/lucvan;
  index index.html;

  # Routing SPA
  location / {
    try_files $uri $uri/ /index.html;
  }

  # Proxy a backend
  location /api/ {
    proxy_pass http://127.0.0.1:4000/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_redirect off;
  }
}
```

4. **Levanta el backend en servidor:**
```bash
cd /var/www/lucvan/server
npm install
npm start
# O con PM2:
# pm2 start src/index.js --name lucvan-api
```

5. **Recarga Nginx:**
```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

### Opción B: Dominio Separado (sin Reverse Proxy)

Si no puedes hacer reverse proxy en el servidor, compila con la URL del backend remoto:

1. **Antes de compilar:**
```powershell
# Ajusta a tu dominio/puerto real
$env:VITE_API_BASE="https://api.tu-dominio.com"
npm run build
```

2. **Copia `dist/` a tu servidor estático** (Nginx/Apache/S3/CDN)

3. **El frontend hablará directo a `https://api.tu-dominio.com/api/*`**

**Requisito**: El backend debe tener CORS habilitado (ya está en `server/src/index.js`).

---

## Variables de Entorno

### Frontend (`.env.local`)
```dotenv
# Dev
VITE_DEV_API=http://localhost:4000

# Prod (opcional, solo si NO hay reverse proxy)
# VITE_API_BASE=https://api.tu-dominio.com
```

### Backend (`server/.env`)
```dotenv
PORT=4000
DB_HOST=localhost
DB_USER=lucvan
DB_PASSWORD=lucvan123
DB_NAME=lucvan_sistema
JWT_SECRET=lucvanSuperSecret2025
```

---

## Troubleshooting

### Login retorna 500
- Verifica BD creada y usuarios insertados
- Revisa logs del backend: `C:\Users\Angie\Documents\Sistemas\Lab\server`

### Frontend no conecta a backend
- Confirma ambos están levantados: `http://localhost:4000` y `http://localhost:5173`
- Revisa `.env.local` tenga `VITE_DEV_API=http://localhost:4000`
- Abre DevTools → Network → verifica request a `/api/auth/login`

### CORS en servidor
- Ya está habilitado en `server/src/index.js`: `app.use(cors())`
- Si en prod sigue fallando, añade a backend:
```javascript
app.use(cors({
  origin: 'https://tu-dominio.com',
  credentials: true
}))
```

---

## Archivos Clave

**Frontend:**
- `src/lib/api.js` → helper centralizado de fetch con token Bearer
- `src/context/AuthContext.jsx` → login y manejo de sesión
- `.env.local` → variables de entorno
- `vite.config.js` → configuración de dev proxy

**Backend:**
- `server/src/index.js` → servidor Express
- `server/src/routes/auth.js` → login, invite, reset password
- `server/src/routes/users.js` → CRUD usuarios
- `server/src/routes/clinics.js` → CRUD clínicas
- `server/.env` → variables de entorno

---

## Próximos Pasos

1. ✅ Ambos servicios corriendo en local
2. 📝 Probar flujos (login, crear usuario, etc.)
3. 📦 Hacer build y desplegar a servidor
4. 🔐 Configurar SSL/TLS en producción
5. 🚀 Monitorear con PM2 o Docker

¡Listo! 🎉
