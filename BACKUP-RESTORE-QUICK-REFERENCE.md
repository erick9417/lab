# Panel de Backup & Restauración - REFERENCIA RÁPIDA

## 🎯 Vista General

```
┌─────────────────────────────────────────────────────────────┐
│ PANEL ADMINISTRATIVO - Backup & Restauración               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🔄 Realizar Backup Ahora   📤 Subir Backup desde Archivo │
│                                                             │
│  ┌─ Backups Disponibles ──────────────────────────────────┐ │
│  │ Archivo           Fecha      Tamaño    Estado  Acciones│ │
│  │ backup-2025-01-23 10:30:45   45.2 MB   ✓ OK   Restaurar│ │
│  │ backup-2025-01-22 00:00:00   42.1 MB   ✓ OK   Restaurar│ │
│  │ backup-2025-01-21 00:00:00   38.5 MB   ✓ OK   Restaurar│ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📱 Funcionalidades

### 1. Realizar Backup Manual
**Botón:** 🔄 Realizar Backup Ahora
**Acción:** Ejecuta backup inmediato
**Respuesta:** "Backup iniciado. Se enviará por correo"
**Resultado:** Email con archivo .sql adjunto

### 2. Subir Backup Antiguo
**Botón:** 📤 Subir Backup desde Archivo
**Cómo:** Drag & drop o click para seleccionar
**Archivo:** Cualquier .sql (de un correo anterior, por ejemplo)
**Tamaño:** Hasta 5 GB

### 3. Restaurar desde Servidor
**Opción 1:** Tabla → Botón "Restaurar" en cualquier fila
**Opción 2:** 3 pasos de confirmación
**Tipo:** Global (todo) o Parcial (clínica)

### 4. Restaurar desde Upload
**Opción 1:** Upload → Selecciona tipo → Restaurar
**Opción 2:** Directo a paso 2 de confirmación
**Tipo:** Global (todo) o Parcial (clínica)

---

## 🎨 Colores y Estados

| Elemento | Color | Significado |
|----------|-------|-------------|
| Estado ✓ | Verde | Backup completado y listo |
| Botón Backup | Azul | Acción normal |
| Botón Upload | Verde | Acción de import |
| Botón Restaurar (dialog) | Rojo | Acción destructiva |
| Advertencia | Rojo/Rosa | Riesgos de restauración |

---

## 🔄 Flujos de Trabajo

### A. Restaurar Backup Antiguo del Correo
```
1. Descargar .sql del correo
2. Admin Panel → Backups
3. Botón "📤 Subir Backup desde Archivo"
4. Drag & drop archivo
5. Seleccionar: Global o Parcial
6. Si Parcial → Seleccionar clínica
7. Botón "Restaurar"
8. Paso 2: Leer advertencia
9. Paso 3: Ingresar "RESTORE_CONFIRM"
10. Completado ✅
```

### B. Restaurar Backup del Servidor
```
1. Admin Panel → Backups
2. Tabla de backups
3. Click "Restaurar" en cualquier fila
4. Paso 1: Global o Parcial + clínica
5. Paso 2: Leer advertencia
6. Paso 3: Ingresar "RESTORE_CONFIRM"
7. Completado ✅
```

### C. Hacer Backup Manual
```
1. Admin Panel → Backups
2. Botón "🔄 Realizar Backup Ahora"
3. Confirmación: "Iniciado..."
4. Esperar email (5-10 segundos)
5. Email llega con .sql adjunto ✅
```

---

## 🔐 Confirmaciones de Seguridad

### Paso 1: Seleccionar Tipo
```
┌──────────────────────────┐
│ ⚪ Global                │
│    Restaurar toda BD     │
│                          │
│ ⚪ Parcial               │
│    Restaurar una clínica │
│    [Selecciona clínica] │
└──────────────────────────┘
```

### Paso 2: Advertencia
```
┌──────────────────────────┐
│ ⚠️ Advertencia           │
│                          │
│ Restaurará toda BD       │
│ Datos posteriores        │
│ se perderán              │
│                          │
│ ✓ Se crea safety backup  │
│                          │
│ ☐ Entiendo riesgos       │
└──────────────────────────┘
```

### Paso 3: Código
```
┌──────────────────────────┐
│ Código de confirmación:  │
│                          │
│ ┌──────────────────────┐ │
│ │ RESTORE_CONFIRM      │ │ ← Copiar
│ └──────────────────────┘ │
│                          │
│ ┌──────────────────────┐ │
│ │ [Ingresa aquí...]    │ │
│ └──────────────────────┘ │
└──────────────────────────┘
```

---

## 📊 Estados y Leyendas

### Estado de Backup
- ✓ Completado → Listo para restaurar
- ⏳ En progreso → Esperando a completarse
- ❌ Error → Revisar logs

### Tipo de Restauración
- 🌍 **Global** → Todos los datos, todas las clínicas
- 🏥 **Parcial** → Solo una clínica específica

### Tamaños Típicos
- 2-5 MB → Backup pequeño (pocas clínicas)
- 50-500 MB → Backup medio (varias clínicas)
- 1-5 GB → Backup grande (muchos datos históricos)

---

## ⏱️ Tiempos Esperados

| Operación | Tiempo |
|-----------|--------|
| Backup manual | ~10-30 segundos |
| Email de confirmación | ~5-10 segundos |
| Restauración global (100 MB) | ~1-3 minutos |
| Restauración global (1 GB) | ~10-20 minutos |
| Restauración parcial | ~30 segundos - 2 minutos |

---

## 🆘 Preguntas Comunes

**P: ¿Qué pasa si fallo la restauración?**
R: Se crea un "safety backup" antes de restaurar. Si algo falla, puedes restaurar eso.

**P: ¿Cuánto tiempo tarda?**
R: Depende del tamaño. Ves confirmación inmediata, pero se ejecuta en background.

**P: ¿Puedo restaurar parcial sin afectar otros?**
R: Sí, selecciona "Parcial" y elige la clínica. Los demás no se tocan.

**P: ¿El backup antiguo del correo va a funcionar?**
R: Sí, cualquier .sql guardado se puede subir y restaurar.

**P: ¿Quién puede hacer esto?**
R: Solo administradores. Requiere login y autorización.

**P: ¿Se guarda quién hizo qué?**
R: Sí, hay logs en el servidor de todas las restauraciones.

---

## 🛠️ Mantenimiento

### Limpieza Automática
- Backups se guardan 30 días
- Más antiguos se eliminan automáticamente
- No requiere intervención manual

### Monitoreo
- Ver historial completo de backups
- Verificar tamaño y fechas
- Email diario de confirmación

### Mejora Futura
- Dashboard de estadísticas de backup
- Alertas si falla un backup
- Restauración programada
- Integración con AWS S3

---

## 📞 Soporte

**Error "No file uploaded"**
- Asegúrate que seleccionaste archivo

**Error "Código incorrecto"**
- Código exacto: `RESTORE_CONFIRM`
- Sin espacios ni cambios

**Error "mysqldump not found"**
- MySQL no está en PATH
- Contactar a administrador de sistemas

**Error "Connection timeout"**
- BD no responde
- Revisar conectividad

---

## 📋 Checklist de Producción

- [ ] ✅ Backup automático funciona diario
- [ ] ✅ Correos llegan con archivo
- [ ] ✅ Panel muestra backups
- [ ] ✅ Upload de archivo funciona
- [ ] ✅ Restauración global probada
- [ ] ✅ Restauración parcial probada
- [ ] ✅ Código de confirmación requiere (3 pasos)
- [ ] ✅ Equipo capacitado
- [ ] ✅ Documentación entregada
- [ ] ✅ Contactos de emergencia listados

---

**Sistema de Backup & Restauración**
- Automático cada noche
- Manual bajo demanda
- Upload de archivos antiguos
- 3 pasos de confirmación
- Safety backup automático
- Solo para admins
- Auditoría completa
