import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const userData = await login(email, password)
      // Verificar si debe cambiar contraseña
      if (userData?.mustChangePassword) {
        setShowChangePassword(true)
        setLoading(false)
        return
      }
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setError('')

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)
    try {
      // Usa apiFetch para respetar proxy, base y token
      const res = await import('../lib/api').then(m => m.apiFetch('/api/auth/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          currentPassword: password,
          newPassword
        })
      }))

      let data
      const contentType = res.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        data = await res.json()
      } else {
        const txt = await res.text()
        throw new Error(`Respuesta inválida del servidor (no JSON). Detalle: ${txt.slice(0,120)}`)
      }

      if (!res.ok) {
        throw new Error(data?.error || data?.message || 'Error al cambiar contraseña')
      }

      alert('Contraseña actualizada exitosamente. Inicie sesión con su nueva contraseña.')
      // Reset form
      setShowChangePassword(false)
      setPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0066A4] via-[#005889] to-[#003C63] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <img src="/lucvan-logo-web.png" alt="Lucván LATAM" className="h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-[#003C63] mb-2">Lucván LATAM</h1>
          <p className="text-[#333333]">Sistema de Gestión de Plantillas</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {showChangePassword ? (
          <div>
            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-6">
              <p className="font-semibold mb-1">Cambio de contraseña obligatorio</p>
              <p className="text-sm">Por seguridad, debe cambiar su contraseña temporal antes de continuar.</p>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#003C63] mb-2">
                  Nueva contraseña
                </label>
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
                <label className="block text-sm font-semibold text-[#003C63] mb-2">
                  Confirmar contraseña
                </label>
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
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#003C63] mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0066A4] focus:border-[#0066A4] transition-all"
                placeholder="correo@ejemplo.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#003C63] mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0066A4] focus:border-[#0066A4] transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F5C400] text-[#003C63] py-3 px-6 rounded-full font-bold hover:bg-[#ffd933] transition-all shadow-[0_12px_24px_-10px_rgba(0,60,99,0.25)] hover:shadow-[0_16px_32px_-12px_rgba(0,60,99,0.3)] hover:-translate-y-0.5 disabled:opacity-50"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => window.location.href = '/forgot-password'}
            className="text-sm text-[#0066A4] hover:text-[#003C63] font-semibold hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
      </div>
    </div>
  )
}
