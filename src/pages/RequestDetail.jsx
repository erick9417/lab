import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiFetch } from '../lib/api'
import LucvanHeader from '../components/LucvanHeader'

export default function RequestDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [request, setRequest] = useState(null)
  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelReason, setCancelReason] = useState('')

  const deliveredDateValue = request?.delivered_at || request?.deliveredAt || request?.delivered_date || request?.deliveredDate

  const canStopPolling = request?.status === 'delivered' || request?.status === 'cancelled'

  useEffect(() => {
    const fetchPatient = async (patientId) => {
      try {
        const res = await apiFetch(`/api/patients/${patientId}`)
        if (res.ok) {
          const patientData = await res.json()
          setPatient(patientData)
          return
        }
      } catch (e) {
        // Ignorar error de paciente para no bloquear
      }
      setPatient(null)
    }

    const load = async () => {
      try {
        const res = await apiFetch(`/api/requests/${id}`)
        if (!res.ok) {
          const errorText = await res.text()
          console.error(`Error ${res.status}: ${errorText}`)
          setError(`Error al cargar la solicitud (código ${res.status}). Verifica que el ID sea correcto y que el backend esté activo.`)
          setLoading(false)
          return
        }
        const data = await res.json()
        console.log('Initial request data:', data)
        setRequest(data)
        setLoading(false)

        if (data.patient_id) {
          fetchPatient(data.patient_id)
        }
      } catch (e) {
        console.error('Error cargando solicitud', e)
        setError(`Error de conexión: ${e.message}. Verifica que el backend esté corriendo en http://localhost:4000`)
        setLoading(false)
      }
    }

    load()

    // Polling para actualizar estado cada 3 segundos
    // Pero dejamos de hacer polling si ya está entregado o cancelado
    if (canStopPolling) return

    const poll = setInterval(async () => {
      try {
        const res = await apiFetch(`/api/requests/${id}`)
        if (res.ok) {
          const data = await res.json()
          console.log('Polling data:', data)
          setRequest(data)
        }
      } catch (e) {
        // Silent fail en polling
      }
    }, 3000)

    return () => clearInterval(poll)
  }, [id, canStopPolling])

  const handleCancelRequest = async () => {
    if (!cancelReason.trim()) {
      alert('Por favor proporciona un motivo de cancelación')
      return
    }
    try {
      const res = await apiFetch(`/api/requests/${id}/cancel`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: cancelReason })
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Error al cancelar solicitud')
      }
      await res.json()
      // Redirigir según el rol del usuario
      if (currentUser?.role === 'clinic') {
        navigate('/clinic-dashboard')
      } else if (currentUser?.role === 'workshop' || currentUser?.role === 'production') {
        navigate('/production')
      } else {
        navigate('/admin')
      }
    } catch (e) {
      console.error('Error cancelando solicitud', e)
      alert(`Error: ${e.message}`)
    }
  }

  const handleDuplicateRequest = () => {
    if (!request?.patient_id) return
    // Navegar a nueva solicitud con los mismos datos
    navigate(`/request/new/${request.patient_id}`, {
      state: { duplicateFrom: request }
    })
  }

  const handleWarranty = () => {
    // Placeholder para funcionalidad futura
    alert('Función de garantía en desarrollo')
  }
  // Calcular si la garantía está activa (30 días desde entrega)
  const isWarrantyActive = () => {
    if (!deliveredDateValue) return false
    const deliveredDate = new Date(deliveredDateValue)
    const now = new Date()
    const daysSinceDelivery = Math.floor((now - deliveredDate) / (1000 * 60 * 60 * 24))
    return daysSinceDelivery <= 30
  }

  const specs = request?.specs || {}

  const renderSpec = (name, data) => {
    if (!data) return null
    
    // Casos especiales para elevacionAL con la nueva estructura: izqSelected, izqMm, derSelected, derMm
    if (name === 'elevacionAL' && typeof data === 'object') {
      const hasValues = (data.izqSelected && data.izqMm) || (data.derSelected && data.derMm)
      if (!hasValues) return null
      
      const label = 'Elevación A.L.'
      return (
        <div key={name} className="p-3 bg-gray-50 rounded border border-gray-200">
          <p className="font-medium text-sm text-gray-900 mb-2">{label}</p>
          <div className="text-xs space-y-1">
            {data.izqSelected && data.izqMm && <p className="text-gray-700">Izq: <span className="font-medium">{data.izqMm}mm</span></p>}
            {data.derSelected && data.derMm && <p className="text-gray-700">Der: <span className="font-medium">{data.derMm}mm</span></p>}
          </div>
        </div>
      )
    }
    
    // Detectar tipo de dato
    const isSimpleCheckbox = typeof data === 'object' && 
      (data.izq === true || data.izq === false || data.der === true || data.der === false) &&
      !data.tipo && !data.mm && !data.izq?.mm && !data.der?.mm
    
    // Detectar si es un objeto con valores (números, strings, o sub-objetos como {mm: '12'})
    const hasValues = typeof data === 'object' && (
      (data.izq !== null && data.izq !== undefined && data.izq !== false && data.izq !== '') ||
      (data.der !== null && data.der !== undefined && data.der !== false && data.der !== '')
    )
    
    if (!hasValues && !isSimpleCheckbox) return null
    
    const label = name.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()).trim()
    
    // Simple checkbox (true/false values, no mm or tipo)
    if (isSimpleCheckbox) return (
      <div key={name} className="p-3 bg-gray-50 rounded border border-gray-200">
        <p className="font-medium text-sm text-gray-900 mb-2">{label}</p>
        <div className="flex gap-4 text-xs">
          {data.izq && <span className="text-red-600 font-medium">Izq ✓</span>}
          {data.der && <span className="text-red-600 font-medium">Der ✓</span>}
        </div>
      </div>
    )
    
    // Complex object with values
    if (hasValues) return (
      <div key={name} className="p-3 bg-gray-50 rounded border border-gray-200">
        <p className="font-medium text-sm text-gray-900 mb-2">{label}</p>
        <div className="text-xs space-y-1">
          {(data.izq !== null && data.izq !== undefined && data.izq !== false && data.izq !== '') && (
            <p className="text-gray-700">
              Izq: <span className="font-medium">
                {typeof data.izq === 'object' 
                  ? `${data.izq.tipo || ''} ${data.izq.mm || ''}mm`.trim() 
                  : String(data.izq)}
              </span>
            </p>
          )}
          {(data.der !== null && data.der !== undefined && data.der !== false && data.der !== '') && (
            <p className="text-gray-700">
              Der: <span className="font-medium">
                {typeof data.der === 'object' 
                  ? `${data.der.tipo || ''} ${data.der.mm || ''}mm`.trim() 
                  : String(data.der)}
              </span>
            </p>
          )}
        </div>
      </div>
    )
    
    return null
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center"><div>Cargando...</div></div>
  )
  if (error || !request) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-lg text-center">
        <h2 className="text-xl font-bold text-red-600 mb-2">No se encontró la solicitud</h2>
        {error && <p className="text-gray-700 mb-4">{error}</p>}
        <p className="text-gray-600 text-sm mb-4">ID de solicitud: {id}</p>
        <button 
          onClick={() => navigate(-1)} 
          className="bg-[#003C63] text-white px-4 py-2 rounded hover:bg-[#0066A4]"
        >
          ← Volver
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F4F6F8]">
      <LucvanHeader currentUser={currentUser} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => navigate(`/patient/${request.patient_id}`)} className="text-[#003C63] hover:text-[#0066A4] mb-6">← Volver al paciente</button>
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {/* Header con nombre del paciente y consecutivo */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 pb-6 border-b">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#003C63] mb-1">{patient?.name || request.patient_name || `Paciente #${request.patient_id}`}</h1>
              <p className="text-base text-gray-700 font-medium mb-2">{request.template_type || request.templateType || 'Solicitud'}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                <span className="font-semibold text-orange-600">Fecha de solicitud: <span className="font-normal text-gray-800">{new Date(request.created_at || request.createdAt).toLocaleDateString('es-ES', {day: '2-digit', month: '2-digit', year: 'numeric'})}</span></span>
              </div>
            </div>
            
            {/* Botones de acción */}
            <div className="flex flex-col items-end gap-3">
              <p className="text-xs text-gray-400">#{request.consecutive || request.id}</p>
              <div className="flex flex-wrap gap-2 justify-end">
              <button
                onClick={handleDuplicateRequest}
                className="px-4 py-2 bg-yellow-400 text-[#003C63] rounded-md hover:bg-yellow-500 font-semibold transition-colors text-sm shadow-sm"
              >
                Duplicar
              </button>
              {request.status === 'delivered' && (
                <button
                  onClick={handleWarranty}
                  disabled={!isWarrantyActive()}
                  className={`px-4 py-2 rounded-md font-medium transition-colors text-sm ${
                    isWarrantyActive()
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  title={isWarrantyActive() ? 'Garantía activa' : 'Garantía vencida (30 días)'}
                >
                  Garantía
                </button>
              )}
              {(currentUser?.role === 'admin' || (currentUser?.role === 'clinic' && request.status === 'pending')) && request.status !== 'cancelled' && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 font-medium transition-colors text-sm"
                >
                  {currentUser?.role === 'clinic' ? 'Solicitar Cancelación' : 'Cancelar Solicitud'}
                </button>
              )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-b pb-6 mb-6">
            <div>
              <p className="text-sm text-gray-600">Doctor</p>
              <p className="font-medium text-gray-900">{request.doctor_name || request.doctorName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Pie</p>
              <p className="font-medium text-gray-900">{request.foot_side || request.footSide}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Talla</p>
              <p className="font-medium text-gray-900">{request.shoe_size || request.shoeSize}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Estado</p>
              <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold ${
                request.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                request.status === 'delivered' ? 'bg-green-100 text-green-800' :
                request.status === 'ready' ? 'bg-purple-100 text-purple-800' :
                request.status === 'in_production' || request.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {request.status === 'cancelled' ? 'Cancelada' : 
                 request.status === 'delivered' ? 'Entregada' : 
                 request.status === 'ready' ? 'Lista para Entregar' :
                 request.status === 'in_production' || request.status === 'in_progress' ? 'En Producción' : 'Pendiente'}
              </span>
              {request.status === 'delivered' && (
                <p className="text-sm text-gray-700 mt-2">
                  Fecha de entrega: <span className="font-semibold text-gray-900">{deliveredDateValue ? new Date(deliveredDateValue).toLocaleDateString('es-ES', {day: '2-digit', month: '2-digit', year: 'numeric'}) : 'No registrada'}</span>
                </p>
              )}
            </div>
          </div>

          {request.status === 'cancelled' && request.cancel_reason && (
            <div className="border-l-4 border-red-500 bg-red-50 p-4 mb-6">
              <h3 className="text-sm font-semibold text-red-900 mb-1">Motivo de Cancelación</h3>
              <p className="text-sm text-red-800">{request.cancel_reason}</p>
            </div>
          )}

          {request.observations && (
            <div className="border-b pb-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Observaciones</h2>
              <p className="text-gray-700">{request.observations}</p>
            </div>
          )}

          {Object.entries(specs).filter(([k, v]) => {
            // Solo mostrar specs que realmente tengan datos
            if (!v || typeof v !== 'object') return false
            
            // Caso especial para elevacionAL con nueva estructura
            if (k === 'elevacionAL') {
              return (v.izqSelected && v.izqMm) || (v.derSelected && v.derMm)
            }
            
            // Helper para verificar si un valor tiene contenido real
            const hasRealValue = (val) => {
              if (val === null || val === undefined || val === false || val === '') return false
              if (typeof val === 'object') {
                // Si es objeto, verificar que tenga al menos un campo con valor
                return Object.values(val).some(v => v !== null && v !== undefined && v !== '' && v !== false)
              }
              return true
            }
            
            // Casos generales - verificar que izq o der tengan valores reales
            return hasRealValue(v.izq) || hasRealValue(v.der)
          }).length > 0 && (
            <div className="border-b pb-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Especificaciones de Cuñas y Alzas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(specs).filter(([k, v]) => {
                  // Aplicar el mismo filtro para renderizar solo specs con datos
                  if (!v || typeof v !== 'object') return false
                  
                  // Caso especial para elevacionAL
                  if (k === 'elevacionAL') {
                    return (v.izqSelected && v.izqMm) || (v.derSelected && v.derMm)
                  }
                  
                  // Helper para verificar valores reales
                  const hasRealValue = (val) => {
                    if (val === null || val === undefined || val === false || val === '') return false
                    if (typeof val === 'object') {
                      return Object.values(val).some(v => v !== null && v !== undefined && v !== '' && v !== false)
                    }
                    return true
                  }
                  
                  // Casos generales
                  return hasRealValue(v.izq) || hasRealValue(v.der)
                }).map(([k, v]) => renderSpec(k, v))}
              </div>
            </div>
          )}

          {(Array.isArray(request.files) ? request.files.length > 0 : JSON.parse(request.files || '[]').length > 0) && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">📎 Adjuntos ({Array.isArray(request.files) ? request.files.length : JSON.parse(request.files || '[]').length})</h2>
              <div className="space-y-2">
                {(Array.isArray(request.files) ? request.files : JSON.parse(request.files || '[]')).map((file, idx) => {
                  const name = typeof file === 'string' ? file : (file.name || 'Archivo')
                  let url = typeof file === 'object' ? (file.url || file.path || '') : ''
                  
                  // Mejorar URL si es relativa
                  if (url && !url.startsWith('http')) {
                    // Si es relativa, asegurar que tenga /api/uploads
                    if (!url.startsWith('/api/uploads')) {
                      url = `/api/uploads/${request.id}/${url}`
                    }
                  }
                  
                  const handleDownload = () => {
                    if (url) {
                      const link = document.createElement('a')
                      link.href = url
                      link.download = name || 'archivo'
                      document.body.appendChild(link)
                      link.click()
                      document.body.removeChild(link)
                    }
                  }
                  
                  return (
                    <div key={idx} className="flex items-center justify-between gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded border border-gray-200">
                      <div className="flex items-center gap-3 min-w-0">
                        <svg className="w-5 h-5 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
                          {url && <p className="text-xs text-gray-500 truncate">{url}</p>}
                        </div>
                      </div>
                      <button
                        onClick={handleDownload}
                        disabled={!url}
                        className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap flex-shrink-0 transition ${
                          url
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {url ? '⬇️ Descargar' : '⚠️ Sin URL'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal de Cancelación */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4 text-[#003C63]">⚠️ Cancelar y Eliminar Solicitud</h2>
            
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 font-semibold mb-2">¡ADVERTENCIA!</p>
              <p className="text-red-700 text-sm mb-2">
                Esta acción es <strong>irreversible</strong> y eliminará permanentemente:
              </p>
              <ul className="text-red-700 text-sm list-disc list-inside space-y-1">
                <li>La solicitud completa del sistema</li>
                <li>Todos los archivos adjuntos</li>
                <li>Toda la información asociada</li>
              </ul>
            </div>

            <p className="text-gray-600 mb-3 text-sm font-medium">
              Por favor proporciona el motivo de cancelación:
            </p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Ejemplo: Error en los datos del paciente, solicitud duplicada, ya no se requiere el servicio..."
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 mb-4"
              rows="4"
            />
            <div className="flex gap-3">
              <button
                onClick={handleCancelRequest}
                disabled={!cancelReason.trim()}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-md font-medium hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Sí, Eliminar Solicitud
              </button>
              <button
                onClick={() => {
                  setShowCancelModal(false)
                  setCancelReason('')
                }}
                className="flex-1 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-md font-medium hover:bg-gray-50 transition"
              >
                No, Mantener
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
