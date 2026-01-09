# Sistema de Notificaciones por Correo Electrónico

## Descripción General

Se necesita implementar un sistema de notificaciones por correo electrónico para alertar a las clínicas y al taller sobre eventos importantes en el ciclo de vida de las solicitudes.

## Eventos que Generan Notificaciones

### 1. **Solicitud Creada**
- **Destinatarios**: Taller + Clínica
- **Momento**: Cuando se crea una nueva solicitud en `POST /api/requests`
- **Contenido del correo**:
  - Para el taller: "Se ha creado una nueva solicitud #XXXX de la clínica {clinic_name}"
  - Para la clínica: "Tu solicitud #XXXX ha sido creada exitosamente. Puedes ver el estado en el sistema."

### 2. **Solicitud Cancelada** 
- **Destinatarios**: Taller + Clínica (solo si status era 'pending')
- **Momento**: Cuando se cancela una solicitud en `PUT /api/requests/:id/cancel`
- **Contenido del correo**:
  - Para ambos: "La solicitud #XXXX ha sido cancelada. Motivo: {cancel_reason}"
  - Solo enviar si el status anterior era 'pending'

## Configuración Necesaria

### 1. Variables de Entorno (.env)

```env
# Configuración SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=tu-contraseña-app
SMTP_FROM_EMAIL=noreply@lucvan.com
SMTP_FROM_NAME=Sistema Lucván

# Rutas de redirección
FRONTEND_URL=http://localhost:5173
# Email del módulo de Producción (alias compatible: WORKSHOP_EMAIL)
PRODUCTION_EMAIL=taller@lucvan.com
# WORKSHOP_EMAIL=taller@lucvan.com
```

### 2. Paquetes NPM Requeridos

```bash
npm install nodemailer
```

### 3. Archivo de Utilidades para Correo

Crear `src/utils/emailService.js`:

```javascript
const nodemailer = require('nodemailer');

// Crear transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true para puerto 465, false para otros puertos
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

/**
 * Enviar correo de solicitud creada
 * @param {Object} request - Datos de la solicitud
 * @param {Object} clinic - Datos de la clínica
 * @param {Object} patient - Datos del paciente
 */
async function sendRequestCreatedEmail(request, clinic, patient) {
  try {
    // Correo al taller
    await transporter.sendMail({
      from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
      to: process.env.PRODUCTION_EMAIL || process.env.WORKSHOP_EMAIL,
      subject: `Nueva solicitud creada #${request.consecutive_number || request.id}`,
      html: `
        <h2>Nueva Solicitud Creada</h2>
        <p><strong>Solicitud:</strong> #${request.consecutive_number || request.id}</p>
        <p><strong>Clínica:</strong> ${clinic.name}</p>
        <p><strong>Paciente:</strong> ${patient.name}</p>
        <p><strong>Doctor:</strong> ${request.doctor_name || '-'}</p>
        <p><strong>Pie:</strong> ${request.foot_side || '-'}</p>
        <p><strong>Talla:</strong> ${request.shoe_size || '-'}</p>
        <p><a href="${process.env.FRONTEND_URL}/request/${request.id}" style="color: #0066A4; text-decoration: none; font-weight: bold;">Ver solicitud en el sistema</a></p>
      `
    });

    // Correo a la clínica
    if (clinic.contact_email) {
      await transporter.sendMail({
        from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        to: clinic.contact_email,
        subject: `Tu solicitud #${request.consecutive_number || request.id} ha sido creada`,
        html: `
          <h2>Solicitud Creada Exitosamente</h2>
          <p>Tu solicitud <strong>#${request.consecutive_number || request.id}</strong> ha sido creada y registrada en el sistema.</p>
          <p><strong>Paciente:</strong> ${patient.name}</p>
          <p><strong>Estado:</strong> Pendiente</p>
          <p>Puedes ver el estado detallado de tu solicitud en el sistema.</p>
          <p><a href="${process.env.FRONTEND_URL}/request/${request.id}" style="color: #0066A4; text-decoration: none; font-weight: bold;">Ver detalles de la solicitud</a></p>
        `
      });
    }

    console.log(`Correo de solicitud creada enviado para solicitud #${request.id}`);
  } catch (error) {
    console.error('Error enviando correo de solicitud creada:', error);
    // No lanzar error para no afectar la creación de la solicitud
  }
}

/**
 * Enviar correo de solicitud cancelada
 * @param {Object} request - Datos de la solicitud
 * @param {Object} clinic - Datos de la clínica
 * @param {Object} patient - Datos del paciente
 */
