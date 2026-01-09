# Sistema de Consecutivos para Solicitudes

## Descripción

Se ha implementado un sistema de numeración consecutiva para todas las solicitudes del sistema Lucvan. Cada solicitud tiene un número único e incremental que facilita su identificación y seguimiento.

## Implementación en Frontend ✅

### Cambios Realizados

1. **PatientDetail.jsx**
   - Muestra el número consecutivo como badge en la lista de solicitudes
   - Formato: `#123` con estilo destacado (fondo azul oscuro, texto blanco)

2. **RequestDetail.jsx**
   - Muestra el número consecutivo prominente en el encabezado del detalle
   - Se posiciona junto al título de la solicitud

3. **WorkshopDashboard.jsx**
   - Muestra el número consecutivo en cada ticket de la lista
   - También aparece en el modal de detalles del ticket

### Comportamiento

- Si el backend proporciona un campo `consecutive`, se usa ese valor
- Si no existe, se usa el `id` como fallback temporal
- Formato consistente: `#123` en todo el sistema

## Implementación en Backend (Pendiente)

### Requisitos del Backend

Para que el sistema funcione completamente, el backend debe:

1. **Crear tabla o campo de consecutivos**
   ```sql
   -- Opción 1: Agregar campo a la tabla requests
   ALTER TABLE requests ADD COLUMN consecutive INTEGER UNIQUE;
   
   -- Opción 2: Crear secuencia global
   CREATE SEQUENCE requests_consecutive_seq START WITH 1;
   ```

2. **Generar consecutivo al crear solicitud**
   ```javascript
   // Ejemplo en Node.js con PostgreSQL
   async function createRequest(data) {
     const consecutive = await getNextConsecutive();
     const request = await db.requests.create({
       ...data,
       consecutive: consecutive
     });
     return request;
   }
   
   async function getNextConsecutive() {
     // Opción 1: Usando secuencia
     const result = await db.query("SELECT nextval('requests_consecutive_seq')");
     return result.rows[0].nextval;
     
     // Opción 2: Obtener el máximo y sumar 1
     const result = await db.requests.findOne({
       order: [['consecutive', 'DESC']]
     });
     return (result?.consecutive || 0) + 1;
   }
   ```

3. **Incluir consecutive en las respuestas**
   - GET `/api/requests` - Incluir `consecutive` en cada objeto
   - GET `/api/requests/:id` - Incluir `consecutive` en la respuesta
   - POST `/api/requests` - Generar y retornar `consecutive`

4. **Consideraciones de concurrencia**
   - Usar transacciones para evitar duplicados
   - Considerar un lock a nivel de base de datos si hay alta concurrencia
   - Alternativa: Usar UUID + contador global atómico

### Ejemplo de Respuesta del Backend

```json
{
  "id": 47,
  "consecutive": 123,
  "patient_id": 12,
  "doctor_name": "Dr. García",
  "template_type": "Plantilla Correctiva",
  "status": "pending",
  "created_at": "2025-12-18T10:30:00Z"
}
```

## Ventajas del Sistema

- ✅ Identificación rápida y sencilla de solicitudes
- ✅ Números correlativos fáciles de recordar y comunicar
- ✅ Mejor trazabilidad en comunicaciones (telefónicas, email)
- ✅ Facilita auditorías y reportes
- ✅ Interfaz más profesional y organizada

## Búsqueda por Consecutivo (Futuro)

Se recomienda implementar búsqueda por número consecutivo:

```javascript
// En el backend
GET /api/requests/search?consecutive=123

// En el frontend - agregar campo de búsqueda
<input 
  type="number" 
  placeholder="Buscar por #consecutivo"
  onChange={(e) => searchByConsecutive(e.target.value)}
/>
```

## Migración de Datos Existentes

Para solicitudes ya creadas sin consecutivo:

```sql
-- Asignar consecutivos a solicitudes existentes
WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as row_num
  FROM requests
  WHERE consecutive IS NULL
)
UPDATE requests r
SET consecutive = n.row_num
FROM numbered n
WHERE r.id = n.id;
```

## Notas Adicionales

- El consecutivo es independiente del `id` de la base de datos
- El `id` sigue siendo la clave primaria para operaciones internas
- El `consecutive` es para uso humano y visualización
- Considerar reiniciar el consecutivo por año o mantenerlo global (recomendado: global)
