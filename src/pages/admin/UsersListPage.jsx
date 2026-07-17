import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Search, Filter, Upload, Pencil, Trash2, Plus, UserPlus, Download } from 'lucide-react'
import toast from 'react-hot-toast'

import ModalConfirm from '../../components/ui/ModalConfirm'
import Pagination from '../../components/ui/Pagination'
import Spinner from '../../components/common/Spinner'
import { useFetch } from '../../hooks/useFetch'
import api from '../../services/api'

import Input from '../../components/common/Input'
import Modal from '../../components/common/Modal'
import Button from '../../components/common/Button'


export default function UsersListPage() {
  const navigate = useNavigate()

  // Estados de búsqueda y paginación
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [reloadFlag, setReloadFlag] = useState(0)

  // Estados del Modal de Creación
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      role: 'STUDENT',
      middle_name: '',
      second_lastname: '',
      phone_number: '',
      birthdate: '',
      country_id: '',
      course_id: ''
    }
  })

  // Fetch de datos auxiliares para los selects
  const { data: countriesData } = useFetch('/countries/')
  const { data: coursesData } = useFetch('/courses/')
  const countries = countriesData || []
  const courses = coursesData || []

  // Estados para importación CSV
  const [importResult, setImportResult] = useState(null) // { created, skipped, errors }
  const [importing, setImporting] = useState(false)
  const [importError, setImportError] = useState(null)

  const fileInputRef = useRef(null)

  // Debounce del input de búsqueda
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Llamada a la API de usuarios
  const url = `/users/?page=${page}&page_size=${pageSize}&search=${encodeURIComponent(debouncedSearch)}&_=${reloadFlag}`
  const { data, loading, error, refetch } = useFetch(url)

  const [selectedUser, setSelectedUser] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Estados del panel de Filtros Avanzados
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [roleFilter, setRoleFilter] = useState('ALL') // ALL | ADMIN | STUDENT
  const [statusFilter, setStatusFilter] = useState('ALL') // ALL | ACTIVE | INACTIVE
  const filterPanelRef = useRef(null)

  // Cerrar el panel de filtros al hacer click fuera de él
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterPanelRef.current && !filterPanelRef.current.contains(e.target)) {
        setIsFilterOpen(false)
      }
    }
    if (isFilterOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isFilterOpen])

  const activeFilterCount = (roleFilter !== 'ALL' ? 1 : 0) + (statusFilter !== 'ALL' ? 1 : 0)

  const clearFilters = () => {
    setRoleFilter('ALL')
    setStatusFilter('ALL')
  }


  // --- FUNCIONES DEL MODAL DE CREACIÓN ---
  const openModal = () => {
    reset({
      role: 'STUDENT',
      middle_name: '',
      second_lastname: '',
      phone_number: '',
      birthdate: '',
      country_id: '',
      course_id: ''
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    reset()
  }

  const handleCreate = async (formData) => {
    try {
      const payload = {
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        document_number: formData.document_number,
        role: formData.role,
        password: formData.document_number, // Requerido por el backend
        middle_name: formData.middle_name || null,
        second_lastname: formData.second_lastname || null,
        phone_number: formData.phone_number || null,
        birthdate: formData.birthdate || null,
        country_id: formData.country_id ? Number(formData.country_id) : null,
        course_id: formData.course_id ? Number(formData.course_id) : null,
      }

      await api.post('/users/', payload)
      toast.success('Usuario creado correctamente')
      closeModal()
      setReloadFlag(prev => prev + 1) // Recargar la lista

    } catch (err) {
      const detail = err.response?.data?.detail
      const errorMsg = Array.isArray(detail)
        ? detail.map(d => `${d.loc?.join('.')}: ${d.msg}`).join(' | ')
        : (typeof detail === 'string' ? detail : 'Error al crear el usuario')
      toast.error(errorMsg, { duration: 8000 })
    }
  }

  // --- FUNCIONES DE ELIMINACIÓN ---
  const users = data?.items || data?.data || data || []
  const totalUsers = data?.total || users.length

  const triggerDelete = (user) => {
    setSelectedUser(user)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedUser) return
    setDeleting(true)
    try {
      // Usamos api en lugar de fetch para mantener la cookie de sesión
      await api.delete(`/users/${selectedUser.id}`)
      toast.success('Usuario eliminado correctamente')
      setIsDeleteModalOpen(false)
      setSelectedUser(null)
      setReloadFlag(prev => prev + 1)
    } catch (err) {
      const detail = err.response?.data?.detail
      const msg = Array.isArray(detail) ? detail.map(d => d.msg).join(', ') : detail
      toast.error(msg || 'Error al eliminar usuario')
    } finally {
      setDeleting(false)
    }
  }

  // --- IMPORTACIÓN CSV ---
  // 📤 Procesar archivo CSV seleccionado
  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Limpiar resultados anteriores
    setImportResult(null)
    setImportError(null)
    setImporting(true)

    try {
      const formData = new FormData()
      formData.append('file', file) // el backend espera un campo 'file'

      const res = await api.post('/users/bulk', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      const result = res.data
      // Se espera un objeto del tipo: { created: 5, skipped: 2, errors: [...] }
      setImportResult({
        created: result.created || 0,
        skipped: result.skipped || 0,
        errors: result.errors || [],
      })
      setReloadFlag(prev => prev + 1) // refrescar lista
    } catch (err) {
      const detail = err.response?.data?.detail
      const msg = Array.isArray(detail) ? detail.map(d => d.msg).join(', ') : detail
      setImportError(msg || 'Error al procesar el archivo CSV')
    } finally {
      setImporting(false)
      // Resetear el input para permitir volver a seleccionar el mismo archivo
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // --- HELPERS ---
  // 📥 Descargar plantilla CSV de ejemplo
  const downloadTemplate = () => {
    const headers = ['email', 'first_name', 'last_name', 'document_number', 'role']
    const sampleRow = ['usuario@ejemplo.com', 'Nombre', 'Apellido', '12345678', 'STUDENT']
    const csvContent = [headers.join(','), sampleRow.join(',')].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'plantilla_usuarios.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Helpers para formatear datos
  const getInitials = (fullName) => {
    if (!fullName) return '?'
    return fullName.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
  }

  const formatDate = (dateString) => {
    if (!dateString) return '—'
    try {
      return new Date(dateString).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
    } catch {
      return dateString.slice(0, 10)
    }
  }

  const getUserStatus = (user) => {
    if (typeof user.is_active === 'boolean') return user.is_active ? 'Activo' : 'Inactivo'
    if (user.status) return user.status === 'active' ? 'Activo' : 'Inactivo'
    return 'Activo'
  }

  // --- FILTRADO EN CLIENTE ---
  // Se aplica siempre como respaldo, ya que el backend puede ignorar
  // el parámetro "search" o no soportar filtros de rol/estado.
  const normalize = (str) => (str || '').toString().toLowerCase().trim()

  const filteredUsers = users.filter((user) => {
    const name = user.full_name || user.name || ''
    const email = user.email || ''
    const role = user.role || 'STUDENT'
    const status = getUserStatus(user)

    const query = normalize(debouncedSearch)
    const matchesSearch = query === ''
      || normalize(name).includes(query)
      || normalize(email).includes(query)

    const matchesRole = roleFilter === 'ALL' || role === roleFilter
    const matchesStatus = statusFilter === 'ALL'
      || (statusFilter === 'ACTIVE' && status === 'Activo')
      || (statusFilter === 'INACTIVE' && status === 'Inactivo')

    return matchesSearch && matchesRole && matchesStatus
  })

  if (loading && users.length === 0) return <Spinner text="Cargando usuarios..." />
  if (error) return (
    <div className="max-w-6xl mx-auto py-8 text-center text-red-500 font-bold">
      Error al cargar usuarios: {error}
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0C2340]">Gestión de Usuarios</h1>
          <p className="text-slate-500 text-sm mt-1">Administra y organiza los accesos de la plataforma institucional.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current.click()}
            disabled={importing}
            className="border border-[#004B93] text-[#004B93] px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold text-sm hover:bg-slate-50 disabled:opacity-50"
          >
            <Upload className="w-4 h-4" /> {importing ? 'Importando...' : 'Importación Masiva (CSV)'}
          </button>
          <button
            onClick={downloadTemplate}
            className="border border-slate-200 bg-white text-slate-600 px-4 py-2.5 rounded-xl flex items-center gap-2 font-semibold text-sm hover:bg-slate-50"
          >
            <Download className="w-4 h-4" /> Plantilla CSV
          </button>
          <Button onClick={openModal}>
            <Plus className="w-4 h-4 mr-1" /> Nuevo Usuario
          </Button>
        </div>
      </section>

      {/* Banner de resultado de importación */}
      {(importResult || importError) && (
        <div className={`text-xs font-semibold px-4 py-3 rounded-xl flex items-center justify-between ${
          importError ? 'bg-red-50 border border-red-200 text-red-800' : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
        }`}>
          {importError ? (
            <span>Error: {importError}</span>
          ) : (
            <span>
              Importación completada: <strong>{importResult.created} creado(s)</strong>
              {importResult.skipped > 0 && `, ${importResult.skipped} omitido(s)`}
              {importResult.errors?.length > 0 && ` (${importResult.errors.length} error(es))`}
            </span>
          )}
          <button onClick={() => { setImportResult(null); setImportError(null) }} className="hover:underline">Cerrar</button>
        </div>
      )}

      {/* Búsqueda y filtro */}
      <section className="flex flex-col md:flex-row gap-3">
        <div className="w-full md:flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
            placeholder="Buscar por nombre o email..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#004B93]/20 text-sm shadow-sm"
          />
        </div>
        <div className="relative" ref={filterPanelRef}>
          <button
            onClick={() => setIsFilterOpen((prev) => !prev)}
            className={`border px-4 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-sm transition-colors ${
              activeFilterCount > 0
                ? 'border-[#004B93] bg-[#E6F0FA] text-[#004B93]'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-4 h-4" /> Filtrar
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#004B93] text-white text-[10px] font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-20">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-slate-700 text-sm">Filtros Avanzados</h4>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="text-xs text-[#004B93] font-semibold hover:underline">
                    Limpiar
                  </button>
                )}
              </div>

              {/* Filtro por Rol */}
              <div className="mb-4">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-2">Rol</p>
                <div className="flex flex-col gap-2">
                  {[
                    { value: 'ALL', label: 'Todos' },
                    { value: 'ADMIN', label: 'Admin' },
                    { value: 'STUDENT', label: 'Student' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setRoleFilter(opt.value)}
                      className={`text-left text-sm px-3 py-2 rounded-lg border font-semibold transition-colors ${
                        roleFilter === opt.value
                          ? 'border-[#004B93] bg-[#E6F0FA] text-[#004B93]'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtro por Estado */}
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-2">Estado</p>
                <div className="flex flex-col gap-2">
                  {[
                    { value: 'ALL', label: 'Todos' },
                    { value: 'ACTIVE', label: 'Activos' },
                    { value: 'INACTIVE', label: 'Inactivos' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setStatusFilter(opt.value)}
                      className={`text-left text-sm px-3 py-2 rounded-lg border font-semibold transition-colors ${
                        statusFilter === opt.value
                          ? 'border-[#004B93] bg-[#E6F0FA] text-[#004B93]'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Lista de usuarios */}
      <div className="flex flex-col gap-3">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => {
            const status = getUserStatus(user)
            const initials = getInitials(user.full_name || user.name)
            const name = user.full_name || user.name || 'Sin nombre'
            const email = user.email || '—'
            const role = user.role || 'STUDENT'
            const regDate = formatDate(user.created_at || user.registration_date)

            return (
              <div
                key={user.id}
                className={`bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:grid md:grid-cols-12 md:items-center gap-4 shadow-sm transition-all ${
                  status === 'Inactivo' ? 'opacity-70' : ''
                }`}
              >
                <div className="md:col-span-5 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-base ${
                    role === 'ADMIN' ? 'bg-[#E6F0FA] text-[#004B93]' : 'bg-[#F1F5F9] text-slate-500'
                  }`}>
                    {initials}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-700 text-sm">{name}</h3>
                    <p className="text-slate-400 text-xs mt-0.5">{email}</p>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-extrabold ${
                    role === 'ADMIN' ? 'bg-[#E6F0FA] text-[#004B93]' : 'bg-[#F1F5F9] text-slate-500'
                  }`}>{role}</span>
                </div>
                <div className="md:col-span-2 flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <span className={`w-2 h-2 rounded-full ${status === 'Activo' ? 'bg-[#10B981]' : 'bg-slate-400'}`}></span>
                  {status}
                </div>
                <div className="md:col-span-2 text-slate-400 text-xs font-semibold">Reg: {regDate}</div>
                <div className="md:col-span-1 flex justify-end gap-2">
                  <button
                    onClick={() => navigate(`/admin/users/${user.id}/edit`, { state: { user } })}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-[#004B93] hover:bg-slate-100 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => triggerDelete(user)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })
        ) : (
          <div className="py-12 text-center text-slate-400 bg-white rounded-xl shadow-sm border border-slate-200">
            No se encontraron usuarios.
          </div>
        )}
      </div>

      {/* Paginación */}
      <Pagination
        page={page}
        pageSize={pageSize}
        total={totalUsers}
        onPageChange={setPage}
      />

      {/* Modal de Confirmación de Eliminación */}
      <ModalConfirm
        isOpen={isDeleteModalOpen}
        title="¿Eliminar Usuario?"
        message={selectedUser && `¿Estás seguro de que deseas eliminar a ${selectedUser.full_name || selectedUser.name}? Esta acción no se puede deshacer.`}
        confirmLabel="Sí, Eliminar Usuario"
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        loading={deleting}
      />

      {/* 👇 MODAL DE CREACIÓN DE USUARIO 👇 */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Nuevo Usuario" size="lg">
        <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">

          {/* Nombres */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Nombre *" {...register('first_name', { required: 'Obligatorio' })} error={errors.first_name?.message} />
            <Input label="Apellido *" {...register('last_name', { required: 'Obligatorio' })} error={errors.last_name?.message} />
            <Input label="Segundo Nombre" {...register('middle_name')} />
            <Input label="Segundo Apellido" {...register('second_lastname')} />
          </div>

          {/* Datos principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email (@funval.com) *"
              type="email"
              {...register('email', {
                required: 'Obligatorio',
                pattern: { value: /^[A-Z0-9._%+-]+@funval\.com$/i, message: 'Debe ser @funval.com' }
              })}
              error={errors.email?.message}
            />
            <Input
              label="Documento / Cédula *"
              {...register('document_number', { required: 'Obligatorio' })}
              error={errors.document_number?.message}
            />
          </div>

          {/* Selects */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rol *</label>
              <select {...register('role', { required: 'Obligatorio' })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <option value="STUDENT">STUDENT</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
              <select {...register('country_id')} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <option value="">Seleccionar...</option>
                {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Curso</label>
              <select {...register('course_id')} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <option value="">Seleccionar...</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          {/* Datos secundarios */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Teléfono" type="tel" {...register('phone_number')} />
            <Input label="Fecha de nacimiento" type="date" {...register('birthdate')} />
          </div>

          {/* Nota sobre contraseña */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800 flex items-start gap-2">
            <span className="text-lg">💡</span>
            <div>
              <strong>Nota:</strong> La contraseña inicial del usuario será automáticamente su <strong>número de documento</strong>.
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={closeModal}>Cancelar</Button>
            <Button type="submit" loading={isSubmitting}>Crear Usuario</Button>
          </div>
        </form>
      </Modal>

    </div>
  )
}