async function sendRequestCancelledEmail(request, clinic, patient) {
  try {
    const subject = `Solicitud #${request.consecutive_number || request.id} ha sido cancelada`;
    const cancelReason = request.cancel_reason || 'No especificado';

    // Correo al taller
    await transporter.sendMail({
      from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
      to: process.env.PRODUCTION_EMAIL || process.env.WORKSHOP_EMAIL,
      subject: subject,
      html: `
        <h2>Solicitud Cancelada</h2>
        <p><strong>Solicitud:</strong> #${request.consecutive_number || request.id}</p>
        <p><strong>Clínica:</strong> ${clinic.name}</p>
        <p><strong>Paciente:</strong> ${patient.name}</p>
        <p><strong>Motivo de cancelación:</strong></p>
        <p style="background: #f0f0f0; padding: 10px; border-left: 4px solid #ff6b6b;">${cancelReason}</p>
      `
    });

    // Correo a la clínica
    if (clinic.contact_email) {
      await transporter.sendMail({
        from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        to: clinic.contact_email,
        subject: subject,
        html: `
          <h2>Tu Solicitud ha sido Cancelada</h2>
          <p>Tu solicitud <strong>#${request.consecutive_number || request.id}</strong> para el paciente <strong>${patient.name}</strong> ha sido cancelada.</p>
          <p><strong>Motivo:</strong></p>
          <p style="background: #f0f0f0; padding: 10px; border-left: 4px solid #ff6b6b;">${cancelReason}</p>
          <p>Si tienes preguntas, contacta al taller directamente.</p>
        `
      });
    }

    console.log(`Correo de cancelación enviado para solicitud #${request.id}`);
  } catch (error) {
    console.error('Error enviando correo de cancelación:', error);
    // No lanzar error para no afectar la cancelación de la solicitud
  }
}

module.exports = {
  sendRequestCreatedEmail,
  sendRequestCancelledEmail
};
```

## Cambios en Routes

### En `src/routes/requests.js`

#### Para crear solicitud:
```javascript
const { sendRequestCreatedEmail } = require('../utils/emailService');

// En POST /api/requests, después de insertar:
// ...
const [requestData] = await db.query(
  'SELECT r.*, p.name, p.email FROM requests r JOIN patients p ON r.patient_id = p.id WHERE r.id = ?',
  [lastInsertId]
);

const [clinicData] = await db.query('SELECT * FROM clinics WHERE id = ?', [clinicId]);

// Enviar correos (asincronamente, sin bloquear respuesta)
sendRequestCreatedEmail(requestData[0], clinicData[0], requestData[0]);

// Retornar respuesta normalmente
res.json(formattedRequest);
```

#### Para cancelar solicitud:
```javascript
const { sendRequestCancelledEmail } = require('../utils/emailService');

// En PUT /api/requests/:id/cancel, después de actualizar:
// ...
const [requestData] = await db.query(
  'SELECT r.*, p.name FROM requests r JOIN patients p ON r.patient_id = p.id WHERE r.id = ?',
  [id]
);

const [clinicData] = await db.query('SELECT * FROM clinics WHERE id = ?', [clinicId]);

// Enviar correos (asincronamente)
sendRequestCancelledEmail(requestData[0], clinicData[0], requestData[0]);

// Retornar respuesta normalmente
res.json(formattedRequest);
```

## Requerimientos de Base de Datos

La tabla `clinics` debe tener un campo `contact_email`:

```sql
ALTER TABLE clinics ADD COLUMN contact_email VARCHAR(255) NULL;
```

## Testing

Para probar sin usar cuenta de Gmail real, se puede usar:

```javascript
// En desarrollo, usar Ethereal Email (servicio de testing)
const account = await nodemailer.createTestAccount();
```

O usar MailHog (servidor SMTP local para testing).

## Notas Importantes

1. **Errores no bloqueantes**: Los errores en el envío de correos no deben detener la creación/cancelación de solicitudes
2. **Solo pendientes**: Las cancelaciones solo envían correo si el estado anterior era 'pending'
3. **Asincronía**: Los correos se envían de forma asincrónica (no se espera a que terminen)
4. **Logging**: Registrar en logs los envíos de correos para auditoría

## Próximos Pasos

1. Configurar SMTP en production (Gmail, SendGrid, Mailgun, etc.)
2. Ajustar plantillas HTML según branding de Lucván
3. Agregar más eventos (cambio de estado, etc.)
4. Sistema de reintentos para correos fallidos
5. Panel de administración para ver historial de correos enviados
