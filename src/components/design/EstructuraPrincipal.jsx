//📂 FASE 2: COMPONENTES COMPARTIDOS DE INTERFAZ
//📌 Tarea 5: Layout principal (Sidebar + Navbar contenedor)

import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import MenuLateral from './MenuLateral'
import BarraSuperior from './BarraSuperior'

// Contenedor único de todas las páginas privadas del sistema.
// Cualquier página nueva (admin o estudiante) va DENTRO de esta estructura
// vía <Outlet />, en lugar de traer su propio header/sidebar.
const EstructuraPrincipal = () => {
  const { user } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      <MenuLateral user={user} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <BarraSuperior user={user} onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default EstructuraPrincipal
