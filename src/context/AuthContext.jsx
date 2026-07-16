import { createContext, useState, useEffect, useRef, useContext } from 'react'
import api from '../services/api'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const hasCheckedAuth = useRef(false)

  const isAuthenticated = !!user;
  const role = user?.role || null; 

  useEffect(() => {
    if (hasCheckedAuth.current) return
    hasCheckedAuth.current = true
    
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data } = await api.get('/profile/me')
      setUser(data)
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error('Error verificando auth:', error)
      }
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Limpia el estado del usuario en React de inmediato y redirige al login.
  const handleAuthError = () => {
    setUser(null)
    window.location.href = '/login'
  }

  const login = async (email, password) => {
    try {
      await api.post('/auth/login', { email, password })
      const { data } = await api.get('/profile/me')
      setUser(data)
      return { success: true }
    } catch (error) {
      const detail = error.response?.data?.detail
      const message = Array.isArray(detail) 
        ? detail.map(d => d.msg).join(', ') 
        : (detail || 'Credenciales inválidas')
      return { success: false, error: message }
    }
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Error en logout', error)
    } finally {
      setUser(null)
      window.location.href = '/login'
    }
  }

  const refreshUser = async () => {
    try {
      const { data } = await api.get('/profile/me')
      setUser(data)
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error('Error refrescando usuario', error)
      }
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      role, 
      isLoading, 
      login, 
      logout, 
      refreshUser,
      handleAuthError 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context
}