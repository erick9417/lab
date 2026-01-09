# Instrucciones para Implementar Workshop Notes en el Servidor

## Acceso al Servidor

```bash
ssh -p 2222 lucvan5@ngx367.inmotionhosting.com
```

## Paso 1: Crear la Tabla en la Base de Datos

Conectarse a MySQL:
```bash
mysql -u lucvan5 -p
# Ingresar contraseña de la base de datos
```

Ejecutar este SQL:
```sql
CREATE TABLE IF NOT EXISTS workshop_notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  request_id INT NOT NULL,
  user_id INT,
  user_name VARCHAR(255),
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE CASCADE,
  INDEX idx_request_id (request_id),
  INDEX idx_created_at (created_at)
);
```

Salir de MySQL:
```bash
exit
```

## Paso 2: Agregar las Rutas al Backend

Abrir el archivo de rutas:
```bash
nano ~/server-pro/src/routes/requests.js
```

Ir al final del archivo (antes del `module.exports` o `export default`) y agregar:

```javascript
// GET /api/requests/:id/workshop-notes
// Obtener todas las notas internas de un ticket
router.get('/:id/workshop-notes', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    
    const notes = await db.query(
      `SELECT id, request_id, user_id, user_name, comment, created_at 
       FROM workshop_notes 
       WHERE request_id = ? 
       ORDER BY created_at ASC`,
      [id]
    )
    
    res.json(notes)
  } catch (err) {
    console.error('Error fetching workshop notes:', err)
    res.status(500).json({ error: 'Error al obtener notas' })
  }
})

// POST /api/requests/:id/workshop-notes
// Crear una nueva nota interna en un ticket
router.post('/:id/workshop-notes', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { comment } = req.body
    const userId = req.user?.id
    const userName = req.user?.name || req.user?.email || 'Usuario'
    
    // Validar entrada
    if (!comment || !comment.trim()) {
      return res.status(400).json({ error: 'El comentario no puede estar vacío' })
    }
    
    // Verificar que la solicitud existe
    const request = await db.query('SELECT id FROM requests WHERE id = ?', [id])
    if (!request.length) {
      return res.status(404).json({ error: 'Solicitud no encontrada' })
    }
    
    // Insertar nota
    const result = await db.query(
      `INSERT INTO workshop_notes (request_id, user_id, user_name, comment) 
       VALUES (?, ?, ?, ?)`,
      [id, userId, userName, comment.trim()]
    )
    
    const newNote = {
      id: result.insertId,
      request_id: id,
      user_id: userId,
      user_name: userName,
      comment: comment.trim(),
      created_at: new Date().toISOString()
    }
    
    res.status(201).json(newNote)
  } catch (err) {
    console.error('Error creating workshop note:', err)
    res.status(500).json({ error: 'Error al crear la nota' })
  }
})
```

Guardar con: `Ctrl+O` + `Enter` + `Ctrl+X`

## Paso 3: Reiniciar el Servidor

Opción A (si usa PM2):
```bash
cd ~/server-pro
pm2 restart server-pro
```

Opción B (si usa systemctl):
```bash
systemctl restart node-server
```

Opción C (manual - reiniciar el proceso):
```bash
cd ~/server-pro
npm start
```

## Paso 4: Verificar que funciona

Hacer una prueba de la API:
```bash
curl -X GET http://localhost:4000/api/requests/1/workshop-notes \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Debería devolver un array (vacío si no hay notas):
```json
[]
```

## Status de Verificación

Después de completar todos los pasos, el sistema debería funcionar:

✅ Frontend - Ya desplegado en `sistema.lucvanlatam.com`
✅ Botón "Publicar Nota" - Debería funcionar
✅ Descarga de archivos - Debería funcionar
✅ Visualización de notas - Debería mostrar todas las notas previas

## Troubleshooting

Si hay errores:

1. **"Solicitud no encontrada"** - El ID del ticket no existe
2. **"Error al obtener notas"** - Problema de conexión a BD, revisar logs:
   ```bash
   pm2 logs server-pro
   ```
3. **"El comentario no puede estar vacío"** - Frontend está enviando comentario vacío

## Rollback

Si necesitas revertir:
```bash
cp ~/server-pro/src/routes/requests.js.backup ~/server-pro/src/routes/requests.js
pm2 restart server-pro
```

---

**Nota**: Los archivos están en el directorio home como:
- `create-workshop-notes-table.sql`
- `workshop-notes-routes.js`

Para referencia rápida.
