import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PatientDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  // Mock data - Reemplazar con datos de Firebase
  const patient = {
    id: '1',
    name: 'María González',
    phone: '+52 555 123 4567',
    email: 'maria@example.com',
    birthDate: '1990-05-15',
    address: 'Calle Ejemplo 123, CDMX',
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/clinic')}
              className="text-gray-700 hover:text-gray-900 font-medium inline-flex items-center gap-2"
            >
              ← Volver al Listado de Pacientes
            </button>
            <img src="/lucvan-logo-web.png" alt="Lucván" className="h-10" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white border rounded-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">{patient.name}</h1>
              <p className="text-xs text-gray-500">Expediente del Paciente</p>
            </div>
            <button
              onClick={() => navigate(`/request/new/${patient.id}`)}
              className="px-4 py-2 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800 transition text-sm"
            >
              + Nueva Solicitud
            </button>
          </div>

          {/* Patient Info */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Teléfono</p>
              <p className="text-sm text-gray-900 font-semibold">{patient.phone}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Email</p>
              <p className="text-sm text-gray-900 font-semibold">{patient.email}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Fecha de Nacimiento</p>
              <p className="text-sm text-gray-900 font-semibold">{new Date(patient.birthDate).toLocaleDateString('es-ES')}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Edad</p>
              <p className="text-sm text-gray-900 font-semibold">{calculateAge(patient.birthDate)} años</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg col-span-2">
              <p className="text-xs text-gray-500 mb-1">Dirección</p>
              <p className="text-sm text-gray-900 font-semibold">{patient.address}</p>
            </div>
          </div>

          {/* Requests Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Historial de Solicitudes</h2>
            <div className="text-center py-12 bg-gray-50 rounded-md border border-gray-200">
              <p className="text-sm text-gray-500">No hay solicitudes registradas para este paciente</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
