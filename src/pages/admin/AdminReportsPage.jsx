import { useState } from 'react'
import { Search } from 'lucide-react'
import BadgeStatus from '../../components/ui/BadgeStatus'
import Pagination from '../../components/ui/Pagination'

// Tarea 27: Listado de Reportes con filtros -> GET /reports/ + GET /enums/report-statuses
export default function AdminReportsPage() {
  const [reports] = useState([
    { id: 1, student: 'Alejandro Luna', initials: 'AL', category: 'Servicio Comunitario', reportedHours: '04:30', approvedHours: '04:30', status: 'APPROVED_FULL', date: '12 OCT 2023' },
    { id: 2, student: 'Sofía Ramírez', initials: 'SR', category: 'Prácticas Profesionales', reportedHours: '08:00', approvedHours: '--:--', status: 'PENDING', date: '10 OCT 2023' },
    { id: 3, student: 'Carlos Pérez', initials: 'CP', category: 'Taller Extracurricular', reportedHours: '02:15', approvedHours: '00:00', status: 'REJECTED', date: '05 OCT 2023' },
    { id: 4, student: 'Alejandro Luna', initials: 'AL', category: 'Apoyo Administrativo', reportedHours: '05:00', approvedHours: '05:00', status: 'APPROVED_FULL', date: '01 OCT 2023' },
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold text-[#0C2340]">Listado de Reportes</h1>
        <p className="text-slate-500 text-sm mt-1">Consulta y revisa las horas de servicio reportadas por los estudiantes.</p>
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
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-56 bg-white border border-slate-200 rounded-full px-5 py-3 outline-none text-sm text-slate-600 shadow-sm"
        >
          <option value="ALL">Todos los estados</option>
          <option value="APPROVED_FULL">Aprobados</option>
          <option value="APPROVED_PARTIAL">Aprobados Parcial</option>
          <option value="PENDING">Pendientes</option>
          <option value="REJECTED">Rechazados</option>
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
                    {report.initials}
                  </div>
                  <span className="font-semibold text-slate-700 text-sm">{report.student}</span>
                </td>
                <td className="px-6 py-4 text-slate-500 text-sm">{report.category}</td>
                <td className="px-6 py-4 font-mono font-bold text-[#004B93] text-sm">{report.reportedHours}</td>
                <td className="px-6 py-4 font-mono text-sm">{report.approvedHours}</td>
                <td className="px-6 py-4"><BadgeStatus status={report.status} /></td>
                <td className="px-6 py-4 text-slate-500 text-xs font-semibold">{report.date}</td>
                <td className="px-6 py-4 rounded-r-xl text-right">
                  {report.status === 'PENDING' && (
                    <button className="text-xs font-bold text-[#004B93] hover:underline">Revisar</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredReports.length === 0 && (
          <div className="py-12 text-center text-slate-400 bg-white rounded-xl">
            No hay reportes que coincidan con los filtros seleccionados.
          </div>
        )}
      </div>

      <Pagination page={page} pageSize={pageSize} total={filteredReports.length} onPageChange={setPage} />
    </div>
  )
}
