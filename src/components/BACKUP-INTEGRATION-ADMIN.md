# AdminDashboard Integration Example

## Integración de BackupRestorePanel

### Paso 1: Importar el componente
En tu archivo `src/pages/AdminDashboard.jsx`, agrega en la parte superior:

```javascript
import BackupRestorePanel from '../components/BackupRestorePanel'
```

### Paso 2: Agregar el panel en el JSX

Ejemplo de estructura completa:

```jsx
import React, { useState } from 'react'
import BackupRestorePanel from '../components/BackupRestorePanel'

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('overview') // 'overview', 'users', 'backup', etc.

  return (
    <div className="admin-dashboard p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">🛠️ Panel de Administración</h1>

      {/* Navigation Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-300">
        <button
          onClick={() => setActiveSection('overview')}
          className={`pb-2 px-4 font-semibold transition ${
            activeSection === 'overview'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          📊 Resumen
        </button>

        <button
          onClick={() => setActiveSection('users')}
          className={`pb-2 px-4 font-semibold transition ${
            activeSection === 'users'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          👥 Usuarios
        </button>

        <button
          onClick={() => setActiveSection('backup')}
          className={`pb-2 px-4 font-semibold transition ${
            activeSection === 'backup'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          💾 Backup & Restauración
        </button>

        <button
          onClick={() => setActiveSection('settings')}
          className={`pb-2 px-4 font-semibold transition ${
            activeSection === 'settings'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          ⚙️ Configuración
        </button>
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {/* OVERVIEW */}
        {activeSection === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Usuarios" value="142" />
            <StatCard title="Clínicas Activas" value="8" />
            <StatCard title="Solicitudes Hoy" value="34" />
            <StatCard title="Último Backup" value="Hace 2h" />
          </div>
        )}

        {/* USERS SECTION */}
        {activeSection === 'users' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">👥 Gestión de Usuarios</h2>
            {/* Tu contenido de usuarios aquí */}
            <p className="text-gray-500">Sección de usuarios...</p>
          </div>
        )}

        {/* BACKUP & RESTORE SECTION */}
        {activeSection === 'backup' && (
          <BackupRestorePanel />
        )}

        {/* SETTINGS SECTION */}
        {activeSection === 'settings' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">⚙️ Configuración</h2>
            {/* Tu contenido de configuración aquí */}
            <p className="text-gray-500">Sección de configuración...</p>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Componente auxiliar: Tarjeta de estadística
 */
function StatCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold text-blue-600">{value}</p>
    </div>
  )
}
```

### Paso 3: Alternativa - Integración sin Tabs

Si no quieres usar tabs, simplemente agrega el componente donde desees:

```jsx
export default function AdminDashboard() {
  return (
    <div className="admin-dashboard p-6">
      <h1 className="text-3xl font-bold mb-6">🛠️ Panel Administrativo</h1>

      {/* Otras secciones */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">👥 Gestión de Usuarios</h2>
        {/* Contenido de usuarios */}
      </div>

      {/* Panel de Backup/Restore */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">💾 Backup y Restauración</h2>
        <BackupRestorePanel />
      </div>

      {/* Otras secciones */}
    </div>
  )
}
```

### Paso 4: Verificar en navegador

1. Ir a: `http://localhost:4000/admin` (o tu ruta de admin)
2. Debería verse:
   - Pestaña "💾 Backup & Restauración"
   - Tabla de backups disponibles
   - Botón "🔄 Realizar Backup Ahora"
   - Botón "Restaurar" en cada backup

---

## Estilos Personalizados (Opcional)

Si el componente no se ve bien con tus estilos, puedes ajustar los colores en `BackupRestorePanel.jsx`.

### Cambiar color principal de botones
**Archivo:** `src/components/BackupRestorePanel.jsx` línea ~180

```javascript
// ANTES (azul)
className="px-4 py-2 bg-blue-600 text-white rounded"

// DESPUÉS (verde)
className="px-4 py-2 bg-green-600 text-white rounded"

// DESPUÉS (rojo)
className="px-4 py-2 bg-red-600 text-white rounded"
```

### Usar Tailwind CSS o Bootstrap

El componente está escrito con Tailwind CSS. Si usas otro framework:
- **Bootstrap**: Reemplazar clases `bg-blue-600` → `btn btn-primary`
- **CSS Modules**: Crear `.module.css` con estilos equivalentes

---

## Verificación Final

✅ Checklist:
- [ ] `BackupRestorePanel` importado correctamente
- [ ] Componente se muestra en AdminDashboard
- [ ] Tabla de backups carga datos
- [ ] Botón "Realizar Backup" funciona
- [ ] Modal de restauración aparece
- [ ] Códigos de confirmación funcionan
- [ ] Respuestas de error se muestran bien

---

## Troubleshooting

### "Cannot find module 'BackupRestorePanel'"
- Verificar que el archivo está en `src/components/BackupRestorePanel.jsx`
- Verificar ruta de importación

### "BackupRestorePanel is not a React component"
- El archivo debe tener `export default function BackupRestorePanel()`
- Verificar que no hay errores de sintaxis en el archivo

### "Estilos no se aplican"
- Asegúrate que Tailwind CSS está configurado en el proyecto
- Ver `tailwind.config.js` en la raíz

---
