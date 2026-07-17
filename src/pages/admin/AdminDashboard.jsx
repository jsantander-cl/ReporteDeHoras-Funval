import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFetch } from '../../hooks/useFetch'
import Spinner from '../../components/common/Spinner'
import { Users, FileWarning, FileCheck, ArrowRight } from 'lucide-react'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { data, loading, error } = useFetch('/dashboard/stats')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100)
    return () => clearTimeout(t)
  }, [])

  if (loading) return <Spinner text="Cargando panel..." />
  if (error) return <p className="text-red-600 text-sm">{error}</p>

  // Extraemos los datos reales según la respuesta del backend
  const usuarios = data?.users || {}
  const reportes = data?.reports || {}

  const totalEstudiantes = usuarios.total_students ?? '—'
  const reportesPendientes = reportes.pending ?? '—'

  // Reportes revisados = aprobados + rechazados (los que ya fueron atendidos)
  const reportesRevisados =
    reportes.approved !== undefined && reportes.rejected !== undefined
      ? reportes.approved + reportes.rejected
      : '—'

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-[#0C2340]">Panel de Administración</h1>
        <p className="text-slate-500 text-sm mt-1">
          Bienvenido de nuevo, administrador. Aquí tienes el resumen del día.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {/* Total Estudiantes */}
        <div
          onClick={() => navigate('/admin/users')}
          className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="p-2 bg-blue-50 rounded-lg w-fit mb-3">
            <Users className="w-5 h-5 text-[#004B93]" />
          </div>
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wide">
            Total Estudiantes
          </h3>
          <p className="text-4xl font-extrabold text-slate-900 mt-1">
            {totalEstudiantes}
          </p>
        </div>

        {/* Reportes por Revisar */}
        <div
          onClick={() => navigate('/admin/reports', { state: { statusFilter: 'PENDING' } })}
          className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="p-2 bg-red-50 rounded-lg w-fit mb-3">
            <FileWarning className="w-5 h-5 text-red-500" />
          </div>
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wide">
            Reportes por Revisar
          </h3>
          <p className="text-4xl font-extrabold text-slate-900 mt-1">
            {reportesPendientes}
          </p>
        </div>

        {/* Reportes Revisados */}
        <div
          onClick={() => navigate('/admin/reports', { state: { statusFilter: 'REVIEWED' } })}
          className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm cursor-pointer hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1"
        >
          <div className="p-2 bg-green-50 rounded-lg w-fit mb-3">
            <FileCheck className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wide">
            Reportes Revisados
          </h3>
          <p className="text-4xl font-extrabold text-slate-900 mt-1">
            {reportesRevisados}
          </p>
        </div>
      </div>

      {/* Accesos directos (sin cambios) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          onClick={() => navigate('/admin/users')}
          className="relative rounded-2xl overflow-hidden h-40 bg-gradient-to-r from-[#004B93] to-[#00306B] flex flex-col justify-center p-6 cursor-pointer"
        >
          <h4 className="text-white text-xl font-bold mb-1">Gestión de Usuarios</h4>
          <p className="text-white/80 text-sm mb-3 max-w-xs">
            Administra perfiles, roles y permisos de acceso global.
          </p>
          <span className="bg-white text-[#004B93] px-4 py-2 rounded-lg text-sm font-semibold w-fit flex items-center gap-1">
            Acceder ahora <ArrowRight className="w-4 h-4" />
          </span>
        </div>

        <div
          onClick={() => navigate('/admin/maintenance')}
          className="relative rounded-2xl overflow-hidden h-40 bg-gradient-to-r from-slate-700 to-slate-500 flex flex-col justify-center p-6 cursor-pointer"
        >
          <h4 className="text-white text-xl font-bold mb-1">Mantenimiento</h4>
          <p className="text-white/80 text-sm mb-3 max-w-xs">
            Configuración de base de datos y logs de sistema.
          </p>
          <span className="bg-white text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold w-fit flex items-center gap-1">
            Configurar <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </div>
  )
}