import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, Upload, UserPlus, Pencil, Trash2, Download } from 'lucide-react'
import ModalConfirm from '../../components/ui/ModalConfirm'
import Pagination from '../../components/ui/Pagination'
import Spinner from '../../components/common/Spinner'
import { useFetch } from '../../hooks/useFetch'
import api from '../../services/api'

export default function UsersListPage() {
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [reloadFlag, setReloadFlag] = useState(0)

  // Estados para importación CSV
  const [importResult, setImportResult] = useState(null) // { created, skipped, error? }
  const [importing, setImporting] = useState(false)
  const [importError, setImportError] = useState(null)

  const fileInputRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const url = `/users/?page=${page}&page_size=${pageSize}&search=${encodeURIComponent(debouncedSearch)}&_=${reloadFlag}`
  const { data, loading, error } = useFetch(url)

  const [selectedUser, setSelectedUser] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

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
      await api.delete(`/users/${selectedUser.id}`)
      setIsDeleteModalOpen(false)
      setSelectedUser(null)
      setReloadFlag(prev => prev + 1)
    } catch (err) {
      const detail = err.response?.data?.detail
      const msg = Array.isArray(detail) ? detail.map(d => d.msg).join(', ') : detail
      alert(msg || 'Error al eliminar usuario')
    } finally {
      setDeleting(false)
    }
  }

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

  // Helpers para formatear datos (sin cambios)
  const getInitials = (fullName) => {
    if (!fullName) return '?'
    return fullName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString) => {
    if (!dateString) return '—'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
    } catch {
      return dateString.slice(0, 10)
    }
  }

  const getUserStatus = (user) => {
    if (typeof user.is_active === 'boolean') return user.is_active ? 'Activo' : 'Inactivo'
    if (user.status) return user.status === 'active' ? 'Activo' : 'Inactivo'
    return 'Activo'
  }

  if (loading) return <Spinner text="Cargando usuarios..." />
  if (error) return <div className="max-w-6xl mx-auto py-8 text-center text-red-500 font-bold">Error al cargar usuarios: {error}</div>

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0C2340]">Gestión de Usuarios</h1>
          <p className="text-slate-500 text-sm mt-1">Administra y organiza los accesos de la plataforma institucional.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".csv" className="hidden" />
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
          <button
            onClick={() => navigate('/admin/users/create')}
            className="bg-[#004B93] hover:bg-[#003870] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold text-sm shadow-sm"
          >
            <UserPlus className="w-4 h-4" /> Crear Usuario
          </button>
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
        <button className="border border-slate-200 bg-white text-slate-600 px-4 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-sm">
          <Filter className="w-4 h-4" /> Filtrar
        </button>
      </section>

      {/* Lista de usuarios (sin cambios) */}
      <div className="flex flex-col gap-3">
        {users.length > 0 ? (
          users.map((user) => {
            const status = getUserStatus(user)
            const initials = getInitials(user.full_name || user.name)
            const name = user.full_name || user.name || 'Sin nombre'
            const email = user.email || '—'
            const role = user.role || 'STUDENT'
            const regDate = formatDate(user.created_at || user.registration_date)

            return (
              <div
                key={user.id}
                className={`bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:grid md:grid-cols-12 md:items-center gap-4 shadow-sm ${
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
                  <button onClick={() => navigate(`/admin/users/${user.id}/edit`, { state: { user } })}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-[#004B93] hover:bg-slate-100">
                    <Pencil className="w-4 h-4" /></button>
                  <button onClick={() => triggerDelete(user)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50">
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

      <Pagination
        page={page}
        pageSize={pageSize}
        total={totalUsers}
        onPageChange={setPage}
      />

      <ModalConfirm
        isOpen={isDeleteModalOpen}
        title="¿Eliminar Usuario?"
        message={selectedUser && `¿Estás seguro de que deseas eliminar a ${selectedUser.full_name || selectedUser.name}? Esta acción no se puede deshacer.`}
        confirmLabel="Sí, Eliminar Usuario"
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        loading={deleting}
      />
    </div>
  )
}