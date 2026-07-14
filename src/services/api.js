import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)

// Response interceptor - CORREGIDO para evitar loops
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const requestUrl = error.config?.url || ''
    const currentPath = window.location.pathname

    // ✅ Lista de URLs que NO deben disparar redirección
    const ignoredUrls = ['/profile/me', '/auth/login', '/auth/logout']
    const isIgnoredRequest = ignoredUrls.some(url => requestUrl.includes(url))
    
    // ✅ Lista de rutas donde NO debemos redirigir
    const ignoredPaths = ['/login', '/unauthorized']
    const isIgnoredPath = ignoredPaths.includes(currentPath)

    if (status === 401) {
      // Solo redirigir si:
      // 1. NO estamos ya en /login
      // 2. La petición NO es una de verificación inicial
      if (!isIgnoredPath && !isIgnoredRequest) {
        window.location.href = '/login'
      }
    } else if (status === 403) {
      if (currentPath !== '/unauthorized') {
        window.location.href = '/unauthorized'
      }
    }
    
    return Promise.reject(error)
  }
)

export default api