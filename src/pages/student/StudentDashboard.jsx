import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useFetch } from '../../hooks/useFetch'
import Spinner from '../../components/common/Spinner'
import {
  FileText, Clock, CheckCircle, XCircle,
  TrendingUp, Award, Plus, Eye
} from 'lucide-react'

const StudentDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data, loading, error } = useFetch('/dashboard/stats')

  if (loading) return <Spinner />
  if (error) return <div className="text-error p-4">{error}</div>

  const stats = data || {}
  const approvalRate = stats.reports?.approval_rate ? (stats.reports.approval_rate).toFixed(1) : 0
  const repCat = stats.top_categories || []
  const cursProgrs = stats.course_progress || { hours_approved: 0, required_service_hours: 0, progress_percentage: 0 }

  const cards = [
    { label: 'Total Reportes', value: stats.reports?.total || 0, icon: FileText, color: 'bg-secondary-container text-primary' },
    { label: 'Pendientes', value: stats.reports?.pending || 0, icon: Clock, color: 'bg-yellow-100 text-yellow-600' },
    { label: 'Aprobados', value: stats.reports?.approved || 0, icon: CheckCircle, color: 'bg-green-100 text-green-600' },
    { label: 'Rechazados', value: stats.reports?.rejected || 0, icon: XCircle, color: 'bg-error-container text-error' },
  ]

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 animate-fade-in duration-500">
      
      {/* Encabezado Principal */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-300">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">¡Hola, {user?.first_name || 'Estudiante'}!</h1>
          <p className="text-gray-500 text-sm mt-1">Aquí tienes un resumen de tu actividad de servicio.</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/student/reports/new"
            className="flex items-center gap-2 bg-[#004B93] hover:bg-[#003870] text-white px-4 py-2.5 rounded-xl text-sm font-semibold inline-flex transition-all duration-200 transform hover:scale-[1.03] active:scale-95 hover:shadow-md"
          >
            <Plus className="w-4 h-4" /> Enviar Nuevo Reporte
          </Link>
          <button
            onClick={() => navigate('/student/reports')}
            className="flex items-center gap-2 border border-[#004B93] text-[#004B93] px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-all duration-200 transform hover:scale-[1.03] active:scale-95"
          >
            <Eye className="w-4 h-4" /> Ver mis Reportes
          </button>
        </div>
      </div>

      {/* Grid de Reportes Totales con efectos Hover nativos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div 
            key={card.label} 
            className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md hover:border-blue-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{card.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{card.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${card.color} transition-transform duration-300 hover:scale-110`}>
                <card.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sección de Horas y Progreso */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Horas Reportadas */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-slate-900">Horas Reportadas</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.reports?.total_hours_submitted || 0}h</p>
        </div>

        {/* Horas Aprobadas */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-slate-900">Horas Aprobadas</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.reports?.total_hours_approved || 0}h</p>
        </div>

        {/* Tasa de Aprobación */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-slate-900">Tasa de Aprobación</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">{approvalRate}%</p>
        </div>

        {/* Tarjeta de Progreso Acumulado */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl flex flex-col justify-between shadow-sm transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-blue-100 text-blue-800 rounded-xl">
              <span className="material-symbols-outlined">⏰</span>
            </div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Acumulado</span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Horas Totales</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-slate-900">{cursProgrs.hours_approved}</span>
              <span className="text-lg font-medium text-slate-500">/ {cursProgrs.required_service_hours}</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-blue-700 h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${cursProgrs.progress_percentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Actividades Animada por Transición */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-900">Actividades Realizadas</h3>
          <button className="text-blue-700 text-sm font-semibold hover:underline">Ver Todo</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider">CATEGORIA</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider">TOTAL DE REPORTES</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider text-center">TOTAL HORAS APROBADAS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {repCat.length > 0 ? (
                repCat.map((category, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-700 group-hover:scale-110 transition-transform duration-200">
                          <span className="material-symbols-outlined text-[18px]">📑</span>
                        </div>
                        <span className="text-sm font-medium text-slate-900">{category.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{category.total_reports}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold inline-block group-hover:scale-105 transition-transform duration-200">
                        {category.total_hours_approved}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-6 text-center text-slate-500">
                    No hay categorías disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
