//📂 FASE 2: COMPONENTES COMPARTIDOS DE INTERFAZ
//📌 Tarea 5: Sidebar con navegación dinámica según rol

import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FileText, Users, Settings, User, AlertTriangle } from 'lucide-react'

const ADMIN_LINKS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/reports', label: 'Reports', icon: FileText, end: true },
  { to: '/admin/reports/in-debt', label: 'Deudores', icon: AlertTriangle },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/maintenance', label: 'Maintenance', icon: Settings },
]

const STUDENT_LINKS = [
  { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/student/reports', label: 'Mis Reportes', icon: FileText },
  
]

const MenuLateral = ({ user, isOpen = true, onClose, onOpenProfile }) => {
  const links = user?.role === 'ADMIN' ? ADMIN_LINKS : STUDENT_LINKS

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed md:static inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col justify-between z-50 transform transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4">
          <div className="flex items-center gap-3 p-3 mb-4 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-[#004B93] flex items-center justify-center text-white font-bold text-sm">
              {user?.role === 'ADMIN' ? 'AD' : (user?.first_name?.[0] || 'ST')}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-gray-900 truncate">
                {user?.full_name || (user?.role === 'ADMIN' ? 'Admin Panel' : 'Estudiante')}
              </p>
              <p className="text-xs text-gray-400">{user?.role === 'ADMIN' ? 'Administrator' : 'Student'}</p>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            
            {/* === RUTAS DE NAVEGACIÓN === */}
            {links.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#E6F0FA] text-[#004B93] font-semibold'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                {label}
              </NavLink>
            ))}

            {/* === BOTÓN DE PERFIL (AGREGADO) === */}
            {user?.role !== 'ADMIN' && (
              <button
                onClick={() => {
                  onOpenProfile(); 
                  if (window.innerWidth < 768) onClose(); 
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-gray-500 hover:bg-[#E6F0FA] hover:text-[#004B93] hover:font-semibold text-left w-full"              >
                <User className="w-5 h-5" />
                Perfil
              </button>
            )}

          </nav>
        </div>

        <div className="border-t border-gray-100 p-4 text-xs text-gray-400">v1.2.0</div>
      </aside>
    </>
  )
}

export default MenuLateral