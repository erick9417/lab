import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import UsersManagement from './pages/UsersManagement'
import ClinicDashboard from './pages/ClinicDashboard'
import ProductionDashboard from './pages/ProductionDashboard'
import ProductionTicketDetail from './pages/ProductionTicketDetail'
import PatientDetail from './pages/PatientDetail'
import NewRequest from './pages/NewRequest'
import RequestDetail from './pages/RequestDetail'
import InviteAccept from './pages/InviteAccept'
import ForcePasswordChange from './pages/ForcePasswordChange'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, loading } = useAuth()
  const location = useLocation()

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

  // Forzar cambio de contraseña si corresponde
  if (currentUser.mustChangePassword && location.pathname !== '/change-password') {
    return <Navigate to="/change-password" replace />
  }

  if (allowedRoles) {
    const role = currentUser.role
    const isAllowed =
      allowedRoles.includes(role) ||
      (role === 'production' && allowedRoles.includes('workshop')) ||
      (role === 'workshop' && allowedRoles.includes('production'))

    if (!isAllowed) {
      return <Navigate to="/" replace />
    }
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

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            {currentUser?.role === 'admin' && <AdminDashboard />}
            {currentUser?.role === 'clinic' && <ClinicDashboard />}
            {(currentUser?.role === 'workshop' || currentUser?.role === 'production') && <ProductionDashboard />}
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/change-password" 
        element={
          <ProtectedRoute>
            {/* Página dedicada para cambio obligatorio de contraseña */}
            <ForcePasswordChange />
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
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UsersManagement />
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
        path="/production" 
        element={
          <ProtectedRoute allowedRoles={['admin', 'workshop', 'production']}>
            <ProductionDashboard />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/ticket/:id" 
        element={
          <ProtectedRoute allowedRoles={['admin', 'workshop', 'production']}>
            <ProductionTicketDetail />
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

      <Route 
        path="/request/:id" 
        element={
          <ProtectedRoute allowedRoles={['admin', 'clinic']}>
            <RequestDetail />
          </ProtectedRoute>
        } 
      />

      <Route path="/invite/accept" element={<InviteAccept />} />

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
