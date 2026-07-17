const StatusBadge = ({ status }) => {
  const config = {
    PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendiente' },
    APPROVED_FULL: { bg: 'bg-green-100', text: 'text-green-800', label: 'Aprobado Completo' },
    APPROVED_PARTIAL: { bg: 'bg-secondary-container', text: 'text-on-secondary-container', label: 'Aprobado Parcial' },
    REJECTED: { bg: 'bg-error-container', text: 'text-on-error-container', label: 'Rechazado' }
  }

  const { bg, text, label } = config[status] || { bg: 'bg-surface-container', text: 'text-on-surface-variant', label: status }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
      {label}
    </span>
  )
}

export default StatusBadge
