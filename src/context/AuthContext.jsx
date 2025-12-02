import { createContext, useContext, useState, useEffect } from 'react'

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
    // Simular carga de usuario desde localStorage
    const storedUser = localStorage.getItem('lucvan_user')
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    // Mock login - Reemplazar con Firebase Auth
    const mockUsers = [
      { 
        id: '1', 
        email: 'admin@lucvan.com', 
        password: 'admin123', 
        role: 'admin', 
        name: 'Administrador',
        clinicId: null
      },
      { 
        id: '2', 
        email: 'clinica@lucvan.com', 
        password: 'clinica123', 
        role: 'clinic', 
        name: 'Clínica Central',
        clinicId: 'clinic1'
      },
      { 
        id: '3', 
        email: 'taller@lucvan.com', 
        password: 'taller123', 
        role: 'workshop', 
        name: 'Taller Producción',
        clinicId: null
      },
    ]

    const user = mockUsers.find(u => u.email === email && u.password === password)
    
    if (user) {
      const { password, ...userWithoutPassword } = user
      setCurrentUser(userWithoutPassword)
      localStorage.setItem('lucvan_user', JSON.stringify(userWithoutPassword))
      return userWithoutPassword
    }
    
    throw new Error('Credenciales inválidas')
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem('lucvan_user')
  }

  const value = {
    currentUser,
    loading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
