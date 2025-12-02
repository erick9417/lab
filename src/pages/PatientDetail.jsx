import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PatientDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [notes, setNotes] = useState('Paciente con diabetes tipo 2. Requiere seguimiento especial.')
  const [isEditingPatient, setIsEditingPatient] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    email: '',
    birthDate: '',
    address: '',
    notes: ''
  })

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

  const handleEditPatient = () => {
    setEditForm({
      name: patient.name,
      phone: patient.phone,
      email: patient.email,
      birthDate: patient.birthDate,
      address: patient.address,
      notes: notes
    })
    setIsEditingPatient(true)
  }

  const handleSavePatient = () => {
    // Aquí se guardarían los cambios en la base de datos
    console.log('Guardando cambios del paciente:', editForm)
    setNotes(editForm.notes || '')
    alert('Datos del paciente actualizados exitosamente')
    setIsEditingPatient(false)
  }

  const handleDeletePatient = () => {
    // Aquí se eliminaría el paciente de la base de datos
    console.log('Eliminando paciente:', id)
    alert('Paciente eliminado exitosamente')
    navigate('/clinic')
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
            <div className="flex gap-2">
              <button
                onClick={handleEditPatient}
                className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors text-sm inline-flex items-center gap-1.5"
              >
                ✏️ Editar
              </button>
              <button
                onClick={() => navigate(`/request/new/${patient.id}`)}
                className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition shadow-sm text-sm"
              >
                + Solicitar Nueva Plantilla
              </button>
            </div>
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

          {/* Notas Clínicas */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Notas Clínicas</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{notes || 'No hay notas registradas para este paciente.'}</p>
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

        {/* Botón Eliminar Paciente - Zona de Peligro */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">⚠️ Zona de Peligro</h3>
            <p className="text-sm text-red-600 mb-4">
              Eliminar este paciente borrará permanentemente todos sus datos, incluyendo su historial de solicitudes. Esta acción no se puede deshacer.
            </p>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
            >
              🗑️ Eliminar Paciente
            </button>
          </div>
        </div>
      </main>

      {/* Modal de Edición de Paciente */}
      {isEditingPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Editar Información del Paciente</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    value={editForm.birthDate}
                    onChange={(e) => setEditForm({...editForm, birthDate: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Edad Actual</label>
                  <input
                    type="text"
                    value={`${calculateAge(editForm.birthDate)} años`}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas Clínicas</label>
                <textarea
                  value={editForm.notes || ''}
                  onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Información médica relevante, alergias, condiciones especiales..."
                ></textarea>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSavePatient}
                className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                Guardar Cambios
              </button>
              <button
                onClick={() => setIsEditingPatient(false)}
                className="flex-1 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">¿Estás Seguro?</h2>
              <p className="text-gray-600 mb-6">
                Esta acción eliminará permanentemente a <strong>{patient.name}</strong> y todos sus datos asociados.
                <br /><br />
                <strong className="text-red-600">Esta acción no se puede deshacer.</strong>
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleDeletePatient}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                >
                  Sí, Eliminar
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
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
