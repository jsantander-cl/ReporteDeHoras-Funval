import { createContext, useState, useEffect, useRef } from 'react'
import api from '../services/api'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const hasCheckedAuth = useRef(false) // ✅ Previene doble ejecución en StrictMode

  useEffect(() => {
    // ✅ Solo ejecutar una vez, incluso en React StrictMode
    if (hasCheckedAuth.current) return
    hasCheckedAuth.current = true
    
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data } = await api.get('/profile/me')
      setUser(data)
    } catch (error) {
      // ✅ Silenciar el 401 (es esperado cuando no hay sesión)
      if (error.response?.status !== 401) {
        console.error('Error verificando auth:', error)
      }
      setUser(null)
    } finally {
      setIsLoading(false)
    }
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
    <AuthContext.Provider value={{ user, isLoading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}