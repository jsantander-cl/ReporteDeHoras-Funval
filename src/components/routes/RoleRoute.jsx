//📂 FASE 2: COMPONENTES COMPARTIDOS DE INTERFAZ
//📌 Tarea 2: Protección de rutas (Route Guard de Roles ADMIN/STUDENT)

import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

// Uso: <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
// Debe ir siempre DENTRO de un <PrivateRoute />, ya asume que hay usuario.
const RoleRoute = ({ allowedRoles = [] }) => {
  const { user } = useAuth()

  if (!allowedRoles.includes(user?.role)) {
    const redirectTo = user?.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'
    return <Navigate to={redirectTo} replace />
  }

  return <Outlet />
}

export default RoleRoute
