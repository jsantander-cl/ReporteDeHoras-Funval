import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import api from '../../../services/api'  // ruta corregida
import Spinner from '../../../components/common/Spinner'
import ModalConfirm from '../../../components/ui/ModalConfirm'
import Pagination from '../../../components/ui/Pagination'

export default function CountriesCrud() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const pageSize = 10

  // Modal y formulario
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCountry, setEditingCountry] = useState(null)
  const [formData, setFormData] = useState({ name: '', code: '' }) // ✅ antes era iso_code
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState(null)

  // Eliminación
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchCountries()
  }, [page])

  useEffect(() => {
    if (searchParams.get('new') === '1') {
      openCreateModal()
      setSearchParams({}, { replace: true })
    }
  }, [])

  const fetchCountries = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get(`/countries/?page=${page}&page_size=${pageSize}`)
      const data = res.data
      setCountries(data.items || data.data || data)
    } catch (err) {
      setError('Error al cargar países')
      toast.error('No se pudo cargar la lista de países')
    } finally {
      setLoading(false)
    }
  }

  const openCreateModal = () => {
    setEditingCountry(null)
    setFormData({ name: '', code: '' }) // ✅ reset con code
    setFormError(null)
    setModalOpen(true)
  }

  const openEditModal = (country) => {
    setEditingCountry(country)
    setFormData({ name: country.name, code: country.code }) // ✅ usa code
    setFormError(null)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingCountry(null)
    setFormError(null)
  }

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setFormError(null)

    const payload = {
      name: formData.name.trim(),
      code: formData.code.trim().toUpperCase(), // ✅ enviamos code, no iso_code
    }

    try {
      if (editingCountry) {
        await api.patch(`/countries/${editingCountry.id}`, payload)
        toast.success('País actualizado correctamente')
      } else {
        await api.post('/countries/', payload)
        toast.success('País creado exitosamente')
      }
      closeModal()
      fetchCountries()
    } catch (err) {
      const msg = err.response?.data?.detail?.[0]?.msg || err.response?.data?.detail || 'Error al guardar'
      setFormError(msg)
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await api.delete(`/countries/${deleteTarget.id}`)
      toast.success(`País "${deleteTarget.name}" eliminado`)
      setDeleteTarget(null)
      fetchCountries()
    } catch (err) {
      toast.error('No se pudo eliminar el país')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <Spinner text="Cargando países..." />
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>

  return (
    <div className="max-w-6xl mx-auto">
      <Toaster position="top-right" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0C2340]">Gestión de Países</h1>
          <p className="text-slate-500 text-sm mt-1">Administra la lista global de países y códigos ISO.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-[#004B93] hover:bg-[#003A73] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold text-sm shadow-sm"
        >
          <Plus className="w-4 h-4" /> Agregar País
        </button>
      </div>

      {/* Tabla de países */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-400 font-bold text-xs uppercase tracking-wider border-b border-slate-200">
              <th className="px-6 py-4">País</th>
              <th className="px-6 py-4">Código ISO (alpha-2)</th> {/* ✅ cambiado */}
              <th className="px-6 py-4 w-20">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {countries.length > 0 ? (
              countries.map((country) => (
                <tr key={country.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-slate-700">{country.name}</td>
                  <td className="px-6 py-4 text-slate-600 font-mono text-sm">{country.code}</td> {/* ✅ antes iso_code */}
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => openEditModal(country)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-[#004B93] hover:bg-slate-100"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(country)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-10 text-slate-400">
                  No hay países registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de formulario */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={closeModal}
              disabled={saving}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-[#0C2340] mb-4">
              {editingCountry ? 'Editar País' : 'Nuevo País'}
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#004B93]/20"
                  placeholder="Ej. México"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Código ISO (2 letras) {/* ✅ etiqueta corregida */}
                </label>
                <input
                  type="text"
                  name="code" // ✅ antes era iso_code
                  value={formData.code}
                  onChange={handleFormChange}
                  required
                  maxLength={2} // ✅ solo 2 caracteres
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#004B93]/20 uppercase"
                  placeholder="Ej. MX"
                />
              </div>

              {formError && (
                <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">{formError}</div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
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
                  {saving ? 'Guardando...' : editingCountry ? 'Actualizar' : 'Crear País'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal confirmación eliminar */}
      <ModalConfirm
        isOpen={!!deleteTarget}
        title="Eliminar País"
        message={`¿Estás seguro de que deseas eliminar "${deleteTarget?.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Sí, Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  )
}