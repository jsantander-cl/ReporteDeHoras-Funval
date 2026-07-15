import { useAuth } from '../../hooks/useAuth'
import { LogOut } from 'lucide-react'
import toast from 'react-hot-toast'

const LogoutButton = ({ compact = false }) => {
  const { logout } = useAuth()

  const handleLogout = async () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      await logout()
      toast.success('Sesión cerrada correctamente')
    }
  }

  if (compact) {
    return (
      <button
        onClick={handleLogout}
        title="Cerrar sesión"
        className="flex items-center justify-center w-9 h-9 text-red-500 hover:bg-red-50 rounded-full transition-colors"
      >
        <LogOut className="w-4 h-4" />
      </button>
    )
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
