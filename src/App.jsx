//📌 Enrutador centralizado con react-router-dom y envoltura de contextos

// (MIGUEL) import FormularioReporte from './components/FormularioReporte';
//(ROLANDO)
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Login from './pages/shared/Login'
import StudentDashboard from './pages/student/StudentDashboard'
import Spinner from './components/common/Spinner'
//(JORDAN)
import React from 'react';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  const { user, isLoading } = useAuth()

  // ✅ Pantalla de carga mientras verifica la sesión
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Spinner size="lg" text="Verificando sesión..." />
      </div>
    )
  }

  return (
    <Routes>
      {/* Ruta pública - Login */}
      <Route path="/login" element={<Login />} />
      
      {/* Dashboard del Estudiante */}
      <Route 
        path="/student/dashboard" 
        element={
          user ? (
            user.role === 'STUDENT' ? (
              <StudentDashboard />
            ) : (
              <Navigate to="/admin/dashboard" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      
      {/* Dashboard del Admin (placeholder por ahora) */}
      <Route 
        path="/admin/dashboard" 
        element={
          user ? (
            user.role === 'ADMIN' ? (
              <div className="p-8">
                <h1 className="text-2xl font-bold">Dashboard Admin</h1>
                <p className="text-gray-600 mt-2">Próximamente...</p>
              </div>
            ) : (
              <Navigate to="/student/dashboard" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      
      {/* Ruta raíz: redirige según el rol */}
      <Route 
        path="/" 
        element={
          user ? (
            user.role === 'ADMIN' ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <Navigate to="/student/dashboard" replace />
            )
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
            user.role === 'ADMIN' ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <Navigate to="/student/dashboard" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
    </Routes>
  )
}

export default App