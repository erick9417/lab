import { createContext, useContext, useState, useEffect } from 'react'
import { apiFetch } from '../lib/api'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Cargar usuario desde sessionStorage (se limpia al cerrar navegador)
    const storedUser = sessionStorage.getItem('lucvan_user')
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const contentType = response.headers.get('content-type') || ''
      let parsed
      let rawText

      if (contentType.includes('application/json')) {
        try {
          parsed = await response.json()
        } catch (e) {
          // Fall back to text if JSON parsing fails
          rawText = await response.text()
        }
      } else {
        rawText = await response.text()
      }

      if (!response.ok) {
        const message = parsed?.error
          || parsed?.message
          || (rawText ? rawText.slice(0, 200) : 'Error de autenticación')
        throw new Error(message || 'Error de autenticación')
      }

      if (!parsed) {
        // Respuesta no JSON en éxito: probablemente HTML por proxy/endpoint incorrecto
        const snippet = (rawText || '').slice(0, 120)
        throw new Error(`Respuesta inválida del servidor (no JSON). Verifica el backend/proxy. Detalle: ${snippet}`)
      }

      const data = parsed
      // Log para debugging
      console.log('Login response:', { 
        user: data.user, 
        name: data.user.name, 
        email: data.user.email,
        fallback: data.user.email.split('@')[0]
      })
      const userData = {
        id: data.user.id,
        name: data.user.name || data.user.email.split('@')[0],
        email: data.user.email,
        role: data.user.role,
        clinicId: data.user.clinicId,
        mustChangePassword: !!data.user.mustChangePassword,
        token: data.token
      }

      setCurrentUser(userData)
      sessionStorage.setItem('lucvan_user', JSON.stringify(userData))
      return userData
    } catch (error) {
      console.error('Login error:', error)
      throw new Error(error.message || 'Error de conexión')
    }
  }

  const logout = () => {
    setCurrentUser(null)
    sessionStorage.removeItem('lucvan_user')
  }

  const value = {
    currentUser,
    loading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
