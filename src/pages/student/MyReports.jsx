import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFetch } from '../../hooks/useFetch'
import StatusBadge from '../../components/common/StatusBadge'
import Pagination from '../../components/ui/Pagination'
//import Pagination from '../../components/common/Pagination'
import Spinner from '../../components/common/Spinner'
import Button from '../../components/common/Button'
import { formatDateTime } from '../../utils/helpers'
import { Plus, Eye, FileText } from 'lucide-react'
import api from '../../services/api'

const MyReports = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  
  // Estado para forzar la recarga
  const [refreshKey, setRefreshKey] = useState(0)

  // Forzamos el cambio al montar el componente para asegurar datos frescos
  useEffect(() => {
    setRefreshKey(prev => prev + 1)
  }, [])

  // Pasamos [page, refreshKey] como dependencias para que useFetch recargue si cambian
  const { data, loading } = useFetch(`/reports/?page=${page}&page_size=${pageSize}`, [page, refreshKey])

  const [isPdfOpen, setIsPdfOpen] = useState(false)
  const [pdfUrl, setPdfUrl] = useState(null)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [pdfError, setPdfError] = useState(null)

  const handleOpenPdf = async (id) => {
    setIsPdfOpen(true)
    setPdfLoading(true)
    setPdfError(null)
    try {
      const response = await api.get(`/reports/${id}/evidence/stream`, { responseType: 'blob' })
      const blob = new Blob([response.data], { type: 'application/pdf' })
      setPdfUrl(URL.createObjectURL(blob))
    } catch (err) {
      setPdfError('No se pudo cargar la evidencia.')
    } finally {
      setPdfLoading(false)
    }
  }

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
        {loading ? <Spinner /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-container-low text-on-surface-variant uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-3 text-left">ID</th>
                  <th className="px-6 py-3 text-left">CATEGORÍA</th>
                  <th className="px-6 py-3 text-left">DESCRIPCIÓN</th>
                  <th className="px-6 py-3 text-right">HORAS REPORTADAS</th>
                  <th className="px-6 py-3 text-right">HORAS APROBADAS</th>
                  <th className="px-6 py-3 text-left">ESTADO</th>
                  <th className="px-6 py-3 text-left">FECHA</th>
                  <th className="px-6 py-3 text-right">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {reports.map((r) => (
                  <tr key={r.id} className="hover:bg-surface-container-low">
                    <td className="px-6 py-4">#{r.id}</td>
                    <td className="px-6 py-4">{r.category?.name}</td>
                    <td className="px-6 py-4">{r.description}</td>
                    <td className="px-6 py-4 text-right">{r.hours_spent}h</td>
                    <td className="px-6 py-4 text-right">0h</td>
                    <td className="px-6 py-4"><StatusBadge status={r.status} /></td>
                    <td className="px-6 py-4">{formatDateTime(r.created_at)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => handleOpenPdf(r.id)} className="flex items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors font-medium">
                          <FileText className="w-4 h-4" /> <span className="text-xs">PDF</span>
                        </button>
                        <button 
                          onClick={() => navigate(`/student/reports/${r.id}/edit`, { state: { report: r } })}
                          className="flex items-center gap-1 text-slate-600 hover:text-primary transition-colors font-medium"
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
            //cambio valido
            <Pagination page={page}  pageSize={pageSize} total={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  )
}

export default MyReports