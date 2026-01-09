import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LucvanHeader from '../components/LucvanHeader';
import { apiFetch } from '../lib/api';

// Lista de países de América para selecciones de clínica
const AMERICAS_COUNTRIES = [
  'Argentina',
  'Bahamas',
  'Barbados',
  'Belice',
  'Bolivia',
  'Brasil',
  'Canadá',
  'Chile',
  'Colombia',
  'Costa Rica',
  'Cuba',
  'Dominica',
  'Ecuador',
  'El Salvador',
  'Estados Unidos',
  'Granada',
  'Guatemala',
  'Guyana',
  'Haití',
  'Honduras',
  'Jamaica',
  'México',
  'Nicaragua',
  'Panamá',
  'Paraguay',
  'Perú',
  'República Dominicana',
  'San Cristóbal y Nieves',
  'San Vicente y las Granadinas',
  'Santa Lucía',
  'Surinam',
  'Trinidad y Tobago',
  'Uruguay',
  'Venezuela'
]

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState('home')
  const [selectedReport, setSelectedReport] = useState('patients')
  const [backupInProgress, setBackupInProgress] = useState(false)
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [showCreateClinic, setShowCreateClinic] = useState(false)
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // API data state
  const [allPatients, setAllPatients] = useState([])
  const [allTickets, setAllTickets] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [allClinics, setAllClinics] = useState([])
  const [newClinic, setNewClinic] = useState({ name: '', country: '', phone: '', address: '' })
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'clinic', clinic: '' })

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError('')

        // Load users
        const usersResponse = await apiFetch('/api/users')
        if (usersResponse.ok) {
          const users = await usersResponse.json()
          setAllUsers(users.map(u => ({
            id: u.id,
            name: u.email.split('@')[0],
            email: u.email,
            role: u.role,
            organization: u.clinic_name || 'Lucván',
            createdAt: new Date().toISOString().split('T')[0] // Placeholder
          })))
        }

        // Load clinics
        const clinicsResponse = await apiFetch('/api/clinics')
        if (clinicsResponse.ok) {
          const clinics = await clinicsResponse.json()
          setAllClinics(clinics)
        }

        // Load requests and patients first to map correctly
        const [requestsResponse, patientsResponse] = await Promise.all([
          apiFetch('/api/requests'),
          apiFetch('/api/patients')
        ])

        let patientMap = {}
        if (patientsResponse.ok) {
          const patients = await patientsResponse.json()
          patientMap = Object.fromEntries(patients.map(p => [p.id, p]))
        }

        if (requestsResponse.ok) {
          const requests = await requestsResponse.json()
          setAllTickets(requests.map(r => {
            const patient = patientMap[r.patient_id]
            const statusMap = {
              'pending': 'Pendiente',
              'in_progress': 'En Producción',
              'in_production': 'En Producción',
              'ready': 'Lista para Entregar',
              'delivered': 'Entregada',
              'cancelled': 'Cancelada'
            }
            return {
              id: r.id,
              patientName: patient?.name || `Paciente ${r.patient_id}`,
              clinicName: patient?.clinic || r.clinic_name || 'Sin clínica',
              doctorName: r.doctor_name || '-',
              templateType: r.template_type || 'Solicitud',
              arch: r.foot_side || '-',
              status: statusMap[r.status] || 'Pendiente',
              date: new Date(r.created_at).toISOString().split('T')[0],
              createdDate: new Date(r.created_at).toISOString().split('T')[0]
            }
          }))
        }

        // Load patients from API (falls back to empty array)
        try {
          const patientsResp = await apiFetch('/api/patients')
          if (patientsResp.ok) {
            const patients = await patientsResp.json()
            // normalize dates if needed
            setAllPatients(patients.map(p => ({
              id: p.id,
              name: p.name,
              phone: p.phone,
              email: p.email,
              birthDate: p.birthDate || p.birth_date || null,
              clinic: p.clinic,
              notes: p.notes
            })))
          } else {
            setAllPatients([])
          }
        } catch (err) {
          console.error('Error loading patients:', err)
          setAllPatients([])
        }

      } catch (err) {
        console.error('Error loading data:', err)
        setError('Error al cargar los datos')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Load backup data function
  const loadBackupData = async () => {
    try {
      const response = await apiFetch('/api/backups')
      if (response.ok) {
        const data = await response.json()
        setBackupHistory(data.backups || [])
        setSystemStatus(data.status || {
          lastBackup: null,
          nextBackup: null,
          serverSpace: { used: 0, total: 22, unit: 'GB' },
          cloudSpace: { used: 0, total: 5, unit: 'GB' },
          archiveCount: 0
        })
      }
    } catch (err) {
      console.error('Error loading backup data:', err)
    }
  }

  // Load backups when entering backups view
  useEffect(() => {
    if (activeView === 'backups') {
      loadBackupData()
    }
  }, [activeView])

  // Backup data - Initially empty, populated from API
  const [backupHistory, setBackupHistory] = useState([])
  const [systemStatus, setSystemStatus] = useState({
    lastBackup: null,
    nextBackup: null,
    serverSpace: { used: 0, total: 22, unit: 'GB' },
    cloudSpace: { used: 0, total: 5, unit: 'GB' },
    archiveCount: 0
  })

  const handleCreateClinic = async () => {
    if (!newClinic.name || !newClinic.country) {
      alert('Nombre y país son obligatorios')
      return
    }

    try {
      const response = await apiFetch('/api/clinics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newClinic.name,
          phone: newClinic.phone,
          email: newClinic.email || null,
          address: newClinic.address || null
        }),
      })

      if (response.ok) {
        const clinic = await response.json()
        setAllClinics([...allClinics, clinic])
        setNewClinic({ name: '', country: '', phone: '', address: '' })
        setShowCreateClinic(false)
        alert('Clínica creada exitosamente')
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error creating clinic:', error)
      alert('Error al crear la clínica')
    }
  }

  const handleCreateUser = async () => {
    if (!newUser.email || !newUser.role) {
      alert('Email y rol son obligatorios')
      return
    }

    try {
      const response = await apiFetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newUser.email,
          password: 'temp123', // Temporary password
          role: newUser.role.toLowerCase(),
          clinicId: newUser.role === 'clinic' ? parseInt(newUser.clinic) : null
        }),
      })

      if (response.ok) {
        const user = await response.json()
        setAllUsers([...allUsers, {
          id: user.id,
          name: user.email.split('@')[0],
          email: user.email,
          role: user.role,
          organization: user.clinicId ? 'Clínica' : 'Lucván',
          createdAt: new Date().toISOString().split('T')[0]
        }])
        setNewUser({ name: '', email: '', role: 'clinic', clinic: '' })
        alert('Usuario creado exitosamente')
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Error al crear el usuario')
    }
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
        ['Nombre', 'Clínica', 'Fecha de Creación'],
        ...allPatients.map(p => [
          p.name,
          p.clinic,
          p.createdAt ? new Date(p.createdAt).toLocaleDateString('es-ES') : '-'
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
    try {
      const response = await apiFetch('/api/backups/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (response.ok) {
        const data = await response.json()
        alert('Backup manual iniciado. El proceso se ejecutará en segundo plano.')
        // Reload backup history
        loadBackupData()
      } else {
        const error = await response.json()
        alert('Error al crear backup: ' + (error.error || 'Error desconocido'))
      }
    } catch (err) {
      console.error('Error creating backup:', err)
      alert('Error al crear backup manual')
    } finally {
      setBackupInProgress(false)
    }
  }

  const handleDownloadBackup = async (backupId) => {
    try {
      const response = await apiFetch(`/api/backups/${backupId}/download`)
      if (response.ok) {
        // La respuesta es el archivo, descargar directamente
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `backup-${backupId}.sql`
        a.click()
        window.URL.revokeObjectURL(url)
        alert('Descarga iniciada')
      } else {
        const error = await response.json()
        alert('Error al descargar: ' + (error.error || 'Error desconocido'))
      }
    } catch (err) {
      console.error('Error downloading backup:', err)
      alert('Error al descargar backup')
    }
  }

  const handleRestoreBackup = async (backupId) => {
    const confirmed = window.confirm(
      '⚠️ ADVERTENCIA: Restaurar un backup sobrescribirá todos los datos actuales del sistema. ¿Estás seguro de continuar?'
    )
    
    if (confirmed) {
      try {
        const response = await apiFetch(`/api/backups/${backupId}/restore`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
        
        if (response.ok) {
          const data = await response.json()
          alert('Restauración iniciada en segundo plano. El sistema puede reiniciarse.')
          loadBackupData()
        } else {
          const error = await response.json()
          alert('Error al restaurar: ' + (error.error || 'Error desconocido'))
        }
      } catch (err) {
        console.error('Error restoring backup:', err)
        alert('Error al restaurar backup')
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F6F8]">
      <LucvanHeader
        title="Panel de Administración"
        user={currentUser}
        onLogout={handleLogout}
        showBack={activeView !== 'home'}
        onBack={() => setActiveView('home')}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'home' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button
              onClick={() => navigate('/admin/users')}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition transform hover:scale-105 border border-gray-100"
            >
              <div className="text-5xl mb-4">👥</div>
              <h2 className="text-xl font-bold text-blue-900 mb-2">Ver Usuarios</h2>
              <p className="text-gray-600">Gestionar usuarios del sistema</p>
            </button>

            <button
              onClick={() => navigate('/clinic')}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition transform hover:scale-105 border border-gray-100"
            >
              <div className="text-5xl mb-4">🏥</div>
              <h2 className="text-xl font-bold text-blue-900 mb-2">Ver Clínicas</h2>
              <p className="text-gray-600">Acceder al módulo de clínicas</p>
            </button>
            <button
              onClick={() => navigate('/production')}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition transform hover:scale-105 border border-gray-100"
            >
              <div className="text-5xl mb-4">🔨</div>
              <h2 className="text-xl font-bold text-blue-900 mb-2">Producción</h2>
              <p className="text-gray-600">Acceder al módulo de producción</p>
            </button>

            <button
              onClick={() => setActiveView('backups')}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition transform hover:scale-105 border border-gray-100"
            >
              <div className="text-5xl mb-4">💾</div>
              <h2 className="text-xl font-bold text-blue-900 mb-2">Backups</h2>
              <p className="text-gray-600">Gestionar copias de seguridad</p>
            </button>

            <button
              onClick={() => setActiveView('reports')}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition transform hover:scale-105 border border-gray-100"
            >
              <div className="text-5xl mb-4">📊</div>
              <h2 className="text-xl font-bold text-blue-900 mb-2">Reportes</h2>
              <p className="text-gray-600">Descargar reportes en CSV</p>
            </button>
          </div>
        )}

        {activeView === 'users' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
              <button
                onClick={() => setActiveView('home')}
                className="px-4 py-2 bg-white border-2 border-[#0066A4] text-[#003C63] rounded-full hover:bg-[#F4F6F8] font-semibold transition-all"
              >
                ← Volver
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Crear Usuario</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0066A4] focus:border-[#0066A4]"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0066A4] focus:border-[#0066A4]"
                  />
                  <select
                    value={newUser.role}
                    onChange={(e) => {
                      const roleValue = e.target.value
                      setNewUser({ ...newUser, role: roleValue, clinic: roleValue === 'clinic' ? newUser.clinic : '' })
                    }}
                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0066A4] focus:border-[#0066A4]"
                  >
                    <option value="clinic">Clínica</option>
                    <option value="production">Producción</option>
                    <option value="admin">Admin</option>
                  </select>

                  {newUser.role === 'clinic' && (
                    <div className="flex items-center gap-2">
                      <select
                        value={newUser.clinic}
                        onChange={(e) => setNewUser({ ...newUser, clinic: e.target.value })}
                        className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0066A4] focus:border-[#0066A4]"
                      >
                        <option value="">Seleccionar Clínica</option>
                        {allPatients
                          .map((p) => p.clinic)
                          .filter((v, i, a) => a.indexOf(v) === i)
                          .map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setShowCreateClinic(true)}
                        className="px-4 py-2 bg-[#F5C400] text-[#003C63] rounded-full font-bold hover:bg-[#ffd933] transition shadow-[0_12px_24px_-10px_rgba(0,60,99,0.25)]"
                      >
                        + Clínica
                      </button>
                    </div>
                  )}

                  <button 
                    className="w-full px-4 py-2 bg-[#F5C400] text-[#003C63] rounded-full font-bold hover:bg-[#ffd933] transition"
                    onClick={handleCreateUser}
                  >
                    Crear Usuario
                  </button>
                </div>
              </div>

              {showCreateClinic && (
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Crear Clínica</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Nombre de la Clínica"
                      value={newClinic.name}
                      onChange={(e) => setNewClinic({ ...newClinic, name: e.target.value })}
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0066A4] focus:border-[#0066A4]"
                    />
                    <select
                      required
                      value={newClinic.country}
                      onChange={(e) => setNewClinic({ ...newClinic, country: e.target.value })}
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0066A4] focus:border-[#0066A4]"
                    >
                      <option value="">Seleccionar País (obligatorio)</option>
                      {AMERICAS_COUNTRIES.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9 ]*"
                      placeholder="Teléfono de contacto"
                      value={newClinic.phone}
                      onChange={(e) => setNewClinic({ ...newClinic, phone: e.target.value.replace(/[^0-9 ]/g, '') })}
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0066A4] focus:border-[#0066A4]"
                    />
                    <textarea
                      rows="3"
                      placeholder="Dirección exacta de la clínica"
                      value={newClinic.address}
                      onChange={(e) => setNewClinic({ ...newClinic, address: e.target.value })}
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0066A4] focus:border-[#0066A4]"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="flex-1 px-4 py-2 bg-[#F5C400] text-[#003C63] rounded-full font-bold hover:bg-[#ffd933] transition"
                        onClick={handleCreateClinic}
                      >
                        Guardar Clínica
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCreateClinic(false)}
                        className="flex-1 px-4 py-2 bg-white border-2 border-[#0066A4] text-[#003C63] rounded-full hover:bg-[#F4F6F8]"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeView === 'backups' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#003C63]">Gestión de Backups</h2>
              <button
                onClick={handleManualBackup}
                disabled={backupInProgress}
                className={`px-6 py-2 rounded-full font-bold transition-colors duration-200 shadow-lg ${
                  backupInProgress
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-[#F5C400] text-[#003C63] hover:bg-[#ffd933]'
                }`}
              >
                {backupInProgress ? 'Procesando...' : 'Crear Backup Manual'}
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">Último Backup</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {systemStatus.lastBackup ? new Date(systemStatus.lastBackup).toLocaleDateString('es-ES') : 'Sin datos'}
                  </p>
                  {systemStatus.lastBackup && (
                    <p className="text-xs text-gray-500">
                      {new Date(systemStatus.lastBackup).toLocaleTimeString('es-ES')}
                    </p>
                  )}
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-600 mb-1">Próximo Backup</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {systemStatus.nextBackup ? new Date(systemStatus.nextBackup).toLocaleDateString('es-ES') : 'Domingos 3:00 AM'}
                  </p>
                  {systemStatus.nextBackup && (
                    <p className="text-xs text-gray-500">
                      {new Date(systemStatus.nextBackup).toLocaleTimeString('es-ES')}
                    </p>
                  )}
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

              <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
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
                      {backupHistory.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                            No hay backups registrados. Crea un backup manual para comenzar.
                          </td>
                        </tr>
                      ) : backupHistory.map((backup, index) => (
                        <tr key={backup.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-3 text-sm text-gray-800">{backup.id}</td>
                          <td className="px-4 py-3 text-sm">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                backup.type === 'Automático' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {backup.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-800">
                            {new Date(backup.date).toLocaleDateString('es-ES')}{' '}
                            {new Date(backup.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-800">{backup.size}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{backup.chunks}</td>
                          <td className="px-4 py-3 text-sm">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                backup.status === 'completed' || backup.status === 'Completado'
                                  ? 'bg-green-100 text-green-800'
                                  : backup.status === 'in_progress' || backup.status === 'En Progreso'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {backup.status === 'completed' ? 'Completado' : backup.status === 'in_progress' ? 'En Progreso' : backup.status}
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
          </div>
        )}
        {activeView === 'reports' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#003C63]">Reportes</h2>
              <button
                onClick={() => setActiveView('home')}
                className="px-4 py-2 bg-white border-2 border-[#0066A4] text-[#003C63] rounded-full hover:bg-[#F4F6F8] font-semibold transition-all"
              >
                ← Volver
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Seleccionar Reporte:</label>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedReport('patients')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    selectedReport === 'patients'
                      ? 'bg-[#0066A4] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  👥 Pacientes
                </button>
                <button
                  onClick={() => setSelectedReport('tickets')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    selectedReport === 'tickets'
                      ? 'bg-[#0066A4] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🎫 Tickets
                </button>
                <button
                  onClick={() => setSelectedReport('users')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    selectedReport === 'users'
                      ? 'bg-[#0066A4] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  👤 Usuarios
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                {selectedReport === 'patients'
                  ? 'Reporte de Pacientes'
                  : selectedReport === 'tickets'
                  ? 'Reporte de Tickets'
                  : 'Reporte de Usuarios'}
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-gray-200">
                    <tr>
                      {selectedReport === 'patients' && (
                        <>
                          <th className="border border-gray-300 px-4 py-2 text-left">Nombre</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Clínica</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">F. Creación</th>
                        </>
                      )}
                      {selectedReport === 'tickets' && (
                        <>
                          <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Paciente</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Clínica</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Doctor</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Tipo</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Arcada</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Estado</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Fecha</th>
                        </>
                      )}
                      {selectedReport === 'users' && (
                        <>
                          <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Nombre</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Rol</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">F. Creación</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedReport === 'patients' &&
                      (allPatients.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="border border-gray-300 px-4 py-4 text-center text-gray-500">
                            No hay pacientes registrados
                          </td>
                        </tr>
                      ) : (
                        allPatients.map((p, idx) => (
                          <tr key={p.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="border border-gray-300 px-4 py-2">{p.name}</td>
                            <td className="border border-gray-300 px-4 py-2">{p.clinic}</td>
                            <td className="border border-gray-300 px-4 py-2">{p.createdAt ? new Date(p.createdAt).toLocaleDateString('es-ES') : '-'}</td>
                          </tr>
                        ))
                      ))}
                    {selectedReport === 'tickets' &&
                      (allTickets.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="border border-gray-300 px-4 py-4 text-center text-gray-500">
                            No hay tickets registrados
                          </td>
                        </tr>
                      ) : (
                        allTickets.map((t, idx) => (
                          <tr key={t.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="border border-gray-300 px-4 py-2">{t.id}</td>
                            <td className="border border-gray-300 px-4 py-2">{t.patientName}</td>
                            <td className="border border-gray-300 px-4 py-2">{t.clinicName}</td>
                            <td className="border border-gray-300 px-4 py-2">{t.doctorName}</td>
                            <td className="border border-gray-300 px-4 py-2">{t.templateType}</td>
                            <td className="border border-gray-300 px-4 py-2">{t.arch}</td>
                            <td className="border border-gray-300 px-4 py-2">
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  t.status === 'Entregado'
                                    ? 'bg-green-100 text-green-800'
                                    : t.status === 'En Producción'
                                    ? 'bg-blue-100 text-blue-800'
                                    : t.status === 'Pendiente'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : t.status === 'Cancelado'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {t.status}
                              </span>
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {new Date(t.date).toLocaleDateString('es-ES')}
                            </td>
                          </tr>
                        ))
                      ))}
                    {selectedReport === 'users' &&
                      (allUsers.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="border border-gray-300 px-4 py-4 text-center text-gray-500">
                            No hay usuarios registrados
                          </td>
                        </tr>
                      ) : (
                        allUsers.map((u, idx) => (
                          <tr key={u.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="border border-gray-300 px-4 py-2">{u.id}</td>
                            <td className="border border-gray-300 px-4 py-2">{u.name}</td>
                            <td className="border border-gray-300 px-4 py-2">{u.email}</td>
                            <td className="border border-gray-300 px-4 py-2">
                              <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                {u.role}
                              </span>
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {u.createdAt
                                ? new Date(u.createdAt).toLocaleDateString('es-ES')
                                : '-'}
                            </td>
                          </tr>
                        ))
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            <button
              onClick={handleExportReport}
              className="px-6 py-3 bg-[#0066A4] text-white rounded-full font-bold hover:bg-[#005a8f] transition shadow-lg"
            >
              📥 Descargar como CSV
            </button>
          </div>
        )}      </main>
    </div>
  )
}
