import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import BadgeStatus from '../../components/ui/BadgeStatus'
import Pagination from '../../components/ui/Pagination'
import ReviewReportModal from '../../components/ui/ReviewReportModal'
import { useFetch } from '../../hooks/useFetch'
import Spinner from '../../components/common/Spinner'

export default function AdminReportsPage() {
  // Estado para filtros y paginación
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [page, setPage] = useState(1)
  const pageSize = 10

  // Construir URL con parámetros dinámicos
  const url = useMemo(() => {
    const params = new URLSearchParams({ page, page_size: pageSize })
    if (statusFilter !== 'ALL') params.append('status', statusFilter)
    // Si en el futuro implementas filtro por estudiante vía ID, añade:
    // if (selectedStudentId) params.append('student_id', selectedStudentId)
    return `/reports/?${params.toString()}`
  }, [page, pageSize, statusFilter])

  const { data: reportsData, loading: loadingReports, error: errorReports } = useFetch(url)
  const { data: statusesData } = useFetch('/enums/report-statuses')

  const [reporteSeleccionado, setReporteSeleccionado] = useState(null)

  const reports = reportsData?.items || reportsData || []
  const totalReports = reportsData?.total ?? 0

  // Normalizar los posibles formatos del enum de estados
  const statuses = (() => {
    if (!statusesData) return [
      { value: 'APPROVED_FULL', label: 'Aprobados' },
      { value: 'APPROVED_PARTIAL', label: 'Aprobados Parcial' },
      { value: 'PENDING', label: 'Pendientes' },
      { value: 'REJECTED', label: 'Rechazados' }
    ]
    if (Array.isArray(statusesData) && typeof statusesData[0] === 'string') {
      return statusesData.map(s => ({ value: s, label: s }))
    }
    if (Array.isArray(statusesData)) {
      return statusesData.map(s => ({
        value: s.value || s.name,
        label: s.label || s.name || s.value
      }))
    }
    if (statusesData.items) {
      return statusesData.items.map(s => ({
        value: s.value || s.name,
        label: s.label || s.name || s.value
      }))
    }
    return statusesData
  })()

  // El filtro por búsqueda se mantiene en el cliente porque el API no expone búsqueda por texto.
  // Si el backend soportara un parámetro 'search', podríamos agregarlo a la URL.
  const filteredReports = reports.filter((r) => {
    const rawStudent = r.student?.first_name || r.student?.full_name || r.student
    const rawCategory = r.category?.name || r.category

    const studentName = typeof rawStudent === 'string' ? rawStudent : ''
    const categoryName = typeof rawCategory === 'string' ? rawCategory : ''

    const matchesSearch =
      studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      categoryName.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  // Resetear página cuando cambia el filtro de estado
  const handleStatusChange = (newStatus) => {
    setStatusFilter(newStatus)
    setPage(1) // vuelve a la primera página al filtrar
  }

  if (loadingReports) return <Spinner text="Cargando reportes del servidor..." />
  if (errorReports) return <div className="text-red-500 p-8 text-center font-bold">Error: {errorReports}</div>

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold text-[#0C2340]">Listado de Reportes</h1>
        <p className="text-slate-500 text-sm mt-1">Consulta y revisa las horas de servicio reportadas.</p>
      </div>

      <section className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:max-w-md relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por estudiante o categoría..."
            className="w-full bg-white border border-slate-200 rounded-full pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#004B93]/20 text-sm shadow-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="w-full md:w-56 bg-white border border-slate-200 rounded-full px-5 py-3 outline-none text-sm text-slate-600 shadow-sm"
        >
          <option value="ALL">Todos los estados</option>
          {statuses.map((status, index) => (
            <option
              key={status.value || index}
              value={status.value}
            >
              {status.label}
            </option>
          ))}
        </select>
      </section>

      <div className="bg-[#F1F5F9] border border-slate-200/60 rounded-2xl p-4 overflow-x-auto">
        <table className="w-full text-left border-spacing-y-2 border-separate">
          <thead>
            <tr className="text-slate-400 font-bold text-xs tracking-wider uppercase">
              <th className="px-6 pb-2">Estudiante</th>
              <th className="px-6 pb-2">Categoría</th>
              <th className="px-6 pb-2">Reportadas</th>
              <th className="px-6 pb-2">Aprobadas</th>
              <th className="px-6 pb-2">Estado</th>
              <th className="px-6 pb-2">Fecha</th>
              <th className="px-6 pb-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report) => (
              <tr key={report.id} className="bg-white shadow-sm">
                <td className="px-6 py-4 rounded-l-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#E2E8F0] text-[#004B93] font-bold text-xs flex items-center justify-center">
                    {report.initials || (report.student?.first_name?.[0] || 'S')}
                  </div>
                  <span className="font-semibold text-slate-700 text-sm">
                    {report.student?.first_name || report.student?.full_name || report.student || 'Desconocido'}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500 text-sm">
                  {report.category?.name || report.category || 'Sin categoría'}
                </td>
                <td className="px-6 py-4 font-mono font-bold text-[#004B93] text-sm">
                  {report.hours_spent ?? report.reported_hours ?? report.reportedHours ?? '00:00'}
                </td>
                <td className="px-6 py-4 font-mono text-sm">
                  {report.approved_hours ?? report.approvedHours ?? '--:--'}
                </td>
                <td className="px-6 py-4">
                  <BadgeStatus status={report.status} />
                </td>
                <td className="px-6 py-4 text-slate-500 text-xs font-semibold">
                  {report.date || report.created_at?.slice(0, 10)}
                </td>
                <td className="px-6 py-4 rounded-r-xl text-right">
                  <button
                    onClick={() => setReporteSeleccionado(report)}
                    className="text-xs font-bold text-[#004B93] hover:underline"
                  >
                    {report.status === 'PENDING' ? 'Revisar' : 'Editar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación con el total real del servidor */}
      <Pagination
        page={page}
        pageSize={pageSize}
        total={totalReports}
        onPageChange={setPage}
      />

      {reporteSeleccionado && (
        <ReviewReportModal
          report={reporteSeleccionado}
          onClose={() => setReporteSeleccionado(null)}
          onSuccess={() => {
            window.location.reload()
          }}
        />
      )}
    </div>
  )
}