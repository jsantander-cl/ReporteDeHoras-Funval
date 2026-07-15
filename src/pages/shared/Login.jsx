import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../hooks/useAuth'
import Button from '../../components/common/Button'
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle, Building2 } from 'lucide-react'
import toast from 'react-hot-toast'

const Login = () => {
  const { login, user, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [serverError, setServerError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()

  // ✅ Redirección cuando el usuario ya está autenticado
  useEffect(() => {
    if (!isLoading && user) {
      // Determinar a dónde redirigir según el rol
      const redirectTo = user.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'
      navigate(redirectTo, { replace: true })
    }
  }, [user, isLoading, navigate])

  const onSubmit = async (data) => {
    setServerError('')
    
    const result = await login(data.email, data.password)
    
    if (result.success) {
      toast.success('¡Inicio de sesión exitoso!')
      // La redirección la manejará el useEffect de arriba cuando 'user' cambie
    } else {
      setServerError(result.error)
      toast.error(result.error)
    }
  }

  // ✅ Mostrar loading mientras verifica sesión
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  // ✅ Si ya está autenticado, no mostrar el formulario
  if (user) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 relative overflow-hidden">
      
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Tarjeta Principal */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 relative z-10 overflow-hidden">
        
        {/* Barra de acento superior */}
        <div className="h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

        <div className="p-8 sm:p-10">
          {/* Encabezado */}
          <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 mb-4">
              <img 
                src="/img/logoFunval.png" 
                alt="Logo Funval" 
                className="h-full w-auto object-contain" 
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Funval Internacional</h1>
            <p className="text-sm text-gray-500 mt-2">Sistema de Gestión de Horas de Servicio</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Campo Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="usuario@funval.com"
                  className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:bg-white ${
                    errors.email 
                      ? 'border-red-300 focus:ring-red-200 focus:border-red-500' 
                      : 'border-gray-200 focus:ring-blue-200 focus:border-blue-500'
                  }`}
                  {...register('email', {
                    required: 'El email es obligatorio',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Formato de email inválido'
                    }
                  })}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.email.message}
                </p>
              )}
            </div>

            {/* Campo Contraseña */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 bg-gray-50 border rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:bg-white ${
                    errors.password 
                      ? 'border-red-300 focus:ring-red-200 focus:border-red-500' 
                      : 'border-gray-200 focus:ring-blue-200 focus:border-blue-500'
                  }`}
                  {...register('password', {
                    required: 'La contraseña es obligatoria',
                    minLength: { value: 8, message: 'Mínimo 8 caracteres' }
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.password.message}
                </p>
              )}
            </div>

            {/* Mensaje de Error del Servidor */}
            {serverError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{serverError}</p>
              </div>
            )}

            {/* Botón de Submit */}
            <Button 
              type="submit" 
              loading={isSubmitting} 
              className="w-full py-2.5 text-base font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Iniciar sesión
            </Button>
          </form>

          {/* Caja de Credenciales de Prueba */}
          <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 text-center">
              Credenciales de Prueba
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2 bg-white rounded-md border border-slate-100">
                <span className="font-medium text-slate-700">Administrador</span>
                <span className="text-slate-500 font-mono">admin@funval.com / 1234567890</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded-md border border-slate-100">
                <span className="font-medium text-slate-700">Estudiante</span>
                <span className="text-slate-500 font-mono">student@funval.com / 12345678</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login