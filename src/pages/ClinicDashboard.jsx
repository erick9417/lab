import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';
import LucvanHeader from '../components/LucvanHeader';
import { formatDateToDisplay, formatDateToISO, isValidDateFormat } from '../lib/dateUtils';
// Códigos de país para América. Se puede extender desde backend más adelante.
const AMERICAS_COUNTRY_CODES = [
  { code: '+1', country: 'Estados Unidos/Canadá', flag: '🇺🇸' },
  { code: '+1242', country: 'Bahamas', flag: '🇧🇸' },
  { code: '+1246', country: 'Barbados', flag: '🇧🇧' },
  { code: '+501', country: 'Belice', flag: '🇧🇿' },
  { code: '+591', country: 'Bolivia', flag: '🇧🇴' },
  { code: '+55', country: 'Brasil', flag: '🇧🇷' },
  { code: '+56', country: 'Chile', flag: '🇨🇱' },
  { code: '+57', country: 'Colombia', flag: '🇨🇴' },
  { code: '+506', country: 'Costa Rica', flag: '🇨🇷' },
  { code: '+53', country: 'Cuba', flag: '🇨🇺' },
  { code: '+1809', country: 'República Dominicana', flag: '🇩🇴' },
  { code: '+1829', country: 'República Dominicana (Alt)', flag: '🇩🇴' },
  { code: '+1849', country: 'República Dominicana (Alt2)', flag: '🇩🇴' },
  { code: '+593', country: 'Ecuador', flag: '🇪🇨' },
  { code: '+503', country: 'El Salvador', flag: '🇸🇻' },
  { code: '+502', country: 'Guatemala', flag: '🇬🇹' },
  { code: '+592', country: 'Guyana', flag: '🇬🇾' },
  { code: '+509', country: 'Haití', flag: '🇭🇹' },
  { code: '+504', country: 'Honduras', flag: '🇭🇳' },
  { code: '+1876', country: 'Jamaica', flag: '🇯🇲' },
  { code: '+52', country: 'México', flag: '🇲🇽' },
  { code: '+505', country: 'Nicaragua', flag: '🇳🇮' },
  { code: '+507', country: 'Panamá', flag: '🇵🇦' },
  { code: '+595', country: 'Paraguay', flag: '🇵🇾' },
  { code: '+51', country: 'Perú', flag: '🇵🇪' },
  { code: '+1869', country: 'San Cristóbal y Nieves', flag: '🇰🇳' },
  { code: '+1758', country: 'Santa Lucía', flag: '🇱🇨' },
  { code: '+1784', country: 'San Vicente y las Granadinas', flag: '🇻🇨' },
  { code: '+597', country: 'Surinam', flag: '🇸🇷' },
  { code: '+1868', country: 'Trinidad y Tobago', flag: '🇹🇹' },
  { code: '+598', country: 'Uruguay', flag: '🇺🇾' },
  { code: '+58', country: 'Venezuela', flag: '🇻🇪' },
]

const getDefaultCountryCode = (countryName) => {
  const match = AMERICAS_COUNTRY_CODES.find((item) => item.country.toLowerCase() === (countryName || '').toLowerCase())
  return match ? match.code : '+52'
}


