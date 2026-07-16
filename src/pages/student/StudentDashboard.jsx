import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useFetch } from '../../hooks/useFetch'
import Spinner from '../../components/common/Spinner'
import StatCard from '../../components/common/StatCard'
import {
  FileText, Clock, CheckCircle, XCircle,
  TrendingUp, Award, Target, AlertCircle, Plus, Eye
} from 'lucide-react'

// Tarea 13: Dashboard del Estudiante -> GET /dashboard/stats
const StudentDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data, loading, error } = useFetch('/dashboard/stats')

  if (loading) return <Spinner text="Cargando tu dashboard..." />

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h3 className="font-semibold text-red-900">Error al cargar datos</h3>
          </div>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    )
  }

  const stats = data?.reports || {}
  const approvalRate = stats.approval_rate ? (stats.approval_rate * 100).toFixed(1) : '0.0'

  const getApprovalMessage = () => {
    const rate = parseFloat(approvalRate)
    if (rate >= 80) return { text: '¡Excelente desempeño!', color: 'text-green-600', emoji: '🎉' }
    if (rate >= 60) return { text: 'Buen progreso', color: 'text-blue-600', emoji: '👍' }
    if (rate >= 40) return { text: 'Sigue esforzándote', color: 'text-yellow-600', emoji: '💪' }
    return { text: 'Necesitas mejorar', color: 'text-red-600', emoji: '📚' }
  }
  const approvalMessage = getApprovalMessage()

  return (
    <div className="space-y-6 max-w-6xl mx-auto">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">¡Hola, {user?.first_name || 'Estudiante'}!</h1>
          <p className="text-gray-500 text-sm mt-1">Aquí tienes un resumen de tu actividad de servicio.</p>
        </div>
        <div className="flex gap-3">
          {/* Botón de Enviar Reporte transformado en Link */}
          <Link
            to="/student/reports/new"
            className="flex items-center gap-2 bg-[#004B93] hover:bg-[#003870] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors inline-flex"
          >
            <Plus className="w-4 h-4" /> Enviar Nuevo Reporte
          </Link>
          <button
            onClick={() => navigate('/student/reports')}
            className="flex items-center gap-2 border border-[#004B93] text-[#004B93] px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-50"
          >
            <Eye className="w-4 h-4" /> Ver mis Reportes
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Resumen de Reportes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Reportes" value={stats.total || 0} icon={FileText} color="blue" subtitle="Todos tus envíos" />
          <StatCard label="Pendientes" value={stats.pending || 0} icon={Clock} color="yellow" subtitle="En revisión" />
          <StatCard label="Aprobados" value={stats.approved || 0} icon={CheckCircle} color="green" subtitle="Aceptados" />
          <StatCard label="Rechazados" value={stats.rejected || 0} icon={XCircle} color="red" subtitle="Requieren corrección" />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Horas de Servicio</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg"><TrendingUp className="w-5 h-5 text-blue-600" /></div>
              <h3 className="font-semibold text-gray-900">Reportadas</h3>
            </div>
            <p className="text-4xl font-bold text-gray-900">{stats.total_hours_submitted || 0}<span className="text-lg text-gray-500 ml-1">h</span></p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg"><Award className="w-5 h-5 text-green-600" /></div>
              <h3 className="font-semibold text-gray-900">Aprobadas</h3>
            </div>
            <p className="text-4xl font-bold text-gray-900">{stats.total_hours_approved || 0}<span className="text-lg text-gray-500 ml-1">h</span></p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg"><Target className="w-5 h-5 text-purple-600" /></div>
              <h3 className="font-semibold text-gray-900">Aprobación</h3>
            </div>
            <p className="text-4xl font-bold text-gray-900">{approvalRate}<span className="text-lg text-gray-500 ml-1">%</span></p>
            <p className={`text-xs font-medium mt-2 ${approvalMessage.color}`}>{approvalMessage.emoji} {approvalMessage.text}</p>
          </div>
        </div>
      </div>

      {(stats.total_hours_submitted > 0 || stats.total_hours_approved > 0) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Progreso de Horas</h3>
            <span className="text-sm text-gray-500">{stats.total_hours_approved || 0}h de {stats.total_hours_submitted || 0}h aprobadas</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${stats.total_hours_submitted > 0 ? Math.min(100, ((stats.total_hours_approved || 0) / stats.total_hours_submitted) * 100) : 0}%` }}
            />
          </div>
        </div>
      )}

      {stats.total === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
          <FileText className="w-12 h-12 text-blue-400 mx-auto mb-3" />
          <h3 className="font-semibold text-blue-900 mb-1">¡Comienza tu viaje de servicio!</h3>
          <p className="text-sm text-blue-700">Aún no has enviado ningún reporte. Ve a "Nuevo Reporte" para registrar tus primeras horas.</p>
        </div>
      )}
    </div>
  )
}

export default StudentDashboard
