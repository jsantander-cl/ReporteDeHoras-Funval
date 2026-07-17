//📂 FASE 5: MÓDULO DE ADMINISTRACIÓN
//📌 Tarea 19: Gestión de Categorías (CRUD completo con toasts)

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../../services/api' 
import Spinner from '../../../components/common/Spinner'

export default function CategoriesCrud() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Estado para alertas
  const [toastMessage, setToastMessage] = useState(null)
  const [toastType, setToastType] = useState('success') 

  // Estados del Modal (Crear o Editar)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [categoryName, setCategoryName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Función para mostrar alertas temporales 
  const showToast = (message, type = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setTimeout(() => {
      setToastMessage(null)
    }, 4000) 
  }

  // 1. Listado: GET 
  const fetchCategories = async () => {
    try {
      setLoading(true)
      const res = await api.get('/categories/')
      setCategories(res.data)
    } catch (err) {
      console.error(err)
      showToast('Error al cargar las categorías', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // Abrir modal para Crear
  const handleOpenCreate = () => {
    setIsEditing(false)
    setSelectedId(null)
    setCategoryName('')
    setIsModalOpen(true)
  }

  // Abrir modal para Editar
  const handleOpenEdit = (category) => {
    setIsEditing(true)
    setSelectedId(category.id)
    setCategoryName(category.name)
    setIsModalOpen(true)
  }

  // Crear (POST) y Editar (PATCH)
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!categoryName.trim()) return

    try {
      setSubmitting(true)
      if (isEditing) {
        // PATCH /api/v1/categories/{id}
        await api.patch(`/categories/${selectedId}`, { name: categoryName })
        showToast('Categoría actualizada con éxito')
      } else {
        // POST /api/v1/categories/
        await api.post('/categories/', { name: categoryName })
        showToast('Categoría creada con éxito')
      }
      setIsModalOpen(false)
      fetchCategories()
    } catch (err) {
      console.error(err)
      const errMsg = err.response?.data?.detail || 'Ocurrió un error en la operación'
      showToast(errMsg, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  // 4. Eliminar (soft-delete): DELETE /api/v1/categories/{id}
  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(`¿Estás seguro de que deseas eliminar la categoría "${name}"?`)
    if (!confirmDelete) return

    try {
      await api.delete(`/categories/${id}`)
      showToast('Categoría eliminada con éxito')
      fetchCategories()
    } catch (err) {
      console.error(err)
      const errMsg = err.response?.data?.detail || 'Error al eliminar la categoría'
      showToast(errMsg, 'error')
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 relative">
      
      {/* Sistema Toast Flotante */}
      {toastMessage && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-sm font-semibold transition-all duration-300 transform translate-y-0 ${
          toastType === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          <span>{toastType === 'success' ? '✅' : '❌'}</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Cabecera */}
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

      {/* Listado */}
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
                    <button
                      onClick={() => handleDelete(category.id, category.name)}
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

      {/* Modal Modular de Registro / Edición */}
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

    </div>
  )
}