# Setup Local - Frontend + Backend con MySQL

## Estructura del proyecto
- **Frontend**: Esta carpeta (`lucvan-sistema/`) - React + Vite
- **Backend**: Carpeta hermana (busca una como `backend/`, `lucvan-backend/`, `api/`, etc.)
- **BD**: MySQL local

## Paso 1: Preparar la Base de Datos

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

-- Usuario de prueba (contraseña: 'test')
INSERT INTO users (email, password_hash, role)
VALUES ('admin@lucvanlatam.com', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8bVjQ5lFQm6k8i0zYhZq6a3bG2K7uW', 'admin');
```

Ejecuta esto en MySQL:
```bash
mysql -u root -p < path/a/tu/script.sql
```

## Paso 2: Levantar el Backend (en otra terminal)

Navega a la carpeta del backend y:
```bash
cd ../backend  # o tu-carpeta-backend
npm install
npm start  # o npm run dev
```

**Requisitos del backend**:
- Escuchar en `http://localhost:3000`
- Exponer endpoints bajo `/api/`:
  - `POST /api/auth/login` → autenticar usuario
  - `GET /api/users` → listar usuarios
  - `POST /api/users` → crear usuario
  - `GET /api/clinics` → listar clínicas
  - `POST /api/clinics` → crear clínica
  - `GET /api/patients` → listar pacientes
  - `GET /api/requests` → listar solicitudes
  - Etc. (ajusta según tu API)

## Paso 3: Levantar el Frontend (en esta carpeta)

```bash
cd lucvan-sistema
npm install    # solo si no lo hiciste antes
npm run dev    # levanta en http://localhost:5173
```

El proxy de Vite reenviará `/api/*` a `http://localhost:3000`.

### .env.local
Ya está configurado con:
```dotenv
VITE_DEV_API=http://localhost:3000
```

Si tu backend está en otro puerto, edítalo:
```bash
notepad .env.local
# VITE_DEV_API=http://localhost:8080  # por ejemplo
```

## Paso 4: Probar el Login

1. Abre `http://localhost:5173/login`
2. Usa:
   - Email: `admin@lucvanlatam.com`
   - Contraseña: `test`
3. Si ves el dashboard, ¡funciona!

## Troubleshooting

### Error: AggregateError [ECONNREFUSED]
- Backend no está corriendo en `http://localhost:3000`
- Solución: verifica que el backend esté levantado y en ese puerto

### Error: 500 Backend
- Endpoint no existe o falla el backend
- Revisa logs del backend

### Error: CORS
- Solo si el proxy no intercepta bien; normalmente Vite evita esto

## Para Producción

### Opción A: Reverse Proxy (Recomendado)
1. Compila el frontend:
   ```bash
   npm run build
   ```
2. Copia `dist/` a tu servidor web
3. Configura Nginx/Apache para proxy de `/api` → backend:
   ```nginx
   location /api/ {
     proxy_pass http://127.0.0.1:3000/;
   }
   ```

### Opción B: Dominio separado (sin reverse proxy)
1. Asegúrate de que el backend tenga CORS habilitado
2. Antes de compilar, configura la base de API:
   ```bash
   export VITE_API_BASE=https://tu-backend-api.com
   npm run build
   ```
3. Copia `dist/` a tu servidor web (dominio diferente)

## Archivos importantes

- `.env.local` → vars de entorno para desarrollo
- `vite.config.js` → proxy configurado
- `src/lib/api.js` → helper de fetch con auth y base URL
- `src/context/AuthContext.jsx` → manejo de login y token

¡Listo! 🚀
