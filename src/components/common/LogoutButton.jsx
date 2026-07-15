import { useAuth } from '../../hooks/useAuth'
import { LogOut } from 'lucide-react'
import toast from 'react-hot-toast'

const LogoutButton = () => {
  const { logout } = useAuth()

  const handleLogout = async () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      await logout()
      toast.success('Sesión cerrada correctamente')
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
    >
      <LogOut className="w-4 h-4" />
      Cerrar sesión
    </button>
  )
}

export default LogoutButton