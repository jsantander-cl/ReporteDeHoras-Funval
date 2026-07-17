import { useState, useEffect } from 'react'
import { X, CheckCircle, XCircle, FileText, AlertCircle } from 'lucide-react'
import api from '../../services/api'

// Tarea 28: Modal de revisión de reporte -> PATCH /reports/{id}/review
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

  const maxHours = parseFloat(report?.hours_spent || report?.reported_hours || report?.reportedHours || 0)

  // Obtener el enlace de evidencia si no viene en el objeto report
  useEffect(() => {
    if (!report) return

    if (report.web_view_link || report.evidence_url) {
      setEvidenceLink(report.web_view_link || report.evidence_url)
      return
    }

    let cancelled = false
    const fetchEvidence = async () => {
      setLoadingEvidence(true)
      try {
        const res = await api.get(`/reports/${report.id}/evidence`)
        if (!cancelled) {
          setEvidenceLink(res.data?.web_view_link || res.data?.link || res.data?.url || null)
        }
      } catch (err) {
        // 404 significa que no hay evidencia; cualquier otro error lo tratamos igual (sin evidencia)
        if (!cancelled) setEvidenceLink(null)
      } finally {
        if (!cancelled) setLoadingEvidence(false)
      }
    }

    fetchEvidence()
    return () => { cancelled = true }
  }, [report])

  if (!report) return null

  // Determina a qué estado quedará el reporte según las horas aprobadas (Tarea 28)
  const previewStatus = (hours) => {
    if (hours <= 0) return 'REJECTED'
    if (hours < maxHours) return 'APPROVED_PARTIAL'
    return 'APPROVED_FULL'
  }

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
    setError(null)

    const parsedHours = parseFloat(approvedHours)

    if (approvedHours === '' || isNaN(parsedHours)) {
      setError('Ingresa un número válido de horas.')
      return
    }
    // Tarea 28: restringir horas aprobadas entre 0 y el máximo de horas reportadas
    if (parsedHours < 0 || parsedHours > maxHours) {
      setError(`Las horas aprobadas deben estar entre 0 y ${maxHours}.`)
      return
    }

    setLoading(true)
    try {
      await api.patch(`/reports/${report.id}/review`, {
        approved_hours: parsedHours,
        reviewer_notes: reviewerNotes.trim() || undefined,
      })

      onSuccess?.()
      onClose?.()
    } catch (err) {
      const detail = err.response?.data?.detail
      const msg = Array.isArray(detail) ? detail.map((d) => d.msg).join(', ') : detail
      setError(msg || 'Error al enviar la revisión')
    } finally {
      setLoading(false)
    }
  }

  const parsedPreview = parseFloat(approvedHours)
  const statusPreview = !isNaN(parsedPreview) ? previewStatus(parsedPreview) : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
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
              <span className="font-semibold">Estado actual:</span> {report.status}
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
          <button
            type="button"
            onClick={handleApproveFull}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" /> Aprobar Total
          </button>
          <button
            type="button"
            onClick={handleApprovePartial}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors disabled:opacity-50"
          >
            Aprobar Parcial
          </button>
          <button
            type="button"
            onClick={handleReject}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-red-50 text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            <XCircle className="w-4 h-4" /> Rechazar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Horas aprobadas (máximo {maxHours})
            </label>
            <input
              type="number"
              min="0"
              max={maxHours}
              step="0.5"
              value={approvedHours}
              onChange={(e) => setApprovedHours(e.target.value)}
              placeholder="0"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#004B93]/20 focus:border-[#004B93]"
            />
            {statusPreview && (
              <p className="text-xs text-slate-400 mt-1.5">
                Esto dejará el reporte en estado: <span className="font-semibold text-slate-600">{statusPreview}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Notas del revisor (opcional)
            </label>
            <textarea
              value={reviewerNotes}
              onChange={(e) => setReviewerNotes(e.target.value)}
              rows={3}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#004B93]/20 focus:border-[#004B93] resize-none"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <p className="text-xs text-red-700">{error}</p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-2.5 rounded-xl font-semibold text-sm transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#004B93] hover:bg-[#003870] text-white py-2.5 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60"
            >
              {loading ? 'Guardando...' : 'Guardar revisión'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}