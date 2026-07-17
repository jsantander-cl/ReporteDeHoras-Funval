import { useParams, Link, useNavigate } from 'react-router-dom'
import { useFetch } from '../../hooks/useFetch'
import PdfViewer from '../../components/common/PdfViewer'
import StatusBadge from '../../components/ui/BadgeStatus'
import Spinner from '../../components/common/Spinner'
import Button from '../../components/common/Button'
import { formatDateTime } from '../../utils/helpers'
import { ArrowLeft, FileText, Clock, MessageSquare } from 'lucide-react'

const ReportDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: report, loading, error } = useFetch(`/reports/${id}`)

  if (loading) return <Spinner />
  if (error) return <div className="text-error p-4">{error}</div>
  if (!report) return <div className="text-on-surface-variant p-4">Reporte no encontrado</div>

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-on-surface-variant hover:text-on-surface">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Reporte #{report.id}</h1>
          <p className="text-outline text-sm">{formatDateTime(report.created_at)}</p>
        </div>
      </div>

      {/* Info del reporte */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-outline">Categoría</p>
            <p className="font-medium text-on-surface">{report.category?.name}</p>
          </div>
          <div>
            <p className="text-xs text-outline">Estado</p>
            <div className="mt-1"><StatusBadge status={report.status} /></div>
          </div>
          <div>
            <p className="text-xs text-outline">Horas reportadas</p>
            <p className="font-medium text-on-surface">{report.hours_spent}h</p>
          </div>
          <div>
            <p className="text-xs text-outline">Horas aprobadas</p>
            <p className="font-medium text-on-surface">{report.approved_hours || 0}h</p>
          </div>
        </div>

        <div>
          <p className="text-xs text-outline mb-1">Descripción</p>
          <p className="text-on-surface-variant">{report.description}</p>
        </div>

        {report.reviewer_notes && (
          <div className="mt-4 p-4 bg-surface-container-low border border-secondary-container rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              <p className="font-semibold text-on-secondary-container text-sm">Notas del revisor</p>
            </div>
            <p className="text-sm text-primary">{report.reviewer_notes}</p>
          </div>
        )}
      </div>

      {/* PDF */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-on-surface-variant" />
          <h3 className="font-semibold text-on-surface">Evidencia</h3>
        </div>
        <PdfViewer reportId={report.id} />
      </div>
    </div>
  )
}

export default ReportDetail