//📂 FASE 2: COMPONENTES COMPARTIDOS DE INTERFAZ
//📌 Tarea 8: Badge de estado de reporte (Colores dinámicos)

// Mapea los 4 estados reales del backend (Tarea 8 / enums/report-statuses)
const STATUS_MAP = {
  PENDING: { label: 'Pendiente', bg: 'bg-[#FEF3C7]', text: 'text-[#D97706]', dot: 'bg-[#D97706]' },
  APPROVED_FULL: { label: 'Aprobado', bg: 'bg-[#E6F9F0]', text: 'text-[#10B981]', dot: 'bg-[#10B981]' },
  APPROVED_PARTIAL: { label: 'Aprobado Parcial', bg: 'bg-[#E0F2FE]', text: 'text-[#0284C7]', dot: 'bg-[#0284C7]' },
  REJECTED: { label: 'Rechazado', bg: 'bg-[#FEE2E2]', text: 'text-[#EF4444]', dot: 'bg-[#EF4444]' },
}

const BadgeStatus = ({ status }) => {
  const config = STATUS_MAP[status] || {
    label: status || 'Desconocido',
    bg: 'bg-gray-100',
    text: 'text-gray-500',
    dot: 'bg-gray-400',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold whitespace-nowrap ${config.bg} ${config.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
      {config.label}
    </span>
  )
}

export default BadgeStatus
