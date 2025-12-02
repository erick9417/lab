import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState('home')
  const [selectedReport, setSelectedReport] = useState('patients')
  const [backupInProgress, setBackupInProgress] = useState(false)
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  // Mock data - Reemplazar con datos de Firebase
  const allPatients = [
    { id: '1', name: 'María González', phone: '+52 555 123 4567', email: 'maria@example.com', birthDate: '1990-05-15', clinic: 'Clínica Dental Central', notes: 'Paciente con diabetes tipo 2. Requiere seguimiento especial.' },
    { id: '2', name: 'Juan Pérez', phone: '+52 555 234 5678', email: 'juan@example.com', birthDate: '1983-08-22', clinic: 'Clínica Dental Central', notes: 'Alergico a ciertos materiales. Verificar antes de cada tratamiento.' },
    { id: '3', name: 'Ana Martínez', phone: '+52 555 345 6789', email: 'ana@example.com', birthDate: '1995-11-10', clinic: 'Dental Care Plus', notes: '' },
    { id: '4', name: 'Carlos López', phone: '+52 555 456 7890', email: 'carlos@example.com', birthDate: '1988-03-20', clinic: 'Odontología Integral', notes: 'Practica deporte de alto rendimiento. Necesita plantillas deportivas.' },
  ]

  const allTickets = [
    { id: '1', patientName: 'María González', clinicName: 'Clínica Dental Central', doctorName: 'Dr. Juan Pérez', templateType: 'Plantilla Correctiva', arch: 'Ambos', status: 'Lista para Entregar', date: '2025-11-30', createdDate: '2025-11-28' },
    { id: '2', patientName: 'Juan Pérez', clinicName: 'Clínica Dental Central', doctorName: 'Dra. María López', templateType: 'Plantilla Deportiva', arch: 'Izquierdo', status: 'En Producción', date: '2025-12-01', createdDate: '2025-11-29' },
    { id: '3', patientName: 'Ana Martínez', clinicName: 'Dental Care Plus', doctorName: 'Dr. Carlos Ruiz', templateType: 'Plantilla para Diabético', arch: 'Derecho', status: 'Pendiente', date: '2025-12-01', createdDate: '2025-12-01' },
    { id: '4', patientName: 'Carlos López', clinicName: 'Odontología Integral', doctorName: 'Dra. Ana Gómez', templateType: 'Plantilla Pediátrica', arch: 'Ambos', status: 'Entregado', date: '2025-11-25', createdDate: '2025-11-20' },
  ]

  // Mock de usuarios del sistema
  const allUsers = [
    { id: 'u1', name: 'Administrador', email: 'admin@lucvan.com', role: 'Admin', organization: 'Lucván', createdAt: '2025-10-01' },
    { id: 'u2', name: 'Clínica Central', email: 'clinica@lucvan.com', role: 'Clínica', organization: 'Clínica Dental Central', createdAt: '2025-10-05' },
    { id: 'u3', name: 'Taller Producción', email: 'taller@lucvan.com', role: 'Taller', organization: 'Producción', createdAt: '2025-10-08' },
  ]

  // Mock data de backups - Reemplazar con datos reales del servidor
  const backupHistory = [
    { id: '1', type: 'automatic', date: '2025-11-24', size: '2.3 GB', status: 'completed', chunks: 3, location: 'Firebase Storage' },
    { id: '2', type: 'automatic', date: '2025-11-17', size: '2.1 GB', status: 'completed', chunks: 3, location: 'Firebase Storage' },
    { id: '3', type: 'manual', date: '2025-11-15', size: '2.0 GB', status: 'completed', chunks: 3, location: 'Firebase Storage' },
    { id: '4', type: 'automatic', date: '2025-11-10', size: '1.9 GB', status: 'completed', chunks: 2, location: 'Firebase Storage' },
  ]

  const systemStatus = {
    lastBackup: '2025-11-24 03:00:00',
    nextBackup: '2025-12-01 03:00:00',
    serverSpace: { used: 8.5, total: 22, unit: 'GB' },
    cloudSpace: { used: 2.3, total: 5, unit: 'GB' },
    archiveCount: 145
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleExportReport = () => {
    let csvContent = ''
    let filename = ''

    if (selectedReport === 'patients') {
      // Generar reporte CSV de pacientes con BOM para UTF-8
      csvContent = [
        ['ID', 'Nombre', 'Telefono', 'Email', 'Fecha de Nacimiento', 'Clinica', 'Notas'],
        ...allPatients.map(p => [
          p.id,
          p.name,
          p.phone,
          p.email,
          p.birthDate,
          p.clinic,
          `"${(p.notes || '').replace(/"/g, '""')}"` // Escapar comillas en notas
        ])
      ].map(row => row.join(',')).join('\n')
      filename = `reporte-pacientes-${new Date().toISOString().split('T')[0]}.csv`
    } else if (selectedReport === 'tickets') {
      // Generar reporte CSV de tickets con BOM para UTF-8
      csvContent = [
        ['ID Ticket', 'Paciente', 'Clinica', 'Doctor', 'Tipo de Plantilla', 'Arcada', 'Estado', 'Fecha de Creacion', 'Ultima Actualizacion'],
        ...allTickets.map(t => [
          t.id,
          t.patientName,
          t.clinicName,
          t.doctorName,
          t.templateType,
          t.arch,
          t.status,
          new Date(t.createdDate).toLocaleDateString('es-ES'),
          new Date(t.date).toLocaleDateString('es-ES')
        ])
      ].map(row => row.join(',')).join('\n')
      filename = `reporte-tickets-${new Date().toISOString().split('T')[0]}.csv`
    } else if (selectedReport === 'users') {
      csvContent = [
        ['ID', 'Nombre', 'Email', 'Rol', 'Organización', 'Fecha de Creación'],
        ...allUsers.map(u => [u.id, u.name, u.email, u.role, u.organization, new Date(u.createdAt).toLocaleDateString('es-ES')])
      ].map(row => row.join(',')).join('\n')
      filename = `reporte-usuarios-${new Date().toISOString().split('T')[0]}.csv`
    }

    // Agregar BOM (Byte Order Mark) para que Excel reconozca UTF-8
    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleManualBackup = async () => {
    setBackupInProgress(true)
    
    // Simular proceso de backup
    // En producción: llamar a API del servidor
    setTimeout(() => {
      alert('Backup manual iniciado. El proceso se ejecutará en segundo plano y recibirás una notificación cuando termine.')
      setBackupInProgress(false)
    }, 2000)
  }

  const handleDownloadBackup = (backupId) => {
    // En producción: descargar desde Firebase/servidor
    alert(`Descargando backup ${backupId}... (Funcionalidad se implementará con Firebase)`)
  }

  const handleRestoreBackup = (backupId) => {
    const confirmed = window.confirm(
      '⚠️ ADVERTENCIA: Restaurar un backup sobrescribirá todos los datos actuales del sistema. ¿Estás seguro de continuar?'
    )
    
    if (confirmed) {
      alert(`Restaurando backup ${backupId}... (Funcionalidad se implementará con Firebase)`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img src="/lucvan-logo-web.png" alt="Lucván" className="h-12" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
                <p className="text-sm text-gray-600">Bienvenido, {currentUser?.name}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'home' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button
              onClick={() => setActiveView('users')}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105"
            >
              <div className="text-5xl mb-4">👥</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Ver Usuarios</h2>
              <p className="text-gray-600">Gestionar usuarios del sistema</p>
            </button>

            <button
              onClick={() => navigate('/clinic')}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105"
            >
              <div className="text-5xl mb-4">🏥</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Ver Clínicas</h2>
              <p className="text-gray-600">Acceder al módulo de clínicas</p>
            </button>

            <button
              onClick={() => navigate('/workshop')}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105"
            >
              <div className="text-5xl mb-4">🔨</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Ver Taller</h2>
              <p className="text-gray-600">Acceder al módulo de producción</p>
            </button>

            <button
              onClick={() => setActiveView('reports')}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105"
            >
              <div className="text-5xl mb-4">📊</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Reportes</h2>
              <p className="text-gray-600">Descargar reportes del sistema</p>
            </button>

            <button
              onClick={() => setActiveView('backups')}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105"
            >
              <div className="text-5xl mb-4">💾</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Backups</h2>
              <p className="text-gray-600">Gestionar copias de seguridad</p>
            </button>
          </div>
        )}

        {activeView === 'users' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
              <button
                onClick={() => setActiveView('home')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                ← Volver
              </button>
            </div>
            <div className="text-center py-12 text-gray-500">
              Módulo de gestión de usuarios en desarrollo
            </div>
          </div>
        )}

        {activeView === 'backups' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Gestión de Backups</h2>
              <div className="flex gap-3">
                <button
                  onClick={handleManualBackup}
                  disabled={backupInProgress}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    backupInProgress 
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {backupInProgress ? 'Procesando...' : 'Crear Backup Manual'}
                </button>
                <button
                  onClick={() => setActiveView('home')}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  ← Volver
                </button>
              </div>
            </div>

            {/* Estado del Sistema */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">Último Backup</p>
                <p className="text-lg font-semibold text-gray-800">
                  {new Date(systemStatus.lastBackup).toLocaleDateString('es-ES')}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(systemStatus.lastBackup).toLocaleTimeString('es-ES')}
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-gray-600 mb-1">Próximo Backup</p>
                <p className="text-lg font-semibold text-gray-800">
                  {new Date(systemStatus.nextBackup).toLocaleDateString('es-ES')}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(systemStatus.nextBackup).toLocaleTimeString('es-ES')}
                </p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-sm text-gray-600 mb-1">Espacio Servidor</p>
                <p className="text-lg font-semibold text-gray-800">
                  {systemStatus.serverSpace.used} / {systemStatus.serverSpace.total} GB
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${(systemStatus.serverSpace.used / systemStatus.serverSpace.total) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <p className="text-sm text-gray-600 mb-1">Espacio Cloud</p>
                <p className="text-lg font-semibold text-gray-800">
                  {systemStatus.cloudSpace.used} / {systemStatus.cloudSpace.total} GB
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ width: `${(systemStatus.cloudSpace.used / systemStatus.cloudSpace.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Historial de Backups */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Historial de Backups</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tipo</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Fecha</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tamaño</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Chunks</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {backupHistory.map((backup, index) => (
                      <tr 
                        key={backup.id}
                        className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      >
                        <td className="px-4 py-3 text-sm text-gray-800">{backup.id}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            backup.type === 'Automático' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {backup.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          {new Date(backup.date).toLocaleDateString('es-ES')} {new Date(backup.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">{backup.size}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{backup.chunks}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            backup.status === 'Completado' 
                              ? 'bg-green-100 text-green-800' 
                              : backup.status === 'En Progreso'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {backup.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDownloadBackup(backup.id)}
                              className="text-blue-600 hover:text-blue-800 font-medium"
                              title="Descargar backup"
                            >
                              Descargar
                            </button>
                            <button
                              onClick={() => handleRestoreBackup(backup.id)}
                              className="text-green-600 hover:text-green-800 font-medium"
                              title="Restaurar backup"
                            >
                              Restaurar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Información sobre Backups */}
            <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-gray-800 mb-2">ℹ️ Información del Sistema de Backups</h4>
              <p className="mb-2">
                <strong>Backups Automáticos:</strong> Se ejecutan semanalmente (domingos a las 3:00 AM). 
                Los backups grandes se dividen en chunks de ~900MB que se suben durante varios días consecutivos para no exceder los límites de transferencia.
              </p>
              <p className="mb-2">
                <strong>Backups Manuales:</strong> Puedes crear backups manuales en cualquier momento desde este panel. 
                El sistema notificará cuando el proceso finalice.
              </p>
              <p>
                <strong>Archivos Archivados:</strong> {systemStatus.archiveCount} archivos antiguos (mayores a 12 meses) están almacenados en la nube para liberar espacio en el servidor.
              </p>
            </div>
          </div>
        )}

        {activeView === 'reports' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Reportes del Sistema</h2>
              <button
                onClick={() => setActiveView('home')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                ← Volver
              </button>
            </div>

            <div className="space-y-6">
              {/* Selector de Tipo de Reporte */}
              <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Selecciona el Tipo de Reporte</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <button
                    onClick={() => setSelectedReport('patients')}
                    className={`p-4 rounded-lg border-2 transition ${
                      selectedReport === 'patients'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">📋</div>
                      <div className="text-left">
                        <h4 className="font-semibold text-gray-900">Reporte de Pacientes</h4>
                        <p className="text-sm text-gray-600">{allPatients.length} registros</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedReport('tickets')}
                    className={`p-4 rounded-lg border-2 transition ${
                      selectedReport === 'tickets'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">🎫</div>
                      <div className="text-left">
                        <h4 className="font-semibold text-gray-900">Reporte de Solicitudes</h4>
                        <p className="text-sm text-gray-600">{allTickets.length} registros</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedReport('users')}
                    className={`p-4 rounded-lg border-2 transition ${
                      selectedReport === 'users'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">👤</div>
                      <div className="text-left">
                        <h4 className="font-semibold text-gray-900">Reporte de Usuarios</h4>
                        <p className="text-sm text-gray-600">{allUsers.length} registros</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Vista Previa según selección (limitada a 20 registros) */}
              {selectedReport === 'patients' && (
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Vista Previa - Reporte de Pacientes</h3>
                    <button
                      onClick={handleExportReport}
                      className="px-6 py-2.5 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition flex items-center gap-2"
                    >
                      📥 Descargar Reporte
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Lista completa de pacientes con información de contacto y clínica asignada.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clínica</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {allPatients.slice(0, 20).map((patient, index) => (
                          <tr key={patient.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-4 py-3 text-sm text-gray-900">{patient.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{patient.email}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{patient.phone}</td>
                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">{patient.clinic}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {allPatients.length > 20 && (
                    <p className="text-sm text-gray-500 mt-3 text-center">
                      Mostrando 20 de {allPatients.length} pacientes. Descarga el reporte completo para ver todos.
                    </p>
                  )}
                </div>
              )}

              {selectedReport === 'tickets' && (
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Vista Previa - Reporte de Solicitudes</h3>
                    <button
                      onClick={handleExportReport}
                      className="px-6 py-2.5 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition flex items-center gap-2"
                    >
                      📥 Descargar Reporte
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Historial completo de solicitudes con información del paciente, clínica, estado y fechas.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paciente</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clínica</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Creación</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {allTickets.slice(0, 20).map((ticket, index) => (
                          <tr key={ticket.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-4 py-3 text-sm text-gray-900">{ticket.patientName}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{ticket.clinicName}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{ticket.templateType}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                ticket.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                ticket.status === 'En Producción' ? 'bg-blue-100 text-blue-800' :
                                ticket.status === 'Lista para Entregar' ? 'bg-purple-100 text-purple-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {ticket.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">{new Date(ticket.createdDate).toLocaleDateString('es-ES')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {allTickets.length > 20 && (
                    <p className="text-sm text-gray-500 mt-3 text-center">
                      Mostrando 20 de {allTickets.length} solicitudes. Descarga el reporte completo para ver todas.
                    </p>
                  )}
                </div>
              )}

              {selectedReport === 'users' && (
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Vista Previa - Reporte de Usuarios</h3>
                    <button
                      onClick={handleExportReport}
                      className="px-6 py-2.5 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition flex items-center gap-2"
                    >
                      📥 Descargar Reporte
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Usuarios del sistema, su rol y organización asociada.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Organización</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Creado</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {allUsers.slice(0, 20).map((u, index) => (
                          <tr key={u.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-4 py-3 text-sm text-gray-900">{u.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{u.role}</td>
                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">{u.organization}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{new Date(u.createdAt).toLocaleDateString('es-ES')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {allUsers.length > 20 && (
                    <p className="text-sm text-gray-500 mt-3 text-center">
                      Mostrando 20 de {allUsers.length} usuarios. Descarga el reporte completo para ver todos.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
