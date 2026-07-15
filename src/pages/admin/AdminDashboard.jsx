import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFetch } from '../../hooks/useFetch'
import Spinner from '../../components/common/Spinner'
import { Users, FileWarning, Activity, ArrowRight } from 'lucide-react'

// Tarea 18: Dashboard de Administrador -> GET /dashboard/stats
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

  const stats = data || {}

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-[#0C2340]">Panel de Administración</h1>
        <p className="text-slate-500 text-sm mt-1">Bienvenido de nuevo, administrador. Aquí tienes el resumen del día.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="p-2 bg-blue-50 rounded-lg w-fit mb-3"><Users className="w-5 h-5 text-[#004B93]" /></div>
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wide">Total Estudiantes</h3>
          <p className="text-4xl font-extrabold text-slate-900 mt-1">{stats.total_students ?? '—'}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="p-2 bg-red-50 rounded-lg w-fit mb-3"><FileWarning className="w-5 h-5 text-red-500" /></div>
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wide">Reportes por Revisar</h3>
          <p className="text-4xl font-extrabold text-slate-900 mt-1">{stats.pending_reports ?? '—'}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm sm:col-span-2 lg:col-span-1">
          <div className="p-2 bg-indigo-50 rounded-lg w-fit mb-3"><Activity className="w-5 h-5 text-indigo-500" /></div>
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wide">Usuarios Activos</h3>
          <p className="text-4xl font-extrabold text-slate-900 mt-1">{stats.active_users ?? '—'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          onClick={() => navigate('/admin/users')}
          className="relative rounded-2xl overflow-hidden h-40 bg-gradient-to-r from-[#004B93] to-[#00306B] flex flex-col justify-center p-6 cursor-pointer"
        >
          <h4 className="text-white text-xl font-bold mb-1">Gestión de Usuarios</h4>
          <p className="text-white/80 text-sm mb-3 max-w-xs">Administra perfiles, roles y permisos de acceso global.</p>
          <span className="bg-white text-[#004B93] px-4 py-2 rounded-lg text-sm font-semibold w-fit flex items-center gap-1">
            Acceder ahora <ArrowRight className="w-4 h-4" />
          </span>
        </div>

        <div
          onClick={() => navigate('/admin/maintenance')}
          className="relative rounded-2xl overflow-hidden h-40 bg-gradient-to-r from-slate-700 to-slate-500 flex flex-col justify-center p-6 cursor-pointer"
        >
          <h4 className="text-white text-xl font-bold mb-1">Mantenimiento</h4>
          <p className="text-white/80 text-sm mb-3 max-w-xs">Configuración de base de datos y logs de sistema.</p>
          <span className="bg-white text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold w-fit flex items-center gap-1">
            Configurar <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </div>
  )
}
