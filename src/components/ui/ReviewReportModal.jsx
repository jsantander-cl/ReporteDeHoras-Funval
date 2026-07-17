import { useState } from 'react'
import { X, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

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

  if (!report) return null

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

        {/* Datos del reporte (igual que antes) */}
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

        {/* Acciones rápidas */}
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={handleApproveFull}
            disabled={loading}
            className="flex-1 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1"
          >
            <CheckCircle className="w-4 h-4" />
            Aprobar todo
          </button>
          <button
            type="button"
            onClick={handleApprovePartial}
            disabled={loading}
            className="flex-1 px-3 py-2 bg-amber-50 text-amber-700 rounded-lg text-xs font-semibold hover:bg-amber-100 transition-colors flex items-center justify-center gap-1"
          >
            <Clock className="w-4 h-4" />
            Parcial
          </button>
          <button
            type="button"
            onClick={handleReject}
            disabled={loading}
            className="flex-1 px-3 py-2 bg-red-50 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
          >
            <XCircle className="w-4 h-4" />
            Rechazar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Horas a aprobar <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              step="any"
              min="0"
              max={maxHours}
              value={approvedHours}
              onChange={(e) => setApprovedHours(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#004B93]/20"
              disabled={loading}
              required
            />
            <p className="text-xs text-slate-400 mt-1">
              Máximo permitido: {maxHours} horas. 0 = rechazado.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Notas del revisor (opcional)
            </label>
            <textarea
              rows={2}
              value={reviewerNotes}
              onChange={(e) => setReviewerNotes(e.target.value)}
              placeholder="Comentarios adicionales..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#004B93]/20"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 rounded-full border border-slate-300 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-full bg-[#004B93] text-white text-sm font-medium hover:bg-[#003A73] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? 'Guardando...' : isEditing ? 'Actualizar revisión' : 'Confirmar revisión'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}