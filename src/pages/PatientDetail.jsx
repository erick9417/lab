import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiFetch } from '../lib/api'
import LucvanHeader from '../components/LucvanHeader'
import { formatDateToDisplay, formatDateToISO, isValidDateFormat, formatDateLong } from '../lib/dateUtils'

export default function PatientDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()

  const [patient, setPatient] = useState(null)
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEditingPatient, setIsEditingPatient] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [viewingRequest, setViewingRequest] = useState(null)
  const [searchDate, setSearchDate] = useState('')
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    email: '',
    birthDate: '',
    notes: ''
  })

  // Formatea input de fecha con barras automáticas
  const formatDateInputValue = (value) => {
    const digits = (value || '').replace(/[^0-9]/g, '').slice(0, 8)
    if (digits.length <= 2) return digits
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
  }

  const parseSpecs = (specsStr) => {
    try {
      return typeof specsStr === 'string' ? JSON.parse(specsStr) : specsStr
    } catch {
      return {}
    }
  }

  // Cargar paciente y solicitudes
  useEffect(() => {
    const load = async () => {
      try {
        const resPatients = await apiFetch('/api/patients')
        if (resPatients.ok) {
          const patients = await resPatients.json()
          const p = patients.find((x) => x.id === parseInt(id))
          setPatient(p || null)
        }

        // Cargar solicitudes del paciente (si existe endpoint)
        try {
          const resRequests = await apiFetch(`/api/requests?patientId=${id}`)
          if (resRequests.ok) {
            const reqs = await resRequests.json()
            setRequests(Array.isArray(reqs) ? reqs : [])
          }
        } catch (err) {
          console.error('Error loading requests:', err)
          setRequests([])
        }
      } catch (err) {
        console.error('Error loading patient', err)
      } finally {
        setLoading(false)
      }
    }
    load()

    // Polling: refrescar solicitudes cada 3 segundos para actualizar estados en tiempo real
    const pollInterval = setInterval(async () => {
      try {
        const resRequests = await apiFetch(`/api/requests?patientId=${id}`)
        if (resRequests.ok) {
          const reqs = await resRequests.json()
          setRequests(Array.isArray(reqs) ? reqs : [])
        }
      } catch (err) {
        console.error('Error refreshing requests:', err)
      }
    }, 3000)

    return () => clearInterval(pollInterval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, currentUser?.token])

  const calculateAge = (birthDate) => {
    if (!birthDate) return '-'
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age + ' años'
  }

  const handleEditPatient = () => {
    if (!patient) return
    
    // Separar el nombre completo en partes
    const nameParts = (patient.name || '').trim().split(/\s+/)
    const firstName = nameParts[0] || ''
    const lastName1 = nameParts[1] || ''
    const lastName2 = nameParts.slice(2).join(' ') || ''
    
    setEditForm({
      firstName,
      lastName1,
      lastName2,
      phone: patient.phone,
      email: patient.email || '',
      birthDate: patient.birthDate || '',
      notes: patient.notes || ''
    })
    setIsEditingPatient(true)
  }

  const handleSavePatient = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const firstName = form.elements['firstName'].value.trim()
    const lastName1 = form.elements['lastName1'].value.trim()
    const lastName2 = form.elements['lastName2'].value.trim()
    const notes = form.elements['notes'].value.trim() || null

    if (!firstName || !lastName1 || !lastName2) {
      alert('Nombre y ambos apellidos son requeridos')
      return
    }

    // Combinar nombre completo
    const fullName = `${firstName} ${lastName1} ${lastName2}`.trim()

    try {
      const res = await apiFetch(`/api/patients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: fullName, notes })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al actualizar')
      setPatient(data)
      setIsEditingPatient(false)
      alert('Paciente actualizado exitosamente')
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDeletePatient = async () => {
    if (deleteConfirmText !== 'eliminar usuario') {
      alert('Debes escribir "eliminar usuario" para confirmar')
      return
    }

    try {
      const res = await apiFetch(`/api/patients/${id}`, {
        method: 'DELETE'
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al eliminar')
      }
      alert('Paciente eliminado exitosamente')
      navigate('/clinic')
    } catch (err) {
      alert(err.message)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F6F8]">
        <LucvanHeader title="Perfil del Paciente" user={currentUser} onLogout={handleLogout} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center">
          <p>Cargando paciente...</p>
        </main>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-[#F4F6F8]">
        <LucvanHeader title="Perfil del Paciente" user={currentUser} onLogout={handleLogout} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Paciente no encontrado</p>
            <button
              onClick={() => navigate('/clinic')}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Volver a Pacientes
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F4F6F8]">
      <LucvanHeader title="Perfil del Paciente" user={currentUser} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Botón Volver */}
        {(currentUser?.role === 'clinic' || currentUser?.role === 'admin') && (
          <button
            onClick={() => navigate('/clinic')}
            className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 inline-flex items-center gap-2"
          >
            ← Volver a Pacientes
          </button>
        )}
        {/* Tarjeta de Perfil */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
          {/* Contenido del Perfil */}
          <div className="px-6 sm:px-8 py-6 relative">
            {!isEditingPatient ? (
              <>
                <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-[#003C63] rounded-lg flex items-center justify-center text-2xl font-semibold text-white border border-gray-300 shadow-sm">
                      {patient.name.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  {/* Información básica */}
                  <div className="flex-1">
                    <h1 className="text-3xl font-semibold text-[#003C63]">{patient.name}</h1>
                    {patient.email && (
                      <p className="text-gray-600 text-sm mt-1">{patient.email}</p>
                    )}
                  </div>

                  {/* Botones de Acción */}
                  <div className="flex gap-2 self-start sm:self-center mt-4 sm:mt-0">
                    <button
                      onClick={handleEditPatient}
                      className="px-4 py-2 bg-[#0066A4] text-white rounded-md hover:bg-[#003C63] font-medium transition-colors text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => navigate(`/request/new/${patient.id}`)}
                      className="px-4 py-2 bg-[#003C63] text-white rounded-md hover:bg-[#0066A4] font-medium transition-colors text-sm"
                    >
                      Nueva Solicitud
                    </button>
                  </div>
                </div>

                {/* Tarjetas de información */}
                <div className="space-y-4 mt-8 pt-8 border-t border-gray-200">
                  {/* Información del paciente */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-[#F8F9FA] p-4 rounded-md border border-gray-200">
                      <span className="text-[#003C63] text-xs font-semibold uppercase tracking-wide">Solicitudes</span>
                      <p className="font-semibold text-[#0066A4] mt-2 text-lg">{requests.length}</p>
                    </div>
                    {patient.email && (
                      <div className="bg-[#F8F9FA] p-4 rounded-md border border-gray-200">
                        <span className="text-[#003C63] text-xs font-semibold uppercase tracking-wide">Correo</span>
                        <p className="font-medium text-gray-900 mt-2 break-all text-sm">{patient.email}</p>
                      </div>
                    )}
                  </div>

                  {/* Notas */}
                  {patient.notes && (
                    <div className="bg-[#FFFBF0] p-4 rounded-md border border-gray-200">
                      <span className="text-[#003C63] text-xs font-semibold uppercase tracking-wide">Notas</span>
                      <p className="text-gray-700 text-sm mt-3 leading-relaxed">{patient.notes}</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <form onSubmit={handleSavePatient} className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Editar Paciente</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre <span className="text-red-600">*</span></label>
                  <input
                    name="firstName"
                    type="text"
                    defaultValue={editForm.firstName}
                    placeholder="Ej: Juan"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066A4]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primer Apellido <span className="text-red-600">*</span></label>
                  <input
                    name="lastName1"
                    type="text"
                    defaultValue={editForm.lastName1}
                    placeholder="Ej: Pérez"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066A4]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Segundo Apellido <span className="text-red-600">*</span></label>
                  <input
                    name="lastName2"
                    type="text"
                    defaultValue={editForm.lastName2}
                    placeholder="Ej: García"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066A4]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notas Clínicas</label>
                  <textarea
                    name="notes"
                    rows="4"
                    defaultValue={patient.notes || ''}
                    placeholder="Información médica relevante, alergias, condiciones especiales... (opcional)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066A4]"
                  ></textarea>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#0066A4] text-white rounded-lg font-medium hover:bg-[#003C63]"
                  >
                    Guardar Cambios
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingPatient(false)}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 ml-auto"
                  >
                    🗑️ Eliminar Paciente
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Historial de Solicitudes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-2xl font-semibold text-[#003C63]">
                Historial de Solicitudes
              </h2>
              <div className="flex gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Buscar por fecha (ej: febrero, 2026)..."
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="flex-1 sm:flex-none sm:w-64 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0066A4] focus:border-transparent"
                />
                <button
                  onClick={async () => {
                    try {
                      const resRequests = await apiFetch(`/api/requests?patientId=${id}`)
                      if (resRequests.ok) {
                        const reqs = await resRequests.json()
                        setRequests(Array.isArray(reqs) ? reqs : [])
                      }
                    } catch (err) {
                      console.error('Error refreshing requests:', err)
                    }
                  }}
                  className="px-3 py-1.5 text-sm font-medium text-[#0066A4] hover:text-[#003C63] hover:bg-[#F0F5FA] rounded transition-all whitespace-nowrap"
                  title="Refrescar estado de las solicitudes"
                >
                  ↻ Refrescar
                </button>
              </div>
            </div>
            
            {requests.filter(req => {
              if (!searchDate.trim()) return true
              const dateStr = new Date(req.createdAt || req.created_at).toLocaleDateString('es-ES', {year: 'numeric', month: 'long', day: 'numeric'})
              return dateStr.toLowerCase().includes(searchDate.toLowerCase())
            }).length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-base font-medium">{searchDate ? 'No se encontraron solicitudes' : 'No hay solicitudes registradas'}</p>
                <p className="text-sm mt-2">{searchDate ? 'Intenta con otro término de búsqueda' : 'Crea una nueva solicitud usando el botón "Nueva Solicitud"'}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.filter(req => {
                  if (!searchDate.trim()) return true
                  const dateStr = new Date(req.createdAt || req.created_at).toLocaleDateString('es-ES', {year: 'numeric', month: 'long', day: 'numeric'})
                  return dateStr.toLowerCase().includes(searchDate.toLowerCase())
                }).map((req) => (
                  <div key={req.id} className="border border-gray-200 rounded-md p-3 hover:bg-[#F8F9FA] cursor-pointer transition-all hover:border-[#0066A4] hover:shadow-sm">
                    <div className="flex justify-between items-start gap-2" onClick={() => navigate(`/request/${req.id}`)}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-[#003C63] text-white text-xs font-semibold px-2.5 py-1 rounded whitespace-nowrap">
                            {new Date(req.createdAt || req.created_at).toLocaleDateString('es-ES', {day: '2-digit', month: '2-digit', year: '2-digit'})}
                          </span>
                          <h3 className="font-semibold text-gray-900 text-sm truncate">{req.templateType || req.template_type || 'Solicitud'}</h3>
                        </div>
                        <div className="text-xs text-gray-600 flex flex-wrap gap-2 mb-1">
                          {(req.doctor_name || req.doctorName) && <span>Dr. {(req.doctor_name || req.doctorName)}</span>}
                          { (req.foot_side || req.footSide) && <span>Pie: {(req.foot_side || req.footSide)}</span> }
                          { (req.shoe_size || req.shoeSize) && <span>Talla: {(req.shoe_size || req.shoeSize)}</span> }
                        </div>
                        {(req.observations && req.observations !== 'Sin notas') && (
                          <p className="text-xs text-gray-500 line-clamp-1">{req.observations}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            req.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : req.status === 'delivered'
                              ? 'bg-green-100 text-green-800'
                              : req.status === 'ready'
                              ? 'bg-purple-100 text-purple-800'
                              : req.status === 'in_production' || req.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {req.status === 'cancelled' ? 'Cancelada' : 
                           req.status === 'delivered' ? 'Entregada' : 
                           req.status === 'ready' ? 'Lista' :
                           req.status === 'in_production' || req.status === 'in_progress' ? 'Producción' : 'Pendiente'}
                        </span>
                        <button className="text-xs text-[#0066A4] hover:text-[#003C63]" onClick={(e) => { e.stopPropagation(); navigate(`/request/${req.id}`) }}>Detalles →</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Eliminar Paciente</h2>
            <p className="text-gray-600 mb-6">
              Esta acción es irreversible. Escribe <strong>"eliminar usuario"</strong> para confirmar.
            </p>
            <input
              type="text"
              placeholder='Escribe "eliminar usuario"'
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="w-full px-4 py-2 border-2 border-red-300 rounded-lg mb-6 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
            <div className="flex gap-3">
              <button
                onClick={handleDeletePatient}
                disabled={deleteConfirmText !== 'eliminar usuario'}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Eliminar
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setDeleteConfirmText('')
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Se retira el modal de detalles; navegación a página dedicada */}
    </div>
  )
}
