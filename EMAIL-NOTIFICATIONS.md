# Sistema de Notificaciones por Email

## ¿Cómo funciona?

Cuando se **crea una solicitud**, se envían automáticamente 2 correos:

1. **Correo al Taller (Workshop)**: Notifica que hay una nueva solicitud por procesar
2. **Correo a la Clínica**: Confirma que su solicitud fue creada exitosamente

## ¿Cuándo recibo los correos?

**Localmente (en desarrollo):**
- Los correos se envían **inmediatamente** cuando se crea la solicitud
- **REQUISITO**: Debes tener credenciales SMTP válidas configuradas en `.env`

**En Producción:**
- Los correos se envían inmediatamente de la misma forma

## Configuración Requerida

Los siguientes variables de entorno deben estar configuradas en `server/.env`:

```env
# SMTP Configuration
SMTP_HOST=mail.lucvanlatam.com
SMTP_PORT=465
SMTP_USER=notificaciones@lucvanlatam.com
SMTP_PASSWORD=tu_password_aqui
SMTP_FROM_EMAIL=notificaciones@lucvanlatam.com
SMTP_FROM_NAME=Sistema Lucván
PRODUCTION_EMAIL=taller@lucvanlatam.com
WORKSHOP_EMAIL=taller@lucvanlatam.com

# Optional
FRONTEND_URL=http://localhost:5173
```

### Notas sobre puertos SMTP:
- **Puerto 465**: SSL (secure) - automatico en código
- **Puerto 587**: STARTTLS - automatico en código
- El código detecta automáticamente si usar SSL basado en el puerto

## Dónde están los Correos

**Archivo de configuración:**
- `server/src/utils/emailService.js` - Contiene `sendRequestCreatedEmail()`
- `server/src/routes/requests.js` - Llama a `sendRequestCreatedEmail()` cuando se crea solicitud

## ¿Qué pasa si hay error de email?

Si falla el envío de correo:
- ✅ **La solicitud se crea igualmente** (los errores no afectan la creación)
- ❌ Los correos no se envían
- 📋 Se registra un warning en la consola del servidor: "Error al enviar correo..."

## Para probar localmente

1. **Verificar que SMTP está configurado**: Mira el archivo `.env` en `server/`
2. **Crear una clínica** con email de contacto válido
3. **Crear un paciente** en esa clínica
4. **Crear una solicitud**
5. **Ver la consola del servidor** (terminal donde corre Node):
   - Si ves `✅ Correo de solicitud creada enviado...` = Funcionó
   - Si ves `❌ Error enviando correo...` = Verifica credenciales SMTP

## Qué información incluyen los correos

### Correo al Taller:
- Número de solicitud (#)
- Clínica
- Paciente
- Doctor
- Tipo de plantilla
- Pie (Izquierdo/Derecho/Ambos)
- Talla
- Observaciones (si existen)

### Correo a la Clínica:
- Confirmación de creación
- Número de solicitud
- Nombre del paciente
- Doctor
- Tipo de plantilla
- Estado: Pendiente

## Troubleshooting

| Problema | Solución |
|----------|----------|
| No recibo correos | Verifica que `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_HOST` y `SMTP_PORT` estén correctos en `.env` |
| "AUTH failed" | Las credenciales SMTP son inválidas |
| "Connection timeout" | El host SMTP no es accesible (verifica firewall) |
| Los correos van a spam | Usa un dominio válido en `SMTP_FROM_EMAIL` |

## Próximas mejoras

- [ ] Configurar webhook para redirigir correos de error
- [ ] Agregar correos cuando cambia el estado de solicitud (En Producción, Lista para Entregar, etc.)
- [ ] Agregar PDF con detalles de solicitud como adjunto
- [ ] Configurar queue de emails (Bull) para reintentos automáticos
