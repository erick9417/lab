# Fix para Problema de Descargas - Servidor Redirigiendo a Home

## Problema Identificado

El servidor está configurado con un wildcard `app.get('*', ...)` que captura TODAS las rutas, incluyendo `/uploads/*`, y devuelve `index.html` en lugar de servir los archivos.

## Solución

Modificar `server-pro/src/index.js` línea 66 para excluir `/uploads/` y `/api/` del wildcard del SPA.

### Cambio Requerido

**ANTES (línea 66):**
```javascript
    app.get('*', (req, res) => {
      res.sendFile(path.join(clientDist, 'index.html'))
    })
```

**DESPUÉS:**
```javascript
    app.get('*', (req, res, next) => {
      // No capturar rutas de /uploads ni /api
      if (req.path.startsWith('/uploads/') || req.path.startsWith('/api/')) {
        return next()
      }
      res.sendFile(path.join(clientDist, 'index.html'))
    })
```

## Aplicar el Fix Manualmente

### Opción 1: Comando directo (recomendado)

```bash
# Conectar al servidor
ssh -p 2222 lucvan5@ngx367.inmotionhosting.com

# Ir al directorio
cd server-pro/src

# Hacer backup
cp index.js index.js.backup-uploads

# Editar con nano o vi
nano index.js

# Buscar la línea 66 (Ctrl+W para buscar):
#   app.get('*', (req, res) => {

# Reemplazar con:
#   app.get('*', (req, res, next) => {
#     if (req.path.startsWith('/uploads/') || req.path.startsWith('/api/')) {
#       return next()
#     }
#     res.sendFile(path.join(clientDist, 'index.html'))
#   })

# Guardar (Ctrl+O, Enter, Ctrl+X)

# Reiniciar servidor
cd ..
pkill -f 'node src/index.js'
nohup node src/index.js >> server.log 2>&1 &

# Verificar que esté corriendo
sleep 2
curl http://localhost:4000/health

# Probar descarga
curl -I http://localhost:4000/uploads/Lucvan-Lucván-Soporte-1767733550529.pdf
```

### Opción 2: Sed one-liner

```bash
ssh -p 2222 lucvan5@ngx367.inmotionhosting.com
cd server-pro/src
cp index.js index.js.backup
sed -i "66s/.*/    app.get('*', (req, res, next) => { if (req.path.startsWith('\/uploads\/') || req.path.startsWith('\/api\/')) return next();/" index.js
cd ..
pkill -f 'node src/index.js'
nohup node src/index.js >> server.log 2>&1 &
```

## Verificación

Después de aplicar el fix:

1. **Probar en el navegador:**
   - Ir a un ticket con adjuntos
   - Click en "Descargar"
   - Debe descargar el PDF en lugar de redirigir a home

2. **Probar URL directa:**
   ```
   https://sistema.lucvanlatam.com/uploads/Lucvan-Lucván-Soporte-1767733550529.pdf
   ```
   - Debe mostrar/descargar el PDF

3. **Verificar en DevTools:**
   - Abrir Network tab
   - Click en descargar
   - Status debe ser 200 con tipo `application/pdf` no `text/html`

## Fallback: Si el problema persiste

Si después del fix aún redirecciona, verificar:

1. **Apache/Nginx puede estar por delante:**
   ```bash
   # Verificar si hay .htaccess que interfiera
   ls -la ~/public_html/.htaccess
   cat ~/public_html/.htaccess
   ```

2. **Verificar que uploads existe y tiene archivos:**
   ```bash
   ls -la server-pro/uploads/
   ```

3. **Probar directo desde localhost:**
   ```bash
   ssh -p 2222 lucvan5@ngx367.inmotionhosting.com
   curl -I http://localhost:4000/uploads/[nombre-archivo].pdf
   # Debe retornar Content-Type: application/pdf
   ```

## Estado Actual

- ✅ Frontend actualizado con handlers de descarga robustos
- ⏳ Backend necesita el fix del wildcard (manual)
- ⏳ Reiniciar servidor después del fix
