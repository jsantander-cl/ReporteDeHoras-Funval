import { useNavigate } from 'react-router-dom'

const ITEMS = [
  {
    key: 'countries',
    title: 'Gestión de Países',
    desc: 'Administra la lista global de regiones, códigos ISO y localizaciones operativas.',
    icon: '🏳️',
    path: '/admin/maintenance/countries',
  },
  {
    key: 'courses',
    title: 'Gestión de Cursos',
    desc: 'Control de currículos, programas académicos y periodos de vigencia institucional.',
    icon: '🎓',
    path: '/admin/maintenance/courses',
  },
  {
    key: 'categories',
    title: 'Categorías',
    desc: 'Taxonomía de contenidos, etiquetas administrativas y agrupación de recursos educativos.',
    icon: '⛃',
    path: '/admin/maintenance/categories',
  },
]

// Tareas 19-21: CRUD Categorías / Cursos / Países. Esta página solo es el hub de navegación.
const MantenimientoGlobal = () => {
  const navigate = useNavigate()

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#004B93]">Mantenimiento Global</h1>
        <p className="text-gray-500 text-sm mt-1">
          Panel central de administración institucional. Gestione los parámetros base para la operación del sistema.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ITEMS.map((item) => (
          <div key={item.key} className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
            <div className="p-6 flex flex-col items-center text-center flex-1">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl mb-4 text-[#004B93]">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
            <div className="px-6 pb-6 pt-2 flex gap-2">
              <button
                onClick={() => navigate(item.path)}
                className="flex-1 bg-[#004B93] hover:bg-[#00306B] text-white font-semibold text-xs py-3 rounded-xl transition-colors"
              >
                Visualizar Elementos
              </button>
              <button
                onClick={() => navigate(`${item.path}?new=1`)}
                className="bg-blue-50 hover:bg-blue-100 text-[#004B93] font-bold text-lg px-4 rounded-xl border border-blue-200 transition-colors"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MantenimientoGlobal
