import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import api from '../../services/api'
import Spinner from '../../components/common/Spinner'

export default function EditReportPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  
  const reportData = location.state?.report

  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    hours: '',
    category_id: '',
    description: '',
  })
  const [evidenceFile, setEvidenceFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // obtenemos categorías y validamos que el reporte sea editable
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true)
        const categoriesRes = await api.get('/categories/')
        setCategories(categoriesRes.data)

        if (reportData) {
          if (reportData.status?.toUpperCase() !== 'PENDING' && reportData.status?.toUpperCase() !== 'PENDIENTE') {
            alert('Solo puedes editar reportes pendientes.')
            navigate('/student/reports', { replace: true })
            return
          }
          // Llenamos el formulario con los datos recibidos del reporte
          setFormData({
            hours: reportData.hours_spent ?? '',
            category_id: reportData.category?.id ?? reportData.category_id ?? '',
            description: reportData.description ?? '',
          })
        } else {
          alert('Por favor, selecciona el reporte desde la lista.')
          navigate('/student/reports', { replace: true })
        }
      } catch (err) {
        console.error(err)
        alert('No fue posible cargar las categorías.')
      } finally {
        setLoading(false)
      }
    }
    initializeData()
  }, [reportData, navigate])

  // Actualiza el estado del formulario conforme escribes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Valida que el archivo subido sea un PDF
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.type === 'application/pdf') {
        setEvidenceFile(file)
      } else {
        alert('Por favor, selecciona solo archivos PDF.')
        e.target.value = null
      }
    }
  }

  // Envía los cambios al servidor usando el formato esperado (FormData para multipart)
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.category_id || !formData.hours || !formData.description.trim()) {
      alert('Por favor, completa todos los campos requeridos.')
      return
    }

    try {
      setSubmitting(true)
      const data = new FormData()
      
      // reconoce según la respuesta que vimos en la pestaña Network.
      data.append('hours_spent', Number(formData.hours))
      data.append('category_id', Number(formData.category_id))
      data.append('description', formData.description)
      
      // Si el usuario seleccionó un nuevo PDF, lo añadimos
      if (evidenceFile) {
        data.append('evidence', evidenceFile)
      }

      // Enviamos el parche (PATCH) al endpoint del reporte específico
      await api.patch(`/reports/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      alert('Reporte actualizado correctamente.')
      // Redirigimos de vuelta a la lista; MyReports se encargará de recargar los datos
      navigate('/student/reports', { replace: true })
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.detail ?? 'Ocurrió un error al actualizar.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="min-h-[50vh] flex justify-center items-center"><Spinner size="lg" text="Cargando..." /></div>

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-3xl shadow-sm border mt-6">
      <h1 className="text-2xl font-bold text-[#004B93] mb-1">Editar Reporte #{id}</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Selector de categorías */}
        <div>
          <label className="block mb-2 text-xs font-bold uppercase">Categoría</label>
          <select name="category_id" value={formData.category_id} onChange={handleInputChange} className="w-full border rounded-xl p-3" required>
            <option value="">Seleccione una categoría</option>
            {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block mb-2 text-xs font-bold uppercase">Horas</label>
          <input type="number" name="hours" min="1" value={formData.hours} onChange={handleInputChange} className="w-full border rounded-xl p-3" required />
        </div>
        <div>
          <label className="block mb-2 text-xs font-bold uppercase">Descripción</label>
          <textarea rows="5" name="description" value={formData.description} onChange={handleInputChange} className="w-full border rounded-xl p-3" required />
        </div>
        <div>
          <label className="block mb-2 text-xs font-bold uppercase">Cambiar Evidencia PDF (Opcional)</label>
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
          {evidenceFile && <p className="mt-2 text-sm text-green-600">Nuevo archivo: {evidenceFile.name}</p>}
        </div>
        <div className="flex justify-end gap-3 pt-5">
          <button type="button" onClick={() => navigate('/student/reports')} className="px-5 py-2 rounded-xl bg-slate-200">Cancelar</button>
          <button type="submit" disabled={submitting} className="px-5 py-2 rounded-xl bg-[#004B93] text-white disabled:opacity-50">
            {submitting ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  )
}