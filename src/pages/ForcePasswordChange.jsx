import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function ForcePasswordChange() {
  const { currentUser, logout } = useAuth()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!currentPassword) {
      setError('Ingrese su contraseña actual')
      return
    }
    if (newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentUser.email,
          currentPassword,
          newPassword
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al cambiar contraseña')

      alert('Contraseña actualizada. Inicie sesión nuevamente con su nueva contraseña.')
      logout()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0066A4] via-[#005889] to-[#003C63] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-6">
          <img src="/lucvan-logo-web.png" alt="Lucván LATAM" className="h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#003C63]">Cambio de contraseña requerido</h1>
          <p className="text-[#333333] mt-2">Usuario: {currentUser?.email}</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#003C63] mb-2">Contraseña actual</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0066A4] focus:border-[#0066A4] transition-all"
              placeholder="Ingrese su contraseña actual"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#003C63] mb-2">Nueva contraseña</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0066A4] focus:border-[#0066A4] transition-all"
              placeholder="Nueva contraseña (mínimo 6 caracteres)"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#003C63] mb-2">Confirmar contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0066A4] focus:border-[#0066A4] transition-all"
              placeholder="Confirme su nueva contraseña"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F5C400] text-[#003C63] py-3 px-6 rounded-full font-bold hover:bg-[#ffd933] transition-all shadow-[0_12px_24px_-10px_rgba(0,60,99,0.25)] hover:shadow-[0_16px_32px_-12px_rgba(0,60,99,0.3)] hover:-translate-y-0.5 disabled:opacity-50"
          >
            {loading ? 'Cambiando contraseña...' : 'Cambiar contraseña'}
          </button>
        </form>
      </div>
    </div>
  )
}
