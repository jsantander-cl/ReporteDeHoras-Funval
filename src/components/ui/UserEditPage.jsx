import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'

export default function UserEditPage() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  // Datos del usuario enviados desde la lista
  const userFromState = location.state?.user

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    role: 'STUDENT',
    is_active: true,
    password: '',
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')

  // Inicializar formulario con los datos pasados desde la lista
  useEffect(() => {
    if (!userFromState) {
      // Si no vino en el estado, redirigir a la lista
      navigate('/admin/users', { replace: true })
      return
    }
    setFormData({
      full_name: userFromState.full_name || '',
      email: userFromState.email || '',
      role: userFromState.role || 'STUDENT',
      is_active: typeof userFromState.is_active === 'boolean' ? userFromState.is_active : true,
      password: '',
    })
  }, [userFromState, navigate])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccessMsg('')

    const payload = {
      full_name: formData.full_name,
      email: formData.email,
      role: formData.role,
      is_active: formData.is_active,
    }
    if (formData.password.trim() !== '') {
      payload.password = formData.password
    }

    try {
      const res = await fetch(`/api/v1/users/${userId}`, {
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        const msg = errData.detail?.[0]?.msg || errData.detail || 'Error al actualizar'
        throw new Error(msg)
      }
      setSuccessMsg('Usuario actualizado correctamente.')
      setTimeout(() => {
        navigate('/admin/users')
      }, 1500)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  // Si no hay datos de usuario (y ya redirigió), no renderizar nada
  if (!userFromState) {
    return null
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate('/admin/users')}
        className="text-slate-500 hover:text-[#004B93] flex items-center gap-2 mb-6 text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Volver a la lista
      </button>

      <h1 className="text-3xl font-extrabold text-[#0C2340] mb-2">Editar Usuario</h1>
      <p className="text-slate-500 text-sm mb-8">Modifica los datos del usuario seleccionado.</p>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
        {/* Nombre completo */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nombre completo</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#004B93]/20"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Correo electrónico</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#004B93]/20"
          />
        </div>

        {/* Rol */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Rol</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#004B93]/20"
          >
            <option value="STUDENT">Estudiante</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>

        {/* Estado activo/inactivo */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="is_active"
            id="is_active"
            checked={formData.is_active}
            onChange={handleChange}
            className="w-4 h-4 text-[#004B93] border-slate-300 rounded focus:ring-[#004B93]/20"
          />
          <label htmlFor="is_active" className="text-sm font-medium text-slate-700">Usuario activo</label>
        </div>

        {/* Contraseña (opcional) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Nueva contraseña <span className="text-slate-400 font-normal">(dejar en blanco para no cambiarla)</span>
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            minLength={6}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#004B93]/20"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">{error}</div>
        )}
        {successMsg && (
          <div className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium">{successMsg}</div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/admin/users')}
            disabled={saving}
            className="px-5 py-2.5 border border-slate-300 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-[#004B93] hover:bg-[#003A73] text-white rounded-xl text-sm font-medium flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  )
}