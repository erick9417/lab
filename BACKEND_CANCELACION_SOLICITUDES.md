# Instrucciones Backend: Sistema de Cancelación de Solicitudes

## Cambios Requeridos en el Backend

### 1. Modificar Tabla `requests` en la Base de Datos

Ejecutar este SQL en la base de datos:

```sql
-- Agregar nuevo estado 'cancelled' y campo para motivo de cancelación
ALTER TABLE requests 
  MODIFY COLUMN status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending';

ALTER TABLE requests 
  ADD COLUMN cancel_reason TEXT NULL AFTER status;
```

### 2. Agregar Endpoint de Cancelación en `src/routes/requests.js`

Agregar esta nueva ruta PUT:

```javascript
// Cancelar solicitud (solo admin y workshop)
router.put('/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    // Verificar permisos (solo admin y workshop pueden cancelar)
    if (userRole !== 'admin' && userRole !== 'workshop') {
      return res.status(403).json({ error: 'No tienes permisos para cancelar solicitudes' });
    }

    // Validar que se proporcione un motivo
    if (!reason || !reason.trim()) {
      return res.status(400).json({ error: 'Debe proporcionar un motivo de cancelación' });
    }

    // Actualizar solicitud
    const [result] = await db.query(
      'UPDATE requests SET status = ?, cancel_reason = ? WHERE id = ?',
      ['cancelled', reason.trim(), id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    // Obtener solicitud actualizada
    const [rows] = await db.query(
      `SELECT r.*, p.name as patient_name 
       FROM requests r 
       LEFT JOIN patients p ON r.patient_id = p.id 
       WHERE r.id = ?`,
      [id]
    );

    const request = rows[0];
    
    // Formatear respuesta
    const formattedRequest = {
      id: request.id,
      patient_id: request.patient_id,
      patient_name: request.patient_name,
      template_type: request.template_type,
      templateType: request.template_type,
      doctor_name: request.doctor_name,
      doctorName: request.doctor_name,
      foot_side: request.foot_side,
      footSide: request.foot_side,
      shoe_size: request.shoe_size,
      shoeSize: request.shoe_size,
      observations: request.observations,
      specs: request.specs ? JSON.parse(request.specs) : {},
      files: request.files ? JSON.parse(request.files) : [],
      status: request.status,
      cancel_reason: request.cancel_reason,
      consecutive: request.consecutive_number,
      consecutive_number: request.consecutive_number,
      created_at: request.created_at,
      createdAt: request.created_at
    };

    res.json(formattedRequest);
  } catch (error) {
    console.error('Error cancelando solicitud:', error);
    res.status(500).json({ error: 'Error al cancelar la solicitud' });
  }
});
```

### 3. Actualizar GET de Solicitudes para Incluir `cancel_reason`

En el endpoint `GET /api/requests/:id`, asegurarse de incluir el campo `cancel_reason` en la respuesta:

```javascript
const formattedRequest = {
  id: request.id,
  patient_id: request.patient_id,
  patient_name: request.patient_name,
  // ... otros campos ...
  status: request.status,
  cancel_reason: request.cancel_reason,  // ← AGREGAR ESTE CAMPO
  consecutive: request.consecutive_number,
  // ... resto de campos ...
};
```

## Resumen de Cambios Frontend Ya Implementados

✅ **RequestDetail.jsx**:
- Botón "Cancelar Solicitud" visible solo para admin y taller
- Modal de cancelación con campo de texto para motivo
- Llamada a endpoint `PUT /api/requests/:id/cancel`
- Muestra motivo de cancelación cuando está presente
- Estado "Cancelada" en rojo

✅ **PatientDetail.jsx**:
- Muestra estado "Cancelada" en rojo en lista de solicitudes
- Huellitas decorativas sutiles de fondo

✅ **ClinicDashboard.jsx**:
- Contador de solicitudes funcional
- Pestaña "Solicitudes Pendientes" que solo muestra solicitudes con `status='pending'`
- Fecha de creación visible en cada solicitud

## Testing

Para probar la funcionalidad:

1. Ejecutar el script SQL en la base de datos
2. Agregar la ruta de cancelación en el backend
3. Reiniciar el servidor
4. Iniciar sesión como admin o taller
5. Ir a una solicitud y hacer clic en "Cancelar Solicitud"
6. Escribir un motivo y confirmar
7. Verificar que la solicitud aparece como "Cancelada"
8. Verificar que el motivo se muestra en la vista de detalles
