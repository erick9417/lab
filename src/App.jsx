import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import ClinicDashboard from './pages/ClinicDashboard'
import WorkshopDashboard from './pages/WorkshopDashboard'
import PatientDetail from './pages/PatientDetail'
import NewRequest from './pages/NewRequest'

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    )
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

// Main App Router
function AppRouter() {
  const { currentUser } = useAuth()

  return (
    <Routes>
      <Route 
        path="/login" 
        element={currentUser ? <Navigate to="/" replace /> : <Login />} 
      />
      
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            {currentUser?.role === 'admin' && <AdminDashboard />}
            {currentUser?.role === 'clinic' && <ClinicDashboard />}
            {currentUser?.role === 'workshop' && <WorkshopDashboard />}
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/clinic" 
        element={
          <ProtectedRoute allowedRoles={['admin', 'clinic']}>
            <ClinicDashboard />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/workshop" 
        element={
          <ProtectedRoute allowedRoles={['admin', 'workshop']}>
            <WorkshopDashboard />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/patient/:id" 
        element={
          <ProtectedRoute allowedRoles={['admin', 'clinic']}>
            <PatientDetail />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/request/new/:patientId" 
        element={
          <ProtectedRoute allowedRoles={['admin', 'clinic']}>
            <NewRequest />
          </ProtectedRoute>
        } 
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </Router>
  )
}

export default App
