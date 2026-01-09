import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiFetch } from '../lib/api'
import LucvanHeader from '../components/LucvanHeader'

export default function WorkshopTicketDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [ticket, setTicket] = useState(null)
  const [workshopNotes, setWorkshopNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [newStatus, setNewStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadTicketData()
  }, [id])

  async function loadTicketData() {
    try {
      setLoading(true)
      
      // Cargar datos del ticket
      const ticketRes = await apiFetch(`/api/requests/${id}`)
      if (!ticketRes.ok) throw new Error('Error cargando ticket')
      const ticketData = await ticketRes.json()
      setTicket(ticketData)
      setNewStatus(ticketData.status || 'pending')
      
      // Cargar notas del taller
      const notesRes = await apiFetch(`/api/requests/${id}/workshop-notes`)
      if (notesRes.ok) {
        const notesData = await notesRes.json()
        setWorkshopNotes(Array.isArray(notesData) ? notesData : [])
      }
    } catch (err) {
      setError('Error cargando el ticket')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddNote() {
    if (!newNote.trim()) return
    
    try {
      const res = await apiFetch(`/api/requests/${id}/workshop-notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: newNote })
      })
      
      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`Error ${res.status}: ${errorText}`)
      }

      const result = await res.json()
      setNewNote('')
      await loadTicketData()
      console.log('Nota agregada exitosamente:', result)
    } catch (err) {
      console.error('Error agregando nota:', err)
      alert(`Error al agregar nota: ${err.message}`)
    }
  }

  const handleDownloadFile = (file) => {
    // Construir URL de forma robusta para evitar redirecciones al home
    const maybeUrl = file?.url || file?.path || ''
    const fileName = file?.filename || file?.name || ''

    let downloadPath = ''
    if (maybeUrl.startsWith('http')) {
      // URL absoluta válida
      downloadPath = maybeUrl
    } else if (maybeUrl.startsWith('/api/uploads/')) {
      // Ya es ruta API relativa correcta
      downloadPath = maybeUrl
    } else if (maybeUrl.startsWith('/uploads/')) {
      // Ruta estática; mantenerla como está
      downloadPath = maybeUrl
    } else {
      // Solo tenemos un nombre de archivo: en server-pro los archivos están en /uploads/<filename>
      const last = (maybeUrl.split('/').pop() || fileName || '').trim()
      if (!last) {
        alert('⚠️ El archivo no tiene URL disponible. Puede ser un nombre de archivo sin referencia.')
        return
      }
      const safeName = encodeURIComponent(last)
      downloadPath = `/uploads/${safeName}`
    }

    // Prepend base si es relativo
    let downloadUrl = downloadPath
    if (!downloadUrl.startsWith('http')) {
      const base = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '')
      if (base) {
        downloadUrl = `${base}${downloadUrl}`
      }
    }

    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = file?.name || 'archivo'
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  async function handleStatusChange() {
    try {
      const statusMap = {
        'pending': 'pending',
        'in_production': 'in_production',
        'En Producción': 'in_production',
        'ready': 'ready',
        'Lista para Entregar': 'ready',
        'delivered': 'delivered',
        'Entregado': 'delivered'
      }

      const res = await apiFetch(`/api/requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: statusMap[newStatus] || newStatus })
      })
      
      if (res.ok) {
        await loadTicketData()
        alert('Estado actualizado')
      }
    } catch (err) {
      alert('Error actualizando estado')
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LucvanHeader />
        <div className="flex justify-center items-center h-96">
          <p className="text-gray-500">Cargando ticket...</p>
        </div>
      </div>
    )
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LucvanHeader />
        <div className="flex justify-center items-center h-96">
          <p className="text-red-500">{error || 'Ticket no encontrado'}</p>
        </div>
      </div>
    )
  }

  // Configuración para normalizar especificaciones y mostrar la referencia visual sin clicks
  const specConfig = [
    {
      keys: ['arcoTransverso', 'ArcoTransverso'],
      label: 'Arco Transverso (AT)',
      image: '/images/cunas/arco-transverso.webp'
    },
    {
      keys: ['barraMetatarsal', 'BarraMetatarsal'],
      label: 'Barra Metatarsal',
      image: '/images/cunas/barra-metatarsal.webp'
    },
    {
      keys: ['cunaCalcaneaInterna', 'CunaCalcaneaInterna'],
      label: 'Cuña Calcánea Interna',
      image: '/images/cunas/cuna-calcanea-interna.webp'
    },
    {
      keys: ['cunaCalcaneaExtrema', 'CunaCalcaneaExtrema'],
      label: 'Cuña Calcánea Externa',
      image: '/images/cunas/cuna-calcanea-extrema.webp'
    },
    {
      keys: ['cunaCalcaneaLarga', 'CunaCalcaneaLarga'],
      label: 'Cuña Calcánea Larga',
      image: '/images/cunas/cuna-calcanea-larga.webp'
    },
    {
      keys: ['elevacionAL', 'Elevacional', 'ElevacionAL'],
      label: 'Elevación AL',
      image: '/images/cunas/elevacion-al.webp'
    },
    {
      keys: ['alza', 'Alza'],
      label: 'Alza',
      image: '/images/cunas/Alza.webp'
    }
  ]

  const getSpecValue = (specs, keys) => {
    for (const k of keys) {
      if (specs && Object.prototype.hasOwnProperty.call(specs, k)) {
        return specs[k]
      }
    }
    return null
  }

  const isSpecActive = (value) => {
    if (!value && value !== 0) return false
    if (typeof value === 'boolean') return value
    if (typeof value === 'string') return value.trim() !== '' && value !== 'false'
    if (typeof value === 'number') return true
    if (typeof value === 'object') {
      return Object.values(value).some((v) => {
        if (!v && v !== 0) return false
        if (typeof v === 'boolean') return v
        if (typeof v === 'string') return v.trim() !== '' && v !== 'false'
        if (typeof v === 'number') return true
        if (typeof v === 'object') {
          return Object.values(v).some((inner) => inner && inner !== 'false')
        }
        return false
      })
    }
    return false
  }

  const renderFootSide = () => {
    if (!ticket.foot_side) return '-'
    const value = ticket.foot_side.toLowerCase()
    if (value.includes('izq')) return 'Izquierdo'
    if (value.includes('der')) return 'Derecho'
    if (value.includes('amb')) return 'Ambos'
    return ticket.foot_side
  }

  const renderSpecDetails = (value) => {
    if (!value) return null

    if (typeof value === 'boolean') {
      return value ? null : null
    }

    if (typeof value === 'string' || typeof value === 'number') {
      const val = String(value).toLowerCase()
      if (val === 'true' || val === 'false') return null
      return <span className="text-sm text-gray-800">{String(value)}</span>
    }

    // Handle new elevacionAL structure FIRST: {izqSelected: bool, izqMm: string, derSelected: bool, derMm: string}
    if (typeof value === 'object' && (value.izqSelected !== undefined || value.derSelected !== undefined)) {
      return (
        <div className="flex flex-col gap-1 text-sm text-gray-800">
          {value.izqSelected && value.izqMm && (
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-bold">Izq</span>
              <span>{value.izqMm}mm</span>
            </div>
          )}
          {value.derSelected && value.derMm && (
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 text-xs font-bold">Der</span>
              <span>{value.derMm}mm</span>
            </div>
          )}
        </div>
      )
    }

    if (typeof value === 'object') {
      const left = value.izq || value.left
      const right = value.der || value.right
      return (
        <div className="flex flex-col gap-1 text-sm text-gray-800">
          {left && (
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-bold">Izq</span>
              <span>{typeof left === 'object' ? `${left.tipo || ''} ${left.mm || ''}mm`.trim() : (String(left).toLowerCase() === 'true' ? '' : String(left))}</span>
            </div>
          )}
          {right && (
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 text-xs font-bold">Der</span>
              <span>{typeof right === 'object' ? `${right.tipo || ''} ${right.mm || ''}mm`.trim() : (String(right).toLowerCase() === 'true' ? '' : String(right))}</span>
            </div>
          )}
        </div>
      )
    }

    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <LucvanHeader />
      
      <div className="p-6">
        {/* Header con botón de regresar */}
        <div className="mb-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[#003C63] hover:text-[#005a8f] font-semibold text-lg"
          >
            ← Regresar al Dashboard
          </button>
        </div>

        {/* Modal */}
        <div className="bg-white rounded-xl max-w-7xl mx-auto overflow-hidden shadow-lg">
          {/* Header con ID y Estado */}
          <div className="sticky top-0 bg-gradient-to-r from-[#003C63] to-[#0066A4] text-white px-6 py-2 flex justify-between items-center z-10">
            <div className="flex items-center gap-2">
              <span className="bg-[#F5C400] text-[#003C63] text-sm font-bold px-2 py-0.5 rounded">#{ticket.consecutive_number || ticket.id}</span>
              <h2 className="text-lg font-bold">Detalles del Ticket</h2>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="px-2 py-1 border-2 border-[#F5C400] rounded text-[#003C63] font-semibold text-sm focus:ring-2 focus:ring-[#F5C400] focus:border-[#F5C400]"
              >
                <option value="pending">Pendiente</option>
                <option value="in_production">En Producción</option>
                <option value="ready">Lista para Entregar</option>
                <option value="delivered">Entregado</option>
              </select>
              <button
                onClick={handleStatusChange}
                className="bg-[#F5C400] text-[#003C63] px-3 py-1 rounded font-bold hover:bg-yellow-500 transition text-sm"
              >
                Guardar
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Información Básica - Más amplia */}
            <div className="bg-[#F4F6F8] rounded-lg p-4 space-y-3">
              <h3 className="font-bold text-[#003C63] text-base mb-3">Información de la Solicitud</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Paciente</p>
                  <p className="font-semibold text-gray-900">{ticket.patient_name || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Clínica</p>
                  <p className="font-semibold text-gray-900">{ticket.clinic || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Doctor</p>
                  <p className="font-semibold text-gray-900">{ticket.doctor_name || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Fecha Solicitud</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(ticket.created_at).toLocaleDateString('es-ES')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Tipo de Plantilla</p>
                  <p className="font-semibold text-gray-900">{ticket.template_type || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Pie a Trabajar</p>
                  <p className="font-semibold text-gray-900">{renderFootSide()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Talla de Calzado</p>
                  <p className="font-semibold text-gray-900">{ticket.shoe_size || '-'}</p>
                </div>
              </div>
            </div>

            {/* Comentarios de la Clínica */}
            {ticket.comments && (
              <div className="bg-amber-50 rounded-lg p-4 border-l-4 border-amber-400">
                <h3 className="font-bold text-amber-900 mb-2 text-sm">📝 Comentarios de la Clínica</h3>
                <p className="text-gray-700 text-sm bg-white p-3 rounded">{ticket.comments}</p>
              </div>
            )}

            {/* Observaciones del doctor */}
            {ticket.observations && (
              <div className="bg-gray-100 rounded-lg p-4 border-l-4 border-gray-400">
                <h3 className="font-bold text-gray-800 mb-2 text-sm">Observaciones del Doctor</h3>
                <p className="text-gray-800 text-sm bg-white p-3 rounded">{ticket.observations}</p>
              </div>
            )}

            {/* Archivos adjuntos */}
            {Array.isArray(ticket.files) && ticket.files.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-bold text-[#003C63] text-sm mb-2">Archivos adjuntos</h3>
                <div className="space-y-2">
                  {ticket.files.map((file, idx) => (
                    <button
                      key={file.url || idx}
                      onClick={() => handleDownloadFile(file)}
                      className="w-full text-left flex items-center gap-2 text-sm text-blue-700 hover:text-blue-900 hover:bg-blue-50 p-2 rounded transition"
                      title={file.url ? 'Click para descargar' : 'URL no disponible'}
                    >
                      📎 {file.name || `Archivo ${idx + 1}`}
                      {file.size ? <span className="text-xs text-gray-500">({Math.round(file.size / 1024)} KB)</span> : null}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Especificaciones + referencias visuales (sin clicks) */}
            {ticket.specs && Object.keys(ticket.specs).length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-bold text-[#003C63] text-base mb-3">Especificaciones solicitadas (con referencia visual)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(() => {
                    const cards = specConfig.map((spec) => {
                      const value = getSpecValue(ticket.specs, spec.keys)
                      if (!isSpecActive(value)) return null
                      return (
                        <div key={spec.label} className="bg-white p-3 rounded border-2 border-blue-200 flex flex-col gap-2">
                          <div className="flex items-center gap-3">
                            <img
                              src={spec.image}
                              alt={spec.label}
                              className="w-16 h-16 object-contain rounded border border-gray-200"
                              onError={(e) => { e.target.style.display = 'none' }}
                            />
                            <div>
                              <p className="text-xs text-blue-600 font-bold uppercase">{spec.label}</p>
                              <p className="text-[11px] text-gray-500">Vista de referencia</p>
                            </div>
                          </div>
                          {renderSpecDetails(value) && (
                            <div className="pl-1">
                              {renderSpecDetails(value)}
                            </div>
                          )}
                        </div>
                      )
                    }).filter(Boolean)

                    if (!cards.length) {
                      return <p className="text-sm text-gray-500">Sin especificaciones solicitadas.</p>
                    }

                    return cards
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notas - Estilo Facebook */}
        <div className="max-w-7xl mx-auto mt-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-bold text-[#003C63] text-lg mb-4">💬 Notas Internas del Taller</h3>

            {/* Input para nueva nota */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Escribe una nota interna sobre el progreso del trabajo..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#003C63] focus:border-transparent resize-none"
                rows="3"
              />
              <button
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                className="mt-2 bg-[#003C63] text-white px-4 py-2 rounded hover:bg-[#005a8f] disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold text-sm transition"
              >
                💬 Publicar Nota
              </button>
            </div>

            {/* Lista de notas - Estilo Facebook */}
            <div className="space-y-4">
              {workshopNotes.length === 0 ? (
                <div className="text-gray-400 text-center py-12">
                  <p className="text-lg">💭</p>
                  <p>Sin notas aún. Sé el primero en comentar.</p>
                </div>
              ) : (
                workshopNotes.map((note, index) => (
                  <div key={note.id || index} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 bg-[#003C63] text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {note.user_name?.charAt(0).toUpperCase() || '👤'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="bg-gray-100 rounded-lg p-3">
                          <p className="font-semibold text-sm text-gray-900">{note.user_name || 'Anónimo'}</p>
                          <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap break-words">{note.comment}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(note.created_at).toLocaleDateString('es-ES', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
