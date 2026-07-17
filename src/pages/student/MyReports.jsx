import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFetch } from '../../hooks/useFetch'
import StatusBadge from '../../components/common/StatusBadge'
import Pagination from '../../components/common/Pagination'
import Spinner from '../../components/common/Spinner'
import Button from '../../components/common/Button'
import { formatDateTime } from '../../utils/helpers'
import { Plus, Eye } from 'lucide-react'

const MyReports = () => {
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)

  const { data, loading } = useFetch('/reports/', {
    params: { page, page_size: pageSize },
    dependencies: [page]
  })

  const reports = data?.items || []
  const totalPages = Math.ceil((data?.total || 0) / pageSize)

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Mis Reportes</h1>
          <p className="text-outline text-sm">{data?.total || 0} reportes en total</p>
        </div>
        <Link to="/student/reports/new">
          <Button>
            <Plus className="w-4 h-4 mr-1" /> Nuevo Reporte
          </Button>
        </Link>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden">
        {loading ? (
          <Spinner />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-surface-container-low text-on-surface-variant uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-6 py-3 text-left">ID</th>
                    <th className="px-6 py-3 text-left">Categoría</th>
                    <th className="px-6 py-3 text-left">Descripción</th>
                    <th className="px-6 py-3 text-right">Horas Reportadas</th>
                    <th className="px-6 py-3 text-right">Horas Aprobadas</th>
                    <th className="px-6 py-3 text-left">Estado</th>
                    <th className="px-6 py-3 text-left">Fecha</th>
                    <th className="px-6 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {reports.map((r) => (
                    <tr key={r.id} className="hover:bg-surface-container-low">
                      <td className="px-6 py-4 text-outline">#{r.id}</td>
                      <td className="px-6 py-4 text-on-surface-variant">{r.category?.name}</td>
                      <td className="px-6 py-4 text-on-surface-variant max-w-xs truncate">{r.description}</td>
                      <td className="px-6 py-4 text-right text-on-surface-variant">{r.hours_spent}h</td>
                      <td className="px-6 py-4 text-right text-on-surface-variant">{r.approved_hours || 0}h</td>
                      <td className="px-6 py-4"><StatusBadge status={r.status} /></td>
                      <td className="px-6 py-4 text-xs text-outline">{formatDateTime(r.created_at)}</td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/student/reports/${r.id}`}
                          className="inline-flex items-center text-primary hover:bg-surface-container-low px-3 py-1.5 rounded-lg text-sm font-medium"
                        >
                          <Eye className="w-4 h-4 mr-1" /> Ver
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {reports.length === 0 && (
                    <tr><td colSpan="8" className="px-6 py-8 text-center text-outline">No tienes reportes aún</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} loading={loading} />
          </>
        )}
      </div>
    </div>
  )
}

export default MyReports