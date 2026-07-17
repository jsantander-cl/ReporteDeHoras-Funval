export const parseApiError = (error) => {
  const detail = error?.response?.data?.detail
  if (!detail) return 'Ocurrió un error inesperado'
  if (Array.isArray(detail)) return detail.map(d => d.msg).join(', ')
  if (typeof detail === 'string') return detail
  return 'Error en la petición'
}

export const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const formatDateTime = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}