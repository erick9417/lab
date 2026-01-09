# Email Service Configuration

Para que el sistema de email funcione correctamente, agrega las siguientes variables de entorno en tu archivo `.env`:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=tu-app-password
SMTP_FROM=tu-email@gmail.com
SMTP_REPLY_TO=soporte@lucvanlatam.com
```

## Configuración por proveedor

### Gmail
1. Habilita "Acceso para aplicaciones menos seguras" o usa contraseñas de aplicación
2. URL para contraseñas de aplicación: https://myaccount.google.com/apppasswords
3. Puerto: 587 (TLS) o 465 (SSL)

### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.xxxxxxxxxxxx
```

### AWS SES
```env
SMTP_HOST=email-smtp.region.amazonaws.com
SMTP_PORT=587
SMTP_USER=tu-usuario-ses
SMTP_PASSWORD=tu-contraseña-ses
```

## Instalación de dependencias

Asegúrate de instalar nodemailer:
```bash
npm install nodemailer
```

## Testing local sin email

Si no tienes SMTP configurado, la aplicación funciona normalmente pero:
- Los emails no se envían
- Se ve un warning en los logs
- El flujo continúa sin problema
