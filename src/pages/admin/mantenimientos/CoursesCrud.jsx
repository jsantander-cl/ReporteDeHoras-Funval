import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import api from '../../../services/api'  // ajusta la ruta si es necesario
import Spinner from '../../../components/common/Spinner'
import ModalConfirm from '../../../components/ui/ModalConfirm'
import Pagination from '../../../components/ui/Pagination'

export default function CoursesCrud() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const pageSize = 10

  // Modal y formulario
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [formData, setFormData] = useState({ name: '', duration: '', price: '' })
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState(null)

  // Eliminación (soft-delete)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchCourses()
  }, [page])

  useEffect(() => {
    if (searchParams.get('new') === '1') {
      openCreateModal()
      setSearchParams({}, { replace: true })
    }
  }, [])

  const fetchCourses = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get(`/courses/?page=${page}&page_size=${pageSize}`)
      const data = res.data
      setCourses(data.items || data.data || data)
    } catch (err) {
      setError('Error al cargar cursos')
      toast.error('No se pudo cargar la lista de cursos')
    } finally {
      setLoading(false)
    }
  }

  const openCreateModal = () => {
    setEditingCourse(null)
    setFormData({ name: '', duration: '', price: '' })
    setFormError(null)
    setModalOpen(true)
  }

  const openEditModal = (course) => {
    setEditingCourse(course)
    setFormData({
      name: course.name || '',
      duration: course.duration?.toString() || '',
      price: course.price?.toString() || '',
    })
    setFormError(null)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingCourse(null)
    setFormError(null)
  }

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setFormError(null)

    // Preparamos payload: duration y price deben ser números
    const payload = {
      name: formData.name.trim(),
      duration: parseInt(formData.duration, 10) || 0,
      price: parseFloat(formData.price) || 0,
    }

    try {
      if (editingCourse) {
        await api.patch(`/courses/${editingCourse.id}`, payload)
        toast.success('Curso actualizado correctamente')
      } else {
        await api.post('/courses/', payload)
        toast.success('Curso creado exitosamente')
      }
      closeModal()
      fetchCourses()
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
      // Soft-delete: simplemente se elimina y el backend lo marca como inactivo
      await api.delete(`/courses/${deleteTarget.id}`)
      toast.success(`Curso "${deleteTarget.name}" eliminado`)
      setDeleteTarget(null)
      fetchCourses()
    } catch (err) {
      toast.error('No se pudo eliminar el curso')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <Spinner text="Cargando cursos..." />
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>

  return (
    <div className="max-w-6xl mx-auto">
      <Toaster position="top-right" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0C2340]">Gestión de Cursos</h1>
          <p className="text-slate-500 text-sm mt-1">
            Administra los programas académicos, duración y precio.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-[#004B93] hover:bg-[#003A73] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold text-sm shadow-sm"
        >
          <Plus className="w-4 h-4" /> Agregar Curso
        </button>
      </div>

      {/* Tabla de cursos */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-400 font-bold text-xs uppercase tracking-wider border-b border-slate-200">
              <th className="px-6 py-4">Curso</th>
              <th className="px-6 py-4">Duración</th>
              <th className="px-6 py-4">Precio</th>
              <th className="px-6 py-4 w-20">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {courses.length > 0 ? (
              courses.map((course) => (
                <tr key={course.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-slate-700">{course.name}</td>
                  <td className="px-6 py-4 text-slate-600">{course.duration ?? '—'}</td>
                  <td className="px-6 py-4 text-slate-600">${course.price ?? '—'}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => openEditModal(course)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-[#004B93] hover:bg-slate-100"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(course)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-10 text-slate-400">
                  No hay cursos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación (si el total viene en la respuesta) */}
      {/* <Pagination page={page} pageSize={pageSize} total={data.total} onPageChange={setPage} /> */}

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
              {editingCourse ? 'Editar Curso' : 'Nuevo Curso'}
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
                  placeholder="Ej. Desarrollo Web"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Duración (horas)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleFormChange}
                  required
                  min="1"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#004B93]/20"
                  placeholder="Ej. 120"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Precio</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleFormChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#004B93]/20"
                  placeholder="Ej. 250.00"
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
                  {saving ? 'Guardando...' : editingCourse ? 'Actualizar' : 'Crear Curso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal confirmación eliminar */}
      <ModalConfirm
        isOpen={!!deleteTarget}
        title="Eliminar Curso"
        message={`¿Estás seguro de que deseas eliminar "${deleteTarget?.name}"? Esta acción es reversible solo por administradores.`}
        confirmLabel="Sí, Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  )
}