export default function ClinicDashboard() {
  const [activeTab, setActiveTab] = useState('patients')
  const [searchTerm, setSearchTerm] = useState('')
  const [requestSearchTerm, setRequestSearchTerm] = useState('')
  const [requestStatusFilter, setRequestStatusFilter] = useState('all')
  const [showNewPatientModal, setShowNewPatientModal] = useState(false)
  const { currentUser, logout } = useAuth()
  const [countryCode, setCountryCode] = useState('+52')
  const [clinicInfo, setClinicInfo] = useState(null)
  const [requests, setRequests] = useState([])
  const [allClinics, setAllClinics] = useState([])
  const navigate = useNavigate()

  // Cargar info de clínica y pacientes al iniciar
  useEffect(() => {
    const load = async () => {
      try {
        // Obtener todas las clínicas (para admin)
        const resAllClinics = await apiFetch(`/api/clinics?limit=100`)
        if (resAllClinics.ok) {
          const clinicsData = await resAllClinics.json()
          setAllClinics(clinicsData || [])
          
          // Si es admin, usar los datos cargados; si no, solo buscar su clínica
          if (currentUser?.role === 'admin') {
            setClinicInfo(null)
            setCountryCode('+52')
          } else if (currentUser?.clinicId) {
            const c = clinicsData.find((x) => x.id === currentUser.clinicId)
            setClinicInfo(c || null)
            setCountryCode(getDefaultCountryCode(c?.country))
          }
        }
        // Obtener pacientes filtrados por clínica (lo maneja el backend)
        const res = await apiFetch('/api/patients')
        if (res.ok) {
          const data = await res.json()
          setPatients(data || [])
        } else {
          setPatients([])
        }

        // Obtener todas las solicitudes
        const reqRes = await apiFetch('/api/requests')
        if (reqRes.ok) {
          const reqData = await reqRes.json()
          setRequests(reqData || [])
        } else {
          setRequests([])
        }
      } catch (err) {
        console.error('Error loading data:', err)
        setPatients([])
      }
    }
    load()
    
    // Auto-refresh cada 30 segundos para ver cambios de estado en tiempo real
    const interval = setInterval(() => {
      apiFetch('/api/requests').then(res => {
        if (res.ok) {
          res.json().then(data => setRequests(data || []))
        }
      }).catch(err => console.error('Error refreshing requests:', err))
    }, 30000)
    
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.clinicId])

  // Pacientes
  const [patients, setPatients] = useState([])

  const [editingPatient, setEditingPatient] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)

  // Formatea input de fecha mientras se escribe, insertando barras automáticamente
  const formatDateInputValue = (value) => {
    const digits = (value || '').replace(/[^0-9]/g, '').slice(0, 8)
    if (digits.length <= 2) return digits
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
  }

  // Función para calcular edad
  const calculateAge = (birthDate) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  // Filtrar pacientes por búsqueda
  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone.includes(searchTerm)
  )

  const handleEditPatient = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const name = form.elements['editName'].value.trim()
    const notes = form.elements['editNotes'].value.trim() || null

    if (!name) return

    try {
      const res = await apiFetch(`/api/patients/${editingPatient.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, notes })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al actualizar paciente')
      setPatients((prev) => prev.map((p) => (p.id === editingPatient.id ? { ...p, ...data } : p)))
      setEditingPatient(null)
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDeletePatient = async (patientId) => {
    try {
      const res = await apiFetch(`/api/patients/${patientId}`, {
        method: 'DELETE'
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al eliminar paciente')
      }
      setPatients((prev) => prev.filter((p) => p.id !== patientId))
      setShowDeleteConfirm(null)
    } catch (err) {
      alert(err.message)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleBackToAdmin = () => {
    if (currentUser?.role === 'admin') {
      navigate('/admin')
    }
  }

  // Agrupar pacientes por letra inicial para una navegación más rápida
  const groupedPatients = Object.entries(
    filteredPatients.reduce((acc, p) => {
      const letter = (p.name?.trim()?.charAt(0) || '#').toUpperCase()
      const key = /[A-ZÁÉÍÓÚÜÑ]/i.test(letter) ? letter : '#'
      acc[key] = acc[key] || []
      acc[key].push(p)
      return acc
    }, {})
  ).sort((a, b) => a[0].localeCompare(b[0]))

  // Contadores de estados para mostrar badges en filtros
  const activeRequests = requests.filter(r => r.status !== 'cancelled' && r.status !== 'delivered')
  const countAll = activeRequests.length
  const countPending = activeRequests.filter(r => r.status === 'pending').length
  const countInProd = activeRequests.filter(r => r.status === 'in_production').length
  const countReady = activeRequests.filter(r => r.status === 'ready').length

  return (
    <div className="min-h-screen bg-[#F4F6F8]">
      <LucvanHeader
        title="Sistema de Gestión Clínica"
        user={currentUser}
        onLogout={handleLogout}
        onBack={handleBackToAdmin}
        showBack={currentUser?.role === 'admin'}
      />

      {/* Tabs */}
      <div className="bg-white border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('patients')}
              className={`py-3 px-6 font-semibold transition border-b-4 ${
                activeTab === 'patients'
                  ? 'border-[#0066A4] text-[#0066A4]'
                  : 'border-transparent text-gray-500 hover:text-[#003C63] hover:border-gray-300'
              }`}
            >
              Pacientes
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`py-3 px-6 font-semibold transition border-b-4 ${
                activeTab === 'requests'
                  ? 'border-[#0066A4] text-[#0066A4]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Solicitudes
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'patients' && (
          <div>
            <div className="flex gap-4 mb-6">
              <input
                type="text"
                placeholder="Buscar paciente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              />
              <button
                onClick={() => setShowNewPatientModal(true)}
                className="px-5 py-2.5 bg-[#F5C400] text-[#003C63] rounded-full font-bold hover:bg-[#ffd933] transition shadow-[0_12px_24px_-10px_rgba(0,60,99,0.25)] hover:shadow-[0_16px_32px_-12px_rgba(0,60,99,0.3)]"
              >
                + Registrar Paciente
              </button>
            </div>

            <div className="bg-white border rounded-lg">
              {filteredPatients.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No hay pacientes registrados.</div>
              ) : (
                <div>
                  {/* Índice alfabético */}
                  <div className="flex flex-wrap gap-2 p-3 border-b bg-gray-50">
                    {groupedPatients.map(([letter]) => (
                      <a key={letter} href={`#grp-${letter}`} className="px-2 py-1 text-xs font-semibold text-[#003C63] hover:underline">
                        {letter}
                      </a>
                    ))}
                  </div>
                  {/* Grupos de pacientes por letra */}
                  <div className="divide-y">
                    {groupedPatients.map(([letter, items]) => (
                      <div key={letter} id={`grp-${letter}`}>
                        <div className="bg-gray-50 px-4 py-2 text-xs font-bold text-gray-600 sticky top-0">{letter}</div>
                        {items.map((patient) => (
                          <div key={patient.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition">
                            <button
                              onClick={() => navigate(`/patient/${patient.id}`)}
                              className="text-left flex-1"
                              title="Ver detalle del paciente"
                            >
                              <p className="text-base font-semibold text-gray-900">{patient.name}</p>
                            </button>
                            <div className="flex items-center gap-3">
                              {currentUser?.role === 'admin' && (
                                <span className="hidden sm:inline-block px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                  {patient.clinic || 'Sin clínica'}
                                </span>
                              )}
                              <button
                                onClick={() => navigate(`/patient/${patient.id}`)}
                                className="px-3 py-1.5 bg-[#003C63] text-white rounded-md text-xs font-semibold hover:bg-[#005a8f]"
                              >
                                Ver
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="bg-white border rounded-lg p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-3 text-gray-900">Solicitudes</h2>
                <input
                  type="text"
                  placeholder="Buscar por nombre del paciente..."
                  value={requestSearchTerm}
                  onChange={(e) => setRequestSearchTerm(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                />
              </div>
            </div>

            {/* Filtros de Estado */}
            <div className="flex flex-wrap items-center gap-2 mb-6 pb-4 border-b border-gray-200">
              <button
                onClick={() => setRequestStatusFilter('all')}
                className={`px-4 py-2 rounded-full font-medium transition ${
                  requestStatusFilter === 'all'
                    ? 'bg-[#003C63] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todas
                <span className="ml-2 inline-block px-2 py-0.5 text-xs rounded-full bg-white/20 border border-white/30">
                  {countAll}
                </span>
              </button>
              <button
                onClick={() => setRequestStatusFilter('pending')}
                className={`px-4 py-2 rounded-full font-medium transition ${
                  requestStatusFilter === 'pending'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pendientes
                <span className="ml-2 inline-block px-2 py-0.5 text-xs rounded-full bg-white/20 border border-white/30">
                  {countPending}
                </span>
              </button>
              <button
                onClick={() => setRequestStatusFilter('in_production')}
                className={`px-4 py-2 rounded-full font-medium transition ${
                  requestStatusFilter === 'in_production'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                En Producción
                <span className="ml-2 inline-block px-2 py-0.5 text-xs rounded-full bg-white/20 border border-white/30">
                  {countInProd}
                </span>
              </button>
              <button
                onClick={() => setRequestStatusFilter('ready')}
                className={`px-4 py-2 rounded-full font-medium transition ${
                  requestStatusFilter === 'ready'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Listas para Entregar
                <span className="ml-2 inline-block px-2 py-0.5 text-xs rounded-full bg-white/20 border border-white/30">
                  {countReady}
                </span>
              </button>
            </div>

            {requests
              .filter(r => r.status !== 'cancelled' && r.status !== 'delivered')
              .filter(r => requestStatusFilter === 'all' || r.status === requestStatusFilter)
              .filter(req => {
                const patient = patients.find(p => p.id === req.patient_id)
                return (patient?.name || '').toLowerCase().includes(requestSearchTerm.toLowerCase())
              }).length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <p className="text-base font-medium">
                  {requestStatusFilter === 'all' 
                    ? 'No hay solicitudes activas'
                    : `No hay solicitudes ${
                        requestStatusFilter === 'pending' ? 'pendientes' :
                        requestStatusFilter === 'in_production' ? 'en producción' :
                        requestStatusFilter === 'ready' ? 'listas para entregar' :
                        'con este estado'
                      }`}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {requests
                  .filter(r => r.status !== 'cancelled' && r.status !== 'delivered')
                  .filter(r => requestStatusFilter === 'all' || r.status === requestStatusFilter)
                  .filter(req => {
                    const patient = patients.find(p => p.id === req.patient_id)
                    return (patient?.name || '').toLowerCase().includes(requestSearchTerm.toLowerCase())
                  })
                  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                  .map((req) => {
                    const patient = patients.find(p => p.id === req.patient_id)
                    
                    let statusBadge = { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendiente' }
                    if (req.status === 'in_production') {
                      statusBadge = { bg: 'bg-blue-100', text: 'text-blue-800', label: 'En Producción' }
                    } else if (req.status === 'ready') {
                      statusBadge = { bg: 'bg-green-100', text: 'text-green-800', label: 'Lista para Entregar' }
                    } else if (req.status === 'delivered') {
                      statusBadge = { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Entregada' }
                    } else if (req.status === 'cancelled') {
                      statusBadge = { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelada' }
                    }

                    return (
                      <div 
                        key={req.id} 
                        onClick={() => navigate(`/request/${req.id}`)}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-[#0066A4] cursor-pointer transition-all"
                      >
                        <div className="flex items-start justify-between gap-4">
                          {/* Sección izquierda: Información principal */}
                          <div className="flex-1">
                            <h3 className="text-base font-semibold text-gray-900 mb-3">
                              {patient?.name || 'Paciente desconocido'}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-600 mb-2">
                              <div>
                                <span className="text-gray-500 uppercase text-[10px] font-bold">Tipo</span>
                                <p className="font-medium text-gray-900">{req.template_type || req.templateType || '-'}</p>
                              </div>
                              <div>
                                <span className="text-gray-500 uppercase text-[10px] font-bold">Pie</span>
                                <p className="font-medium text-gray-900">{req.foot_side || req.footSide || '-'}</p>
                              </div>
                              <div>
                                <span className="text-gray-500 uppercase text-[10px] font-bold">Fecha</span>
                                <p className="font-medium text-gray-900">{new Date(req.created_at || req.createdAt).toLocaleDateString('es-ES', {day: '2-digit', month: '2-digit', year: 'numeric'})}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => navigate(`/request/${req.id}`)}
                              className="inline-flex items-center px-3 py-1.5 bg-[#003C63] text-white rounded-md text-xs font-semibold hover:bg-[#005a8f]"
                            >
                              Ver detalle
                            </button>
                          </div>

                          {/* Sección derecha: Consecutivo y Status */}
                          <div className="flex flex-col items-end gap-2">
                            <p className="text-xs text-gray-400">#{req.consecutive || req.id}</p>
                            <span className={`inline-block px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap ${statusBadge.bg} ${statusBadge.text}`}>
                              {statusBadge.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal Nuevo Paciente */}
      {showNewPatientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">Registrar Nuevo Paciente</h2>
            <form className="space-y-5" onSubmit={async (e) => {
              e.preventDefault()
              const form = e.currentTarget
              const firstName = form.elements['firstName'].value.trim()
              const lastName1 = form.elements['lastName1'].value.trim()
              const lastName2 = form.elements['lastName2'].value.trim()
              const notes = form.elements['notes'].value.trim() || null
              
              if (!firstName || !lastName1 || !lastName2) return
              
              // Combinar nombre y apellidos
              const fullName = `${firstName} ${lastName1} ${lastName2}`.trim()
              
              try {
                const res = await apiFetch('/api/patients', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    name: fullName,
                    notes
                  })
                })
                const data = await res.json()
                if (!res.ok) throw new Error(data.error || 'Error al guardar paciente')
                setPatients((prev) => [data, ...prev])
                setShowNewPatientModal(false)
              } catch (err) {
                alert(err.message)
              }
            }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre <span className="text-red-600">*</span></label>
                <input
                  name="firstName"
                  type="text"
                  placeholder="Ej: Juan"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primer Apellido <span className="text-red-600">*</span></label>
                <input
                  name="lastName1"
                  type="text"
                  placeholder="Ej: Pérez"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Segundo Apellido <span className="text-red-600">*</span></label>
                <input
                  name="lastName2"
                  type="text"
                  placeholder="Ej: García"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas Clínicas</label>
                <textarea
                  name="notes"
                  rows="3"
                  placeholder="Información médica relevante, alergias, condiciones especiales... (opcional)"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                ></textarea>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-yellow-500 text-blue-950 py-2.5 rounded-md font-medium hover:bg-yellow-600 transition"
                >
                  Guardar Paciente
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewPatientModal(false)}
                  className="flex-1 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-md font-medium hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
