import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ClinicDashboard() {
  const [activeTab, setActiveTab] = useState('patients')
  const [searchTerm, setSearchTerm] = useState('')
  const [showNewPatientModal, setShowNewPatientModal] = useState(false)
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  // Mock data - Reemplazar con datos de Firebase
  const [patients, setPatients] = useState([
    { id: '1', name: 'María González', phone: '+52 555 123 4567', email: 'maria@example.com', birthDate: '1990-05-15', notes: 'Paciente con diabetes tipo 2. Requiere seguimiento especial.' },
    { id: '2', name: 'Juan Pérez', phone: '+52 555 234 5678', email: 'juan@example.com', birthDate: '1983-08-22', notes: 'Alergico a ciertos materiales.' },
  ])

  const [editingPatient, setEditingPatient] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)

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

  const handleDeletePatient = (patientId) => {
    setPatients(patients.filter(p => p.id !== patientId))
    setShowDeleteConfirm(null)
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img src="/lucvan-logo-web.png" alt="Lucván" className="h-12" />
              <div>
                <h1 className="hidden md:block font-semibold text-gray-900 text-3xl">Sistema de Gestión Clínica</h1>
                <p className="text-sm text-gray-500 mt-1 hidden md:block">{currentUser?.name}</p>
              </div>
            </div>
            <div className="flex gap-3">
              {currentUser?.role === 'admin' && (
                <button
                  onClick={handleBackToAdmin}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition font-medium"
                >
                  ← Panel de Administración
                </button>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition font-medium"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('patients')}
              className={`py-3 px-6 font-medium transition border-b-2 ${
                activeTab === 'patients'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pacientes
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`py-3 px-6 font-medium transition border-b-2 ${
                activeTab === 'requests'
                  ? 'border-gray-900 text-gray-900'
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
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
              <button
                onClick={() => setShowNewPatientModal(true)}
                className="px-5 py-2.5 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800 transition"
              >
                + Registrar Paciente
              </button>
            </div>

            <div className="bg-white border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Edad</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Solicitudes</th>
                    <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patients.map((patient, index) => (
                    <tr
                      key={patient.id}
                      className={`group hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <td className="px-4 sm:px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="text-sm text-gray-900">{patient.email}</div>
                        <div className="text-xs text-gray-500">{patient.phone}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                        {calculateAge(patient.birthDate)} años
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                        <span className="text-sm text-gray-900">0</span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button
                          onClick={() => navigate(`/patient/${patient.id}`)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">Historial de Solicitudes</h2>
            <div className="text-center py-16 text-gray-500">
              <p className="text-sm">No hay solicitudes registradas</p>
            </div>
          </div>
        )}
      </main>

      {/* Modal Editar Paciente */}
      {editingPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">Editar Paciente</h2>
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setEditingPatient(null); }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  defaultValue={editingPatient.name}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                <input
                  type="tel"
                  defaultValue={editingPatient.phone}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  defaultValue={editingPatient.email}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento *</label>
                <input
                  type="date"
                  defaultValue={editingPatient.birthDate}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas Clínicas</label>
                <textarea
                  rows="4"
                  defaultValue={editingPatient.notes}
                  placeholder="Información médica relevante, alergias, condiciones especiales..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                ></textarea>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gray-900 text-white py-2.5 rounded-md font-medium hover:bg-gray-800 transition"
                >
                  Guardar Cambios
                </button>
                <button
                  type="button"
                  onClick={() => setEditingPatient(null)}
                  className="flex-1 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-md font-medium hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Confirmar Eliminación</h2>
            <p className="text-gray-600 mb-6">¿Estás seguro de que deseas eliminar este paciente? Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDeletePatient(showDeleteConfirm)}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-md font-medium hover:bg-red-700 transition"
              >
                Eliminar
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-md font-medium hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nuevo Paciente */}
      {showNewPatientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">Registrar Nuevo Paciente</h2>
            <form className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                <input
                  type="tel"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento *</label>
                <input
                  type="date"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas Clínicas</label>
                <textarea
                  rows="3"
                  placeholder="Información médica relevante, alergias, condiciones especiales..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                ></textarea>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gray-900 text-white py-2.5 rounded-md font-medium hover:bg-gray-800 transition"
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
