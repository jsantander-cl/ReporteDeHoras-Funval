import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import api from '../services/api'
import { useAuth } from '../context/AuthContext' 

export default function FormularioReporte() {
  const navigate = useNavigate()
  const { handleAuthError } = useAuth() 

  // Estados dinámicos del formulario
  const [categorias, setCategorias] = useState([])
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('')
  const [actividad, setActividad] = useState('')
  const [horas, setHoras] = useState('')
  const [archivo, setArchivo] = useState(null)
  
  // Estados de interfaz, carga y validación
  const [isLoadingCategorias, setIsLoadingCategorias] = useState(true)
  const [isReadingFile, setIsReadingFile] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  // categorías de servicio desde el Backend
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const { data } = await api.get('/categories/')
        setCategorias(data)
      } catch (error) {
        console.error('Error al cargar las categorías:', error)
        toast.error('No se pudieron cargar las categorías de servicio.')
        
        if (error.response?.status === 401) {
          handleAuthError()
        }
      } finally {
        setIsLoadingCategorias(false)
      }
    }

    fetchCategorias()
  }, [])

  // Manejar la selección y validación de archivos
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      toast.error('Formato no válido. Solo se admiten archivos PDF.')
      if (fileInputRef.current) fileInputRef.current.value = '' 
      setArchivo(null)
      return
    }

    setIsReadingFile(true)

    setTimeout(() => {
      setArchivo(file)
      setIsReadingFile(false)
      toast.success(`Archivo cargado: ${file.name}`)
    }, 400)
  }

  // Enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!categoriaSeleccionada) {
      toast.error('Por favor, selecciona una Categoría de Servicio.')
      return
    }

    if (!actividad.trim()) {
      toast.error('La descripción de la actividad es requerida.')
      return
    }

    if (!horas || Number(horas) <= 0) {
      toast.error('Por favor, ingresa una cantidad válida de horas.')
      return
    }

    if (!archivo) {
      toast.error('Debes adjuntar el archivo PDF como evidencia.')
      return
    }

    const formData = new FormData()
    formData.append('category_id', categoriaSeleccionada)
    formData.append('description', actividad)
    formData.append('hours_spent', horas) 
    formData.append('evidence', archivo)

    setIsSubmitting(true)

    try {
      await api.post('/reports/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      toast.success('¡Reporte enviado exitosamente!')
      
      setTimeout(() => {
        navigate('/student/dashboard')
      }, 1500)

    } catch (error) {
      console.error('Error al subir el reporte:', error)

      if (error.response?.status === 401) {
        handleAuthError()
        return
      }

      toast.error(error.response?.data?.message || 'Error al procesar el reporte en el servidor.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] bg-transparent py-6 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-100 p-8 transition-all">
        
        {/* Banner */}
<header className="w-full mb-8 border-b border-gray-100 pb-6">
  <img 
    src="/funval.jpg" 
    alt="Logo Funval Internacional" 
    className="w-full h-36 object-cover rounded-xl shadow-sm" 
  />
</header>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Categoría de Servicio */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Categoría de Servicio
            </label>
            <select
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
              disabled={isLoadingCategorias}
              className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm outline-none transition-all cursor-pointer"
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map((cat) => (
                <option key={cat.id || cat.category_id} value={cat.id || cat.category_id}>
                  {cat.name || cat.nombre}
                </option>
              ))}
            </select>
            {isLoadingCategorias && <span className="text-xs text-blue-500 mt-1 block animate-pulse">Cargando categorías...</span>}
          </div>

          {/* Actividad Realizada */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              ¿Qué actividad hiciste?
            </label>
            <textarea
              rows="3"
              value={actividad}
              onChange={(e) => setActividad(e.target.value)}
              placeholder="Ej. Apoyo en la organización del evento comunitario..."
              className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm outline-none transition-all resize-none"
            />
          </div>

          {/* Cantidad de Horas */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              ¿Cuántas horas dedicaste?
            </label>
            <input
              type="number"
              min="1"
              value={horas}
              onChange={(e) => setHoras(e.target.value)}
              placeholder="Ej. 5"
              className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm outline-none transition-all"
            />
          </div>

          {/* Evidencia PDF Dropzone */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Evidencia (Solo PDF)
            </label>
            
            <div className="border-2 border-dashed border-gray-200 hover:border-blue-400 bg-gray-50/30 hover:bg-blue-50/10 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all">
              <input
                type="file"
                id="file-upload"
                accept=".pdf"
                ref={fileInputRef}
                onChange={handleFileChange}
                disabled={isReadingFile}
                className="hidden"
              />

              <label htmlFor="file-upload" className={`w-full cursor-pointer flex flex-col items-center space-y-2.5 ${isReadingFile ? 'pointer-events-none' : ''}`}>
                {isReadingFile ? (
                  <div className="flex flex-col items-center space-y-2 py-2">
                    <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-sm font-semibold text-blue-600">Validando documento...</p>
                  </div>
                ) : archivo ? (
                  <div className="space-y-1 py-1">
                    <div className="bg-green-50 p-2.5 rounded-full text-green-600 inline-block mb-1">
                      <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-700 max-w-xs truncate mx-auto">{archivo.name}</p>
                    <p className="text-xs text-gray-400">{(archivo.size / (1024 * 1024)).toFixed(2)} MB</p>
                    <span className="inline-block mt-2 bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-md hover:bg-gray-200 transition-colors">
                      Reemplazar archivo
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="bg-blue-50 p-3 rounded-full text-blue-500">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Haz clic para buscar o arrastra tu PDF</p>
                      <p className="text-xs text-gray-400 mt-0.5">Límite máximo: 5MB</p>
                    </div>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Botones de Acción inferior */}
          <div className="flex justify-between items-center border-t border-gray-100 pt-5 mt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors"
            >
              ← Volver atrás
            </button>

            <button
              type="submit"
              disabled={isSubmitting || isReadingFile}
              className={`px-6 py-2.5 rounded-xl font-medium text-white text-sm shadow-sm transition-all ${
                isSubmitting || isReadingFile
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-[#0d47a1] hover:bg-blue-800 active:scale-[0.98]'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Guardando...</span>
                </div>
              ) : (
                'Enviar Reporte'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}