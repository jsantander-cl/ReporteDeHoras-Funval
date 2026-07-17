import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFetch } from '../../hooks/useFetch'
import Spinner from '../../components/common/Spinner'
import { Users, FileText, BookOpen, Tag, ArrowRight } from 'lucide-react'

export default function AdminDashboard() {
  const navigate = useNavigate()

  // Llamadas a las APIs necesarias
  const { data: statsData, loading: loadingStats, error: errorStats } = useFetch('/dashboard/stats')
  const { data: coursesData, loading: loadingCourses, error: errorCourses } = useFetch('/courses/')
  const { data: categoriesData, loading: loadingCategories, error: errorCategories } = useFetch('/categories/')

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100)
    return () => clearTimeout(t)
  }, [])

  // Determinamos si alguna carga está en progreso
  const isLoading = loadingStats || loadingCourses || loadingCategories

  if (isLoading) return <Spinner text="Cargando panel..." />

  // Manejamos errores individuales, pero mostramos un mensaje genérico si algo falla
  if (errorStats) return <p className="text-red-600 text-sm">Error al cargar estadísticas: {errorStats}</p>
  if (errorCourses) return <p className="text-red-600 text-sm">Error al cargar cursos: {errorCourses}</p>
  if (errorCategories) return <p className="text-red-600 text-sm">Error al cargar categorías: {errorCategories}</p>

  // Extracción segura de datos
  const usuarios = statsData?.users || {}
  const reportes = statsData?.reports || {}

  const totalUsuarios = (usuarios.total_students || 0) + (usuarios.total_admins || 0)
  const totalReportes = reportes.total ?? '—'

  // Para cursos y categorías, asumimos que vienen como arreglo (puede que tengan paginación)
  const cursos = Array.isArray(coursesData) ? coursesData : coursesData?.items || coursesData?.data || []
  const categorias = Array.isArray(categoriesData) ? categoriesData : categoriesData?.items || categoriesData?.data || []

  const totalCursos = cursos.length
  const totalCategorias = categorias.length

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-[#0C2340]">Panel de Administración</h1>
        <p className="text-slate-500 text-sm mt-1">
          Bienvenido de nuevo, administrador. Aquí tienes el resumen del día.
        </p>
      </div>

      {/* Grid de 4 tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Usuarios */}
        <div
          onClick={() => navigate('/admin/users')}
          className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="p-2 bg-blue-50 rounded-lg w-fit mb-3">
            <Users className="w-5 h-5 text-[#004B93]" />
          </div>
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wide">
            Total Usuarios
          </h3>
          <p className="text-4xl font-extrabold text-slate-900 mt-1">
            {totalUsuarios}
          </p>
        </div>

        {/* Total Reportes */}
        <div
          onClick={() => navigate('/admin/reports')}
          className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="p-2 bg-purple-50 rounded-lg w-fit mb-3">
            <FileText className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wide">
            Total Reportes
          </h3>
          <p className="text-4xl font-extrabold text-slate-900 mt-1">
            {totalReportes}
          </p>
        </div>

        {/* Cursos Activos */}
        <div
          onClick={() => navigate('/admin/courses')}
          className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="p-2 bg-emerald-50 rounded-lg w-fit mb-3">
            <BookOpen className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wide">
            Cursos Activos
          </h3>
          <p className="text-4xl font-extrabold text-slate-900 mt-1">
            {totalCursos}
          </p>
        </div>

        {/* Categorías Activas */}
        <div
          onClick={() => navigate('/admin/categories')}
          className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="p-2 bg-amber-50 rounded-lg w-fit mb-3">
            <Tag className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wide">
            Categorías Activas
          </h3>
          <p className="text-4xl font-extrabold text-slate-900 mt-1">
            {totalCategorias}
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