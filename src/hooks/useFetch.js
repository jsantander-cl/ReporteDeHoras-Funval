import { useState, useEffect } from 'react'
import api from '../services/api'

// 'dependencies' como segundo parámetro opcional, por defecto vacío 
export const useFetch = (endpoint, dependencies = []) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!endpoint) return

    let cancelled = false

    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await api.get(endpoint)
        if (!cancelled) {
          setData(response.data)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          if (err.response?.status !== 401) {
            const msg = err.response?.data?.detail || 'Error al cargar'
            setError(Array.isArray(msg) ? msg.map(m => m.msg).join(', ') : msg)
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()

    return () => { cancelled = true }
    // AÑADIMOS ...dependencies AL ARRAY DE DEPENDENCIAS
    // Si tus compañeros llaman al hook sin pasar el segundo parámetro,
    // [endpoint, ...[]] sigue siendo [endpoint], así que su código NO se rompe.
  }, [endpoint, ...dependencies]) 

  return { data, loading, error }
}