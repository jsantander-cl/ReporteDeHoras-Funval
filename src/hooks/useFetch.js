import { useState, useEffect } from 'react'
import api from '../services/api'

export const useFetch = (endpoint) => {
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
  }, [endpoint])

  return { data, loading, error, refetch: () => window.location.reload() }
}