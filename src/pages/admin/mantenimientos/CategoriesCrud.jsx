import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../../services/api' 
import Spinner from '../../../components/common/Spinner'
import ModalConfirm from '../../../components/ui/ModalConfirm'

export default function CategoriesCrud() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  // Estados del Modal (Crear o Editar)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [categoryName, setCategoryName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Estado del modal de confirmación de borrado
  const [deleteTarget, setDeleteTarget] = useState(null) // { id, name }
  const [deleting, setDeleting] = useState(false)

  /* 
   * CLAVE 1: Lectura de Datos (READ).
   * Consumimos de manera asíncrona el endpoint `/categories/` para poblar el 
   * listado de categorías. Incluimos estados de carga y manejo semántico de errores.
   */
  const fetchCategories = async () => {
    try {
      setLoading(true)
      const res = await api.get('/categories/')
      setCategories(res.data)
    } catch (err) {
      console.error(err)
      toast.error('Error al cargar las categorías')
    } finally {
      setLoading(false)
    }
  }

  // Efecto de inicialización al montar la vista
  useEffect(() => {
    fetchCategories()
  }, [])

  // Inicializa el modal en estado de creación libre de datos residuales
  const handleOpenCreate = () => {
    setIsEditing(false)
    setSelectedId(null)
    setCategoryName('')
    setIsModalOpen(true)
  }

  // Carga los datos de la categoría seleccionada en el formulario del modal para su edición
  const handleOpenEdit = (category) => {
    setIsEditing(true)
    setSelectedId(category.id)
    setCategoryName(category.name)
    setIsModalOpen(true)
  }

  /* 
   * CLAVE 2: Flujo Híbrido de Escritura (CREATE / UPDATE).
   * Un único manejador procesa las solicitudes POST o PATCH según el estado `isEditing`:
   * - Si está editando: Envía un PATCH al recurso específico `/categories/{id}`.
   * - Si es nueva: Envía un POST al endpoint raíz `/categories/`.
   * En ambos casos se valida la entrada en cliente y se refresca la tabla al finalizar con éxito.
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!categoryName.trim()) return

    try {
      setSubmitting(true)
      if (isEditing) {
        // PATCH /api/v1/categories/{id}
        await api.patch(`/categories/${selectedId}`, { name: categoryName })
        toast.success('Categoría actualizada con éxito')
      } else {
        // POST /api/v1/categories/
        await api.post('/categories/', { name: categoryName })
        toast.success('Categoría creada con éxito')
      }
      setIsModalOpen(false)
      fetchCategories() // Sincronización del estado de la tabla
    } catch (err) {
      console.error(err)
      const errMsg = err.response?.data?.detail || 'Ocurrió un error en la operación'
      toast.error(errMsg)
    } finally {
      setSubmitting(false)
    }
  }

  /* 
   * CLAVE 3: Remoción Segura de Recursos (DELETE / SOFT-DELETE).
   * Consumo asíncrono del endpoint DELETE `/categories/{id}` para dar de baja el registro.
   * Se integra con el modal de confirmación (`ModalConfirm`) para prevenir ejecuciones accidentales,
   * garantizando una experiencia de usuario (UX) segura y fluida.
   */
  const confirmDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await api.delete(`/categories/${deleteTarget.id}`)
      toast.success('Categoría eliminada con éxito')
      setDeleteTarget(null) // Cierra el modal de confirmación
      fetchCategories() // Sincronización del estado de la tabla
    } catch (err) {
      console.error(err)
      const errMsg = err.response?.data?.detail || 'Error al eliminar la categoría'
      toast.error(errMsg)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 relative">

      {/* Cabecera del Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <button 
            onClick={() => navigate('/admin/maintenance')}
            className="text-xs font-bold text-slate-500 hover:text-[#004B93] transition-colors mb-2 flex items-center gap-1"
          >
            ← Volver a Mantenimiento
          </button>
          <h1 className="text-3xl font-extrabold text-[#004B93]">Categorías</h1>
          <p className="text-xs text-slate-500">Administra las etiquetas y clasificaciones de horas de servicio.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 bg-[#004B93] hover:bg-[#003870] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 self-start md:self-auto"
        >
          <span>+</span> Nueva Categoría
        </button>
      </div>

      {/* Tabla Dinámica con estados alternativos */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center">
          <Spinner size="lg" text="Cargando categorías..." />
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white border border-slate-100 p-12 text-center rounded-3xl shadow-sm">
          <p className="text-sm text-slate-500">No se encontraron categorías registradas.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">ID</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Nombre de Categoría</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-500 font-medium">#{category.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-800 font-semibold">{category.name}</td>
                  <td className="px-6 py-4 text-sm text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(category)}
                      className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-lg transition-all"
                    >
                      Editar
                    </button>
                    {/* Botón para abrir modal de confirmación de borrado */}
                    <button
                      onClick={() => setDeleteTarget({ id: category.id, name: category.name })}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg transition-all"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CLAVE 4: Modal Único Multipropósito (Formulario de Creación / Edición)
       * Reutilizamos la misma estructura visual controlando los títulos y textos con la variable `isEditing`.
       * El envío del formulario se delega al submit unificado de React.
       */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-xl border border-slate-100 overflow-hidden transform transition-all">
            <div className="p-6 border-b border-slate-50">
              <h2 className="text-xl font-bold text-[#004B93]">
                {isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {isEditing ? 'Modifica el nombre de la categoría elegida.' : 'Define el nombre para la nueva clasificación de horas.'}
              </p>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Nombre de Categoría *
                  </label>
                  <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="Ej. Tutorías, Visita al templo..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    required
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-[#004B93] hover:bg-[#003870] text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50"
                >
                  {submitting ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Reutilizable de Confirmación de Borrado */}
      <ModalConfirm
        isOpen={!!deleteTarget}
        title="¿Eliminar Categoría?"
        message={deleteTarget && `¿Estás seguro de que deseas eliminar la categoría "${deleteTarget.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Sí, Eliminar Categoría"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

    </div>
  )
}