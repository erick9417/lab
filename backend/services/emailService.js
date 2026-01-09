import nodemailer from 'nodemailer'

// Configuración del transporte de email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true' || false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

// Plantilla HTML para bienvenida
const getWelcomeEmailTemplate = (user, tempPassword, systemUrl) => {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bienvenido a Lucván</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f5f5f5;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%);
          color: white;
          padding: 40px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .header p {
          margin: 5px 0 0 0;
          font-size: 14px;
          opacity: 0.9;
        }
        .content {
          padding: 40px 20px;
        }
        .greeting {
          font-size: 18px;
          font-weight: 500;
          margin-bottom: 20px;
          color: #0066cc;
        }
        .info-box {
          background-color: #f0f7ff;
          border-left: 4px solid #0066cc;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .info-box label {
          display: block;
          font-weight: 600;
          color: #0052a3;
          font-size: 12px;
          text-transform: uppercase;
          margin-bottom: 5px;
        }
        .info-box value {
          display: block;
          font-size: 16px;
          color: #333;
          word-break: break-all;
        }
        .credentials {
          background-color: #fff3cd;
          border: 1px solid #ffc107;
          border-radius: 4px;
          padding: 15px;
          margin: 20px 0;
        }
        .credentials p {
          margin: 5px 0;
          font-size: 14px;
        }
        .credentials strong {
          color: #d39e00;
        }
        .button {
          display: inline-block;
          background-color: #0066cc;
          color: white;
          text-decoration: none;
          padding: 12px 30px;
          border-radius: 4px;
          margin: 20px 0;
          font-weight: 500;
          text-align: center;
        }
        .button:hover {
          background-color: #0052a3;
        }
        .steps {
          background-color: #f9f9f9;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          padding: 20px;
          margin: 20px 0;
        }
        .steps h3 {
          margin-top: 0;
          color: #0066cc;
        }
        .steps ol {
          margin: 10px 0;
          padding-left: 20px;
        }
        .steps li {
          margin: 8px 0;
          color: #555;
        }
        .footer {
          background-color: #f5f5f5;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #999;
          border-top: 1px solid #e0e0e0;
        }
        .footer p {
          margin: 5px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏥 Lucván LATAM</h1>
          <p>Sistema de Gestión de Pruebas</p>
        </div>

        <div class="content">
          <p class="greeting">¡Bienvenido a Lucván LATAM!</p>

          <p>Se ha creado una nueva cuenta para ti en nuestro sistema. A continuación encontrarás toda la información necesaria para acceder.</p>

          <div class="info-box">
            <label>URL del Sistema</label>
            <value><a href="${systemUrl}" style="color: #0066cc; text-decoration: none;">${systemUrl}</a></value>
          </div>

          <div class="info-box">
            <label>Tu Correo Electrónico (Usuario)</label>
            <value>${user.email}</value>
          </div>

          <div class="credentials">
            <p><strong>⚠️ CONTRASEÑA TEMPORAL:</strong></p>
            <p style="font-family: 'Courier New', monospace; background-color: #fff9e6; padding: 8px; border-radius: 3px; margin: 10px 0;">
              <strong>${tempPassword}</strong>
            </p>
            <p style="margin: 10px 0 0 0; color: #d39e00; font-weight: 500;">
              Esta es una contraseña temporal para tu primer acceso.
            </p>
          </div>

          <a href="${systemUrl}" class="button">Acceder al Sistema</a>

          <div class="steps">
            <h3>📋 Próximos Pasos</h3>
            <ol>
              <li>Accede al sistema usando tu correo electrónico y la contraseña temporal proporcionada</li>
              <li>Una vez hayas iniciado sesión, se te pedirá <strong>obligatoriamente</strong> que cambies tu contraseña</li>
              <li>Crea una contraseña segura (te recomendamos usar mayúsculas, minúsculas, números y caracteres especiales)</li>
              <li>¡Listo! Ya podrás usar el sistema normalmente con tu nueva contraseña</li>
            </ol>
          </div>

          <p style="color: #666; font-size: 13px; margin: 20px 0;">
            <strong>Importante:</strong> Por razones de seguridad, no compartas esta contraseña temporal con nadie. Tu nueva contraseña será completamente privada después de cambiarla en tu primer acceso.
          </p>
        </div>

        <div class="footer">
          <p>Este es un correo automatizado. Por favor no respondas a este mensaje.</p>
          <p>Si tienes problemas para acceder, contacta al equipo de soporte de Lucván.</p>
          <p>&copy; ${new Date().getFullYear()} Lucván LATAM. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Función para enviar correo de bienvenida
export const sendWelcomeEmail = async (user, tempPassword, systemUrl = 'https://sistema.lucvanlatam.com') => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.warn('Email service not configured. Skipping email send.')
      return { success: true, skipped: true }
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: user.email,
      subject: '¡Bienvenido a Lucván LATAM! Tus credenciales de acceso',
      html: getWelcomeEmailTemplate(user, tempPassword, systemUrl),
      replyTo: process.env.SMTP_REPLY_TO || 'soporte@lucvanlatam.com',
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Welcome email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending welcome email:', error)
    return { success: false, error: error.message }
  }
}

// Función para verificar configuración
export const verifyEmailService = async () => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      return { configured: false, message: 'Email service not configured' }
    }
    await transporter.verify()
    return { configured: true, message: 'Email service is operational' }
  } catch (error) {
    return { configured: false, message: error.message }
  }
}

// Función para enviar email de backup
export const sendBackupEmail = async (backupPath, fileName, recipientEmail) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.warn('[EMAIL] SMTP not configured. Skipping backup email.')
      return { success: false, skipped: true }
    }

    const fs = await import('fs')
    if (!fs.existsSync(backupPath)) {
      console.warn(`[EMAIL] Backup file not found: ${backupPath}`)
      return { success: false, error: 'Backup file not found' }
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: recipientEmail || process.env.BACKUP_EMAIL,
      subject: `Lucván Backup - ${new Date().toISOString().split('T')[0]}`,
      html: `
        <h2>Lucván Database Backup</h2>
        <p>Backup creado: ${new Date().toLocaleString('es-ES')}</p>
        <p>Archivo: ${fileName}</p>
        <p>El archivo se encuentra adjunto.</p>
      `,
      attachments: [
        {
          path: backupPath,
        }
      ],
      replyTo: process.env.SMTP_REPLY_TO || 'soporte@lucvanlatam.com',
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('[EMAIL] Backup email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('[EMAIL] Error sending backup email:', error.message)
    return { success: false, error: error.message }
  }
}

export default {
  sendWelcomeEmail,
  sendBackupEmail,
  verifyEmailService,
}
