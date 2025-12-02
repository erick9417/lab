import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState('home')
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img src="/lucvan-logo-web.png" alt="Lucván" className="h-12" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
                <p className="text-sm text-gray-600">Bienvenido, {currentUser?.name}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'home' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => setActiveView('users')}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105"
            >
              <div className="text-5xl mb-4">👥</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Ver Usuarios</h2>
              <p className="text-gray-600">Gestionar usuarios del sistema</p>
            </button>

            <button
              onClick={() => navigate('/clinic')}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105"
            >
              <div className="text-5xl mb-4">🏥</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Ver Clínicas</h2>
              <p className="text-gray-600">Acceder al módulo de clínicas</p>
            </button>

            <button
              onClick={() => navigate('/workshop')}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105"
            >
              <div className="text-5xl mb-4">🔨</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Ver Taller</h2>
              <p className="text-gray-600">Acceder al módulo de producción</p>
            </button>
          </div>
        )}

        {activeView === 'users' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
              <button
                onClick={() => setActiveView('home')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                ← Volver
              </button>
            </div>
            <div className="text-center py-12 text-gray-500">
              Módulo de gestión de usuarios en desarrollo
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
