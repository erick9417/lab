# Implementación de Notas Internas y Descarga de Archivos - Workshop/Production

## Problemas Reportados

1. **Descarga de adjuntos fallando**: El rol "production" no puede descargar archivos de tickets
2. **Botón de notas internas sin funcionar**: El botón "Publicar Nota" en WorkshopTicketDetail y ProductionTicketDetail no funcionan

## Root Cause (Análisis de Raíz)

### Problema 1: Descarga de Archivos
El frontend intenta descargar archivos usando `file.url` directamente. Hay dos situaciones posibles:
- **La URL es inválida/relativa**: La respuesta del API devuelve URLs relativas que apuntan a `sistema.lucvanlatam.com` incorrectamente
- **No hay endpoint de descarga**: No existe un endpoint `/api/requests/:id/files/:fileId/download`

**Solución Frontend**: ✅ IMPLEMENTADA
- Agregué función `handleDownloadFile()` que valida la URL
- Construye URLs completas si son relativas
- Abre en nueva pestaña en lugar de navegar directamente

**Solución Backend Requerida**: 
Se necesita asegurar que los archivos tengan URLs de descarga válidas en el endpoint `GET /api/requests/:id`

### Problema 2: Notas Internas
El frontend hace requests POST/GET a estos endpoints que **NO EXISTEN en el backend**:
```
GET /api/requests/:id/workshop-notes
POST /api/requests/:id/workshop-notes
```

**Solución Frontend**: ✅ IMPLEMENTADA
- Mejoré el manejo de errores en `handleAddNote()`
- Ahora muestra mensajes de error descriptivos en lugar de silenciosos

**Solución Backend Requerida**: 🔴 PENDIENTE
Se deben crear dos rutas en el backend

---

## Cambios Frontend Realizados ✅

### Archivos Modificados
1. `src/pages/WorkshopTicketDetail.jsx`
2. `src/pages/ProductionTicketDetail.jsx`

### Cambios Específicos

#### 1. Nueva Función `handleDownloadFile()`
```javascript
const handleDownloadFile = (file) => {
  // Validar que la URL sea válida
  if (!file.url) {
    alert('El archivo no tiene URL válida de descarga')
    return
  }
  
  // Si la URL es relativa, construir la URL completa
  let downloadUrl = file.url
  if (!downloadUrl.startsWith('http')) {
    const apiBase = import.meta.env.VITE_API_BASE || window.location.origin
    downloadUrl = `${apiBase}${downloadUrl.startsWith('/') ? '' : '/'}${downloadUrl}`
  }
  
  // Abrir en nueva pestaña o descargar
  window.open(downloadUrl, '_blank')
}
```

#### 2. Mejora en `handleAddNote()`
- Mejor manejo de errores
- Mensajes descriptivos cuando falla
- Console logs para debugging

#### 3. UI Improvements
- Cambié el botón de descarga de `<a>` a `<button>` para mejor control
- Agregué hover states
- Mejoré la visualización de notas (mejor espaciado, mejor manejo de texto multilinea)

---

## Implementación Backend Requerida 🔴

### Tabla de Base de Datos Necesaria

Si no existe, crear tabla `workshop_notes`:

```sql
CREATE TABLE workshop_notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  request_id INT NOT NULL,
  user_id INT NOT NULL,
  user_name VARCHAR(255),
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE CASCADE,
  INDEX idx_request_id (request_id)
);
```

### Rutas a Implementar en Backend

Ubicación: `~/server-pro/src/routes/requests.js` o similar

#### 1. GET /api/requests/:id/workshop-notes

**Descripción**: Obtener todas las notas internas de un ticket

```javascript
// GET /api/requests/:id/workshop-notes
router.get('/:id/workshop-notes', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    
    // Verificar que el usuario tiene acceso (opcional pero recomendado)
    // const request = await db.query('SELECT * FROM requests WHERE id = ?', [id])
    // if (!request.length) return res.status(404).json({ error: 'Solicitud no encontrada' })
    
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
```

#### 2. POST /api/requests/:id/workshop-notes

**Descripción**: Crear una nueva nota interna en un ticket

```javascript
// POST /api/requests/:id/workshop-notes
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

### Cambios en GET /api/requests/:id

Asegurar que la respuesta incluya URLs válidas de descarga para los archivos:

```javascript
// En la sección donde se devuelven los archivos
if (request.files) {
  try {
    const files = JSON.parse(request.files)
    request.files = files.map(file => ({
      ...file,
      // Asegurar que el URL sea válido
      url: file.url || `/api/requests/${request.id}/files/${file.id}/download`
    }))
  } catch (e) {
    request.files = []
  }
}
```

---

## Testing

### Frontend
- ✅ Build completado exitosamente
- ✅ Desplegado en producción
- ✅ Funciones `handleDownloadFile()` y `handleAddNote()` mejoradas

### Backend - Acciones Pendientes
1. Crear tabla `workshop_notes`
2. Implementar ruta GET /api/requests/:id/workshop-notes
3. Implementar ruta POST /api/requests/:id/workshop-notes
4. Verificar que GET /api/requests/:id devuelve URLs válidas de descarga

---

## Notas de Seguridad

- Agregar validación `authenticateToken` en las nuevas rutas
- El rol "workshop" (production) debe tener permiso para leer y crear notas
- Considerar agregar ruta DELETE para eliminar notas propias
- Limitar el tamaño máximo de comentarios (ej: 5000 caracteres)

---

## Status de Implementación

| Componente | Estado | Notas |
|-----------|--------|-------|
| Frontend - Descarga de archivos | ✅ Completado | Manejo mejorado de URLs |
| Frontend - Notas internas UI | ✅ Completado | Mejor visualización y errores |
| Backend - Tabla workshop_notes | 🔴 Pendiente | Necesita creación en DB |
| Backend - GET /api/requests/:id/workshop-notes | 🔴 Pendiente | - |
| Backend - POST /api/requests/:id/workshop-notes | 🔴 Pendiente | - |
| Backend - URLs de descarga | 🔴 Pendiente | Verificar en GET /api/requests/:id |

