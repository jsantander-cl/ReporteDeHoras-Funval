import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Spinner from './components/common/Spinner'

import PrivateRoute from './components/routes/PrivateRoute'
import RoleRoute from './components/routes/RoleRoute'
import EstructuraPrincipal from './components/design/EstructuraPrincipal'

import ReportDetail from './pages/student/ReportDetail'
import MyReports from './pages/student/MyReports'

// Páginas
import Login from './pages/shared/Login'
import StudentDashboard from './pages/student/StudentDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminReportsPage from './pages/admin/AdminReportsPage'
import UsersListPage from './pages/admin/UsersListPage'
import MantenimientoGlobal from './pages/admin/mantenimientos/MantenimientoGlobal'
import InDebtStudentsPage from './pages/admin/InDebtStudentsPage'
import FormularioReporte from './components/FormularioReporte'
import EditReportPage from './pages/estudiante/EditReportPage'
import CategoriesCrud from './pages/admin/mantenimientos/CategoriesCrud'
import CountriesCrud from './pages/admin/mantenimientos/CountriesCrud'
import CoursesCrud from './pages/admin/mantenimientos/CoursesCrud'
import ChangePasswordPage from './pages/perfil/ChangePasswordPage'
import UserEditPage from './components/ui/UserEditPage'

function App() {
  const { user, isLoading } = useAuth()
  

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Spinner size="lg" text="Verificando sesión..." />
      </div>
    )
  }

  return (
    <Routes>
      {/* Ruta pública */}
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'} replace />
          ) : (
            <Login />
          )
        }
      />

      {/* Todo lo privado vive dentro de PrivateRoute > EstructuraPrincipal */}
      <Route element={<PrivateRoute />}>
        <Route element={<EstructuraPrincipal />}>

          {/* Nueva ruta de cambio de contraseña */}
          <Route path="/cambiar-contrasena" element={<ChangePasswordPage />} />

          {/* Solo STUDENT */}
          <Route element={<RoleRoute allowedRoles={['STUDENT']} />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />

            <Route path="/student/reports" element={<MyReports />} />
            <Route path="/student/reports/:id" element={<ReportDetail />} />
            <Route path="/student/reports/:id/edit" element={<EditReportPage />} />

            {/* ruta del formulario aquí */}
            <Route path="/student/reports/new" element={<FormularioReporte />} />
          </Route>

          {/* Solo ADMIN */}
          <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/reports" element={<AdminReportsPage />} />
            <Route path="/admin/reports/in-debt" element={<InDebtStudentsPage />} />
            <Route path="/admin/users" element={<UsersListPage />} />
            <Route path="/admin/maintenance" element={<MantenimientoGlobal />} />
            <Route path="/admin/maintenance/categories" element={<CategoriesCrud />} />
            <Route path="/admin/users/:userId/edit" element={<UserEditPage />} />
            <Route path="/admin/maintenance/countries" element={<CountriesCrud />} />
            <Route path="/admin/maintenance/courses" element={<CoursesCrud />} />
          </Route>
          

        </Route>
      </Route>

      {/* Raíz: redirige según sesión/rol */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Fallback */}
      <Route
        path="*"
        element={
          user ? (
            <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  )
}

export default App