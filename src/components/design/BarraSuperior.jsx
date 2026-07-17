//📂 FASE 2: COMPONENTES COMPARTIDOS DE INTERFAZ
//📌 Tarea 3: Botón funcional de Logout en Navbar

import { Menu } from 'lucide-react'
import LogoutButton from '../common/LogoutButton'

const BarraSuperior = ({ onMenuClick, user }) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 flex items-center justify-between px-6 py-3">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="md:hidden text-gray-500 hover:text-gray-700">
          <Menu className="w-6 h-6" />
        </button>
        <span className="text-xl font-bold text-[#004B93]">FUNVAL</span>
      </div>

      <div className="flex items-center gap-4">
    

        <span className="hidden sm:inline text-sm text-gray-600 font-medium">
          {user?.full_name || user?.email}
        </span>

        <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-xl font-bold text-[#004B93]">
          {user?.first_name?.[0] || 'U'}
        </div>

        <LogoutButton compact />
      </div>
    </header>
  )
}

export default BarraSuperior
