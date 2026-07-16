import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import api from '../../services/api'
import MenuLateral from './MenuLateral'
import BarraSuperior from './BarraSuperior'
import ProfilePage from '../../pages/perfil/ProfilePage' 

const EstructuraPrincipal = () => {
  const { user, refreshUser } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      
      {/* === MENÚ LATERAL === */}
      <MenuLateral 
        user={user} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* === CONTENIDO PRINCIPAL === */}
      <div className="flex-1 flex flex-col min-w-0">
        <BarraSuperior user={user} onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>
      </div>

      {/* === MODAL DE PERFIL === */}
      <ProfilePage 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)}
        user={user}
        onSave={async (nuevoNombre) => {
          try {
            await api.put('/profile/update', { full_name: nuevoNombre })
            await refreshUser()
          } catch (error) {
            console.error(error)
          }
        }} 
      />
      
    </div>
  )
}

export default EstructuraPrincipal