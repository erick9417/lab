import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';
import LucvanHeader from '../components/LucvanHeader';

export default function ProductionDashboard() {
  const [activeTab, setActiveTab] = useState('pending')
  const [statusFilter, setStatusFilter] = useState(null) // null = mostrar todos
  const [sortByDate, setSortByDate] = useState('newest') // 'newest' o 'oldest'
  const [searchTerm, setSearchTerm] = useState('')
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const [requests, setRequests] = useState([])
  const [patients, setPatients] = useState([])
  const [clinics, setClinics] = useState([])
  const [loading, setLoading] = useState(true)

  // Cargar datos
  useEffect(() => {
    const load = async () => {
      try {
        // Cargar solicitudes
        const resRequests = await apiFetch('/api/requests')
        if (resRequests.ok) {
          const reqData = await resRequests.json()
          setRequests(reqData || [])
        }

        // Cargar pacientes
        const resPatients = await apiFetch('/api/patients')
        if (resPatients.ok) {
          const patientsData = await resPatients.json()
          setPatients(patientsData || [])
        }

        // Cargar clínicas
        const resClinics = await apiFetch('/api/clinics?limit=100')
        if (resClinics.ok) {
          const clinicsData = await resClinics.json()
          setClinics(clinicsData || [])
        }
      } catch (err) {
        console.error('Error loading data:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [currentUser?.token])

  // Auto-refresh: volver a cargar solicitudes cada 10s (pausado si la pestaña está oculta)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        if (document.hidden) return
        const res = await apiFetch('/api/requests')
        if (res.ok) {
          const data = await res.json()
          setRequests(data || [])
        }
      } catch (err) {
        // Silenciar errores de polling
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [currentUser?.token])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleBackToAdmin = () => {
    if (currentUser?.role === 'admin') {
      navigate('/admin')
    }
  }

  const handleTicketClick = async (ticket) => {
    // Navegar a la página de detalle del ticket
    navigate(`/ticket/${ticket.id}`)
  }

  // Mapear solicitudes a formato de tickets
  const tickets = requests.map(req => {
    const patient = patients.find(p => p.id === req.patient_id)
    const clinic = clinics.find(c => c.name === patient?.clinic)
    
    return {
      id: req.id,
      consecutive: req.consecutive_number || req.id,
      patientName: patient?.name || 'Desconocido',
      clinicName: patient?.clinic || 'Sin clínica',
      doctorName: req.doctor_name || req.doctorName || '-',
      templateType: req.template_type || req.templateType || 'Solicitud',
      arch: req.foot_side || req.footSide || '-',
            status: req.status === 'pending' ? 'Pendiente' :
              req.status === 'in_progress' || req.status === 'in_production' ? 'En Producción' :
              req.status === 'ready' ? 'Lista para Entregar' :
              req.status === 'delivered' ? 'Entregada' :
              req.status === 'cancelled' ? 'Cancelada' : 'Pendiente',
      date: req.created_at || req.createdAt,
      files: req.files ? (Array.isArray(req.files) ? req.files : JSON.parse(req.files)) : [],
      notes: [],
      internalNotes: req.observations || '',
      shoeSize: req.shoe_size || req.shoeSize,
      specs: req.specs || {}
    }
  })

  const pendingTickets = tickets.filter(t => t.status === 'Pendiente')
  const inProductionTickets = tickets.filter(t => t.status === 'En Producción')
  const readyTickets = tickets.filter(t => t.status === 'Lista para Entregar')
  const completedTickets = tickets.filter(t => t.status === 'Entregada')

  // Filtrar tickets según el estado seleccionado
  const filteredByStatus = statusFilter === null 
    ? tickets.filter(t => t.status !== 'Entregado' && t.status !== 'Cancelado')
    : tickets.filter(t => t.status === statusFilter)

  // Filtrar por búsqueda (nombre paciente, clínica, doctor)
  const filteredTickets = filteredByStatus.filter(t => 
    t.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.clinicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Ordenar por fecha
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return sortByDate === 'newest' ? dateB - dateA : dateA - dateB
  })

  // Toggle de estado - si clickea el mismo estado, desmarca
  const handleStatusToggle = (status) => {
    setStatusFilter(statusFilter === status ? null : status)
  }

  return (
    <div className="min-h-screen bg-[#F4F6F8]">
      <LucvanHeader
        title="Producción"
        user={currentUser}
        onLogout={handleLogout}
        onBack={handleBackToAdmin}
        showBack={currentUser?.role === 'admin'}
      />

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-blue-900">Dashboard de Producción</h2>
            <p className="text-sm text-gray-600 mt-1">
              {statusFilter ? `Filtrando por: ${statusFilter}` : 'Mostrando todos los tickets activos'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-gray-700">Ordenar por fecha:</label>
            <select 
              value={sortByDate}
              onChange={(e) => setSortByDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Más recientes primero</option>
              <option value="oldest">Más antiguos primero</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div 
            onClick={() => handleStatusToggle('Pendiente')}
            className={`bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500 cursor-pointer transition ${
              statusFilter === 'Pendiente' ? 'ring-2 ring-yellow-500 bg-yellow-50' : 'hover:shadow-lg'
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pendientes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{pendingTickets.length}</p>
              </div>
              <div className="text-4xl">⏳</div>
            </div>
          </div>

          <div 
            onClick={() => handleStatusToggle('En Producción')}
            className={`bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500 cursor-pointer transition ${
              statusFilter === 'En Producción' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-lg'
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 text-sm font-medium">En Producción</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{inProductionTickets.length}</p>
              </div>
              <div className="text-4xl">🔨</div>
            </div>
          </div>

          <div 
            onClick={() => handleStatusToggle('Lista para Entregar')}
            className={`bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500 cursor-pointer transition ${
              statusFilter === 'Lista para Entregar' ? 'ring-2 ring-purple-500 bg-purple-50' : 'hover:shadow-xl'
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 text-sm font-medium">Lista para Entregar</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{readyTickets.length}</p>
              </div>
              <div className="text-4xl">📦</div>
            </div>
          </div>

          <div 
            onClick={() => setStatusFilter('Entregado')}
            className={`bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500 cursor-pointer transition ${
              statusFilter === 'Entregado' ? 'ring-2 ring-green-500' : 'hover:shadow-xl'
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 text-sm font-medium">Entregados</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{completedTickets.length}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>
        </div>

        {/* Tickets List */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-gray-500">Cargando solicitudes...</div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {statusFilter ? `Tickets: ${statusFilter}` : 'Tickets activos'} ({sortedTickets.length})
              </h3>
              {statusFilter !== null && (
                <button
                  onClick={() => setStatusFilter(null)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
                >
                  Ver todos
                </button>
              )}
            </div>
            
            {/* Buscador */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por paciente, clínica o doctor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg 
                className="absolute left-3 top-3 h-5 w-5 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {sortedTickets.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                {searchTerm 
                  ? `No se encontraron resultados para "${searchTerm}"`
                  : statusFilter === 'all' 
                    ? 'No hay tickets registrados' 
                    : `No hay tickets con estado "${statusFilter}"`
                }
              </div>
            ) : (
              sortedTickets.map((ticket) => (
                <div 
                  key={ticket.id} 
                  onClick={() => handleTicketClick(ticket)}
                  className="p-6 hover:bg-gray-50 transition cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-[#003C63] text-white text-sm font-bold px-2 py-1 rounded">#{ticket.consecutive || ticket.id}</span>
                        <h3 className="text-lg font-bold text-gray-900">{ticket.patientName}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          ticket.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                          ticket.status === 'En Producción' ? 'bg-blue-100 text-blue-800' :
                          ticket.status === 'Lista para Entregar' ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {ticket.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Clínica:</span> {ticket.clinicName}
                        </div>
                        <div>
                          <span className="font-medium">Doctor:</span> {ticket.doctorName}
                        </div>
                        <div>
                          <span className="font-medium">Tipo:</span> {ticket.templateType}
                        </div>
                        <div>
                          <span className="font-medium">Arcada:</span> {ticket.arch}
                        </div>
                      </div>

                      <div className="mt-2 text-sm text-gray-500">
                        Fecha: {new Date(ticket.date).toLocaleDateString('es-ES')}
                        {ticket.files.length > 0 && ` • ${ticket.files.length} archivo(s) adjunto(s)`}
                      </div>
                    </div>

                    <div className="text-blue-500 text-sm font-semibold ml-4">
                      Ver detalles →
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  )
}
