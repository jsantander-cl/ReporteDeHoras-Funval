import { useState, useEffect } from 'react'
import { X, Clock, CheckCircle, XCircle, AlertTriangle, FileText } from 'lucide-react'

export default function ReviewReportModal({ report, onClose, onSuccess }) {
  // Detectar si estamos editando una revisión existente
  const isEditing = report.status !== 'PENDING'

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Valores del formulario precargados si es edición
  const [approvedHours, setApprovedHours] = useState(
    isEditing ? (report.approved_hours?.toString() || '0') : ''
  )
  const [reviewerNotes, setReviewerNotes] = useState(
    isEditing ? (report.reviewer_notes || '') : ''
  )

  // Estado para el enlace de evidencia
  const [evidenceLink, setEvidenceLink] = useState(null)
  const [loadingEvidence, setLoadingEvidence] = useState(false)

  if (!report) return null

  // Obtener el enlace de evidencia si no viene en el objeto report
  useEffect(() => {
    const fetchEvidence = async () => {
      // Si ya tenemos un enlace en el reporte (web_view_link o similar), lo usamos
      if (report.web_view_link || report.evidence_url) {
        setEvidenceLink(report.web_view_link || report.evidence_url)
        return
      }
      // Si no, consultamos el endpoint
      setLoadingEvidence(true)
      try {
        const res = await fetch(`/api/v1/reports/${report.id}/evidence`)
        if (res.ok) {
          const data = await res.json()
          setEvidenceLink(data.web_view_link || data.link || data.url)
        } else {
          // 404 significa que no hay evidencia
          setEvidenceLink(null)
        }
      } catch (err) {
        console.error('Error al obtener evidencia', err)
        setEvidenceLink(null)
      } finally {
        setLoadingEvidence(false)
      }
    }

    fetchEvidence()
  }, [report.id, report.web_view_link, report.evidence_url])

  const maxHours = parseFloat(report.hours_spent || report.reported_hours || report.reportedHours || 0)

  const handleApproveFull = () => {
    setApprovedHours(maxHours.toString())
    setError(null)
  }

  const handleApprovePartial = () => {
    setApprovedHours('')
    setError(null)
  }

  const handleReject = () => {
    setApprovedHours('0')
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const parsedHours = parseFloat(approvedHours)
    if (isNaN(parsedHours) || parsedHours < 0) {
      setError('Ingresa un número válido de horas.')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`/api/v1/reports/${report.id}/review`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approved_hours: parsedHours,
          reviewer_notes: reviewerNotes.trim() || undefined,
        }),
      })

      if (!response.ok) {
        let errorMsg = 'Error al enviar la revisión'
        try {
          const data = await response.json()
          if (Array.isArray(data.detail)) {
            errorMsg = data.detail.map(d => d.msg).join(', ')
          } else if (data.detail) {
            errorMsg = data.detail
          }
        } catch (e) {}
        throw new Error(errorMsg)
      }

      onSuccess?.()
      onClose?.()
    } catch (err) {
      setError(err.message || 'Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-[#0C2340] mb-4">
          {isEditing ? 'Editar revisión' : 'Revisar reporte'}
        </h2>

        {/* Datos del reporte */}
        <div className="space-y-2 text-sm text-slate-700 bg-slate-50 p-3 rounded-xl">
          <p>
            <span className="font-semibold">Estudiante:</span>{' '}
            {report.student?.full_name || report.student?.first_name || 'Desconocido'}
          </p>
          <p>
            <span className="font-semibold">Categoría:</span>{' '}
            {report.category?.name || 'Sin categoría'}
          </p>
          <p>
            <span className="font-semibold">Horas reportadas:</span>{' '}
            {report.hours_spent || report.reported_hours || report.reportedHours || '00:00'}
          </p>
          <p>
            <span className="font-semibold">Fecha:</span>{' '}
            {report.date || report.created_at?.slice(0, 10)}
          </p>
          {report.description && (
            <p>
              <span className="font-semibold">Descripción:</span> {report.description}
            </p>
          )}
          {isEditing && (
            <p>
              <span className="font-semibold">Estado actual:</span>{' '}
              {report.status}
            </p>
          )}
        </div>

        {/* Evidencia */}
        <div className="mt-4">
          {loadingEvidence ? (
            <p className="text-xs text-slate-400">Cargando evidencia...</p>
          ) : evidenceLink ? (
            <a
              href={evidenceLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Ver evidencia (PDF)
            </a>
          ) : (
            <p className="text-xs text-slate-400">No se adjuntó evidencia.</p>
          )}
        </div>

        {/* Acciones rápidas */}
        <div className="flex gap-2 mt-4">
          {/* ... sin cambios ... */}
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* ... sin cambios ... */}
        </form>
      </div>
    </div>
  )
}