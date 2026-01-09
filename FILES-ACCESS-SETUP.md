# 📁 Sistema de Adjuntos - Acceso a Archivos

## Estado Actual ✅

El servidor tiene:
- ✅ Carpeta `/uploads` pública y accesible vía HTTP
- ✅ Frontend actualizado con protección contra duplicados
- ✅ Rutas API para servir archivos: `/api/uploads/:requestId/:filename`
- ✅ Rutas directas: `/uploads/[filename]`

## Cómo Acceder a los Archivos

### Opción 1: URL Directa (para archivos organizados)
```
https://sistema.lucvanlatam.com/uploads/[request-id]/[filename]
```

### Opción 2: API Download
```
GET /api/uploads/[request-id]/[filename]
```

### Opción 3: Descargar desde Solicitud
Dentro de la vista de solicitud, los archivos tienen un botón de descarga que usa la URL API.

## Organización de Archivos

Los archivos se organizan por solicitud:
```
server-pro/uploads/
├── 1/                          # Solicitud #1
│   ├── 1767803785002-815771772.jpeg
│   └── 1767820065036-17093526.pdf
├── 2/
│   └── 1767977494339-612774601.pdf
└── ...
```

## Próximos Pasos Recomendados

### 1. Reorganizar Archivos Existentes ⚠️
Los archivos actuales están en la raíz. Se pueden:
- Reorganizar manualmente por request ID
- O mantener una lista en BD del mapping (filename → requestId)

### 2. Mejorar Descarga en Frontend ✅ YA HECHO
- Verificar URL del archivo
- Soportar URLs relativas y absolutas
- Mostrar icono de descarga

### 3. Validar Permisos de Acceso
- Solo clínicas pueden ver sus propios archivos
- Verificación en backend por authentication

## Comandos Útiles

### Listar archivos en servidor
```bash
ssh -p 2222 lucvan5@ngx367.inmotionhosting.com "ls -la server-pro/uploads/"
```

### Descargar archivo específico
```bash
ssh -p 2222 lucvan5@ngx367.inmotionhosting.com "cd server-pro/uploads && file 1766070540791-940987965.pdf"
```

### Reorganizar por request ID
```bash
# Esto requeriría consultar la BD para mapear archivos a solicitudes
```

## URLs de Prueba

Para probar descargas:
```
https://sistema.lucvanlatam.com/uploads/1767803785002-815771772.jpeg
https://sistema.lucvanlatam.com/api/uploads/1/1767803785002-815771772.jpeg
```

---
**Nota:** Los cambios ya están en producción. El botón de envío ahora está protegido contra duplicados.
