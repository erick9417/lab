import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function WorkshopDashboard() {
  const [activeTab, setActiveTab] = useState('pending')
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  // Mock data - Reemplazar con datos de Firebase
  const [tickets, setTickets] = useState([
    {
      id: '1',
      patientName: 'María González',
      clinicName: 'Clínica Dental Central',
      doctorName: 'Dr. Juan Pérez',
      templateType: 'Plantilla Correctiva',
      arch: 'Ambos',
      status: 'Lista para Entregar',
      date: '2025-11-30',
      files: ['examen-podologico.pdf', 'radiografia.jpg'],
      notes: [],
      internalNotes: ''
    },
  ])

  const [selectedTicket, setSelectedTicket] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [internalNote, setInternalNote] = useState('')
  const [newStatus, setNewStatus] = useState('')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleBackToAdmin = () => {
    if (currentUser?.role === 'admin') {
      navigate('/admin')
    }
  }

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket)
    setInternalNote(ticket.internalNotes || '')
    setNewStatus(ticket.status)
    setShowModal(true)
  }

  const handleUpdateTicket = () => {
    const updatedTickets = tickets.map(t => 
      t.id === selectedTicket.id 
        ? { ...t, status: newStatus, internalNotes: internalNote }
        : t
    )
    setTickets(updatedTickets)
    setShowModal(false)
    setSelectedTicket(null)
  }

  const pendingTickets = tickets.filter(t => t.status === 'Pendiente')
  const inProductionTickets = tickets.filter(t => t.status === 'En Producción')
  const readyTickets = tickets.filter(t => t.status === 'Lista para Entregar')
  const completedTickets = tickets.filter(t => t.status === 'Entregado')

  // Filtrar tickets según el estado seleccionado
  // Si no hay filtro activo, excluir los entregados
  const filteredByStatus = statusFilter === 'all' 
    ? tickets.filter(t => t.status !== 'Entregado')
    : tickets.filter(t => t.status === statusFilter)

  // Filtrar por búsqueda (nombre paciente, clínica, doctor)
  const filteredTickets = filteredByStatus.filter(t => 
    t.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.clinicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Ordenar por fecha (más antigua primero)
  const sortedTickets = [...filteredTickets].sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  )

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img src="/lucvan-logo-web.png" alt="Lucván" className="h-12" />
              <div>
                <h1 className="hidden md:block text-2xl font-bold text-gray-900">Producción</h1>
                <p className="hidden md:block text-sm text-gray-600">Bienvenido, {currentUser?.name}</p>
              </div>
            </div>
            <div className="flex gap-3">
              {currentUser?.role === 'admin' && (
                <button
                  onClick={handleBackToAdmin}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  ← Admin
                </button>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700">Dashboard de Producción</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div 
            onClick={() => setStatusFilter('Pendiente')}
            className={`bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500 cursor-pointer transition ${
              statusFilter === 'Pendiente' ? 'ring-2 ring-yellow-500' : 'hover:shadow-xl'
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
            onClick={() => setStatusFilter('En Producción')}
            className={`bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500 cursor-pointer transition ${
              statusFilter === 'En Producción' ? 'ring-2 ring-blue-500' : 'hover:shadow-xl'
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
            onClick={() => setStatusFilter('Lista para Entregar')}
            className={`bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500 cursor-pointer transition ${
              statusFilter === 'Lista para Entregar' ? 'ring-2 ring-purple-500' : 'hover:shadow-xl'
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
        <div className="bg-white rounded-xl shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {statusFilter === 'all' ? 'Todos los Tickets' : `Tickets: ${statusFilter}`} ({sortedTickets.length})
              </h3>
              {statusFilter !== 'all' && (
                <button
                  onClick={() => setStatusFilter('all')}
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
      </div>

      {/* Modal de Detalles del Ticket */}
      {showModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-3 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Detalles del Ticket</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Información Compacta */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Paciente</p>
                  <p className="font-semibold text-gray-900">{selectedTicket.patientName}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Clínica</p>
                  <p className="font-semibold text-gray-900">{selectedTicket.clinicName}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Doctor</p>
                  <p className="font-semibold text-gray-900">{selectedTicket.doctorName}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Fecha</p>
                  <p className="font-semibold text-gray-900">{new Date(selectedTicket.date).toLocaleDateString('es-ES')}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Tipo de Plantilla</p>
                  <p className="font-semibold text-gray-900">{selectedTicket.templateType}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Arcada</p>
                  <p className="font-semibold text-gray-900">{selectedTicket.arch}</p>
                </div>
              </div>

              {/* Archivos Adjuntos */}
              {selectedTicket.files.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Archivos Adjuntos</p>
                  <div className="space-y-2">
                    {selectedTicket.files.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-lg text-sm">
                        <div className="flex items-center gap-2">
                          <span>📄</span>
                          <span className="font-medium">{file}</span>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 font-semibold text-xs">
                          Descargar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Estado */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Actualizar Estado</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="En Producción">En Producción</option>
                  <option value="Lista para Entregar">Lista para Entregar</option>
                  <option value="Entregado">Entregado</option>
                </select>
              </div>

              {/* Notas Internas */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Notas Internas</label>
                <textarea
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Notas sobre el proceso de producción..."
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleUpdateTicket}
                  className="flex-1 bg-blue-500 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-600 transition text-sm"
                >
                  Actualizar
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-300 transition text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
