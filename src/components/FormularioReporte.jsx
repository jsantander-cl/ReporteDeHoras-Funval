import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import api from '../services/api'
import { useAuth } from '../context/AuthContext' 

const LISTADO_CARRERAS = [
  'Elementary',
  'A1',
  'A2',
  'B1',
  'B2',
  'Aire Acondicionado y Linea Blanca',
  'Asesor Comercial',
  'Asesor Financiero',
  'Asistente contable bilingüe',
  'Auxiliar de Farmacia',
  'Carpinteria en Aluminio & Melamine',
  'Conectividad y Redes',
  'Diagnóstico y Reparación de Computadoras',
  'Diseño Grafico & Marketing Digital',
  'Ede (Funval Perú)',
  'Electricidad, domótica y paneles solares',
  'Freight Brokers',
  'Front-end N1',
  'Front-end N2',
  'Intérprete de Servicios Especializados',
  'Logístico Sap',
  'Mecánica Automotriz',
  'Mecánica de Motos',
  'Modelador digital',
  'Reparación de Celulares (Ecuador)',
  'Soldadura Industrial',
  'Terapia Física e Integral',
  'Ventas (Royal Prestige)',
  'Ciberseguridad'
]

export default function FormularioReporte() {
  const navigate = useNavigate()
  const { handleAuthError } = useAuth() 

  // Estados del usuario (¡Ahora con Carrera inicializada correctamente!)
  const [idEstudiante, setIdEstudiante] = useState('')
  const [carrera, setCarrera] = useState(LISTADO_CARRERAS[0]) // 🔹 Inicializado con 'Elementary' para evitar campos vacíos
  const [controller, setController] = useState('')
  const [nombreCompleto, setNombreCompleto] = useState('')

  // Estados dinámicos del formulario
  const [categorias, setCategorias] = useState([])
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('')
  const [actividad, setActividad] = useState('')
  const [horas, setHoras] = useState('')
  const [archivo, setArchivo] = useState(null)
  
  // Estados de interfaz, carga y validación
  const [isLoadingCategorias, setIsLoadingCategorias] = useState(true)
  const [isReadingFile, setIsReadingFile] = useState(false) // 🔹 Estado para la carga local del PDF
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  // 1. Obtener las categorías de servicio desde el Backend al cargar
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

  // 2. Manejar la selección y validación de archivos pesados
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validar tipo de archivo de inmediato
    if (file.type !== 'application/pdf') {
      toast.error('Formato no válido. Solo se admiten archivos PDF.')
      if (fileInputRef.current) fileInputRef.current.value = '' 
      setArchivo(null)
      return
    }

    // Activar indicador de carga para archivos grandes
    setIsReadingFile(true)

    // Simulamos un micro-retraso imperceptible para asegurar que la UI se renderice 
    // y el navegador procese el puntero del archivo sin congelar la pantalla.
    setTimeout(() => {
      setArchivo(file)
      setIsReadingFile(false)
      toast.success(`Archivo cargado: ${file.name}`)
    }, 400)
  }

  // 3. Enviar el formulario
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
    formData.append('student_id', idEstudiante)
    formData.append('career', carrera)
    formData.append('controller_name', controller)
    formData.append('student_name', nombreCompleto)
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
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-10 px-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-8">
        <header className="flex justify-center mb-8">
          <img 
            src="/funval.jpg" 
            alt="Logo Funval Internacional" 
            className="w-full h-36 object-cover rounded-2xl shadow-md" 
          />
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* DATOS DEL USUARIO (Editable) */}
          <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
            <h2 className="text-sm font-extrabold text-[#0d47a1] tracking-wider uppercase mb-4">Datos del Usuario</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-blue-900 mb-1">ID Estudiante</label>
                <input 
                  type="text" 
                  value={idEstudiante} 
                  onChange={(e) => setIdEstudiante(e.target.value)}
                  className="w-full bg-white border border-blue-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* SELECT DE CARRERA INTEGRADOS*/}
              <div>
                <label className="block text-xs font-semibold text-blue-900 mb-1">Carrera</label>
                <select 
                  value={carrera} 
                  onChange={(e) => setCarrera(e.target.value)}
                  className="w-full bg-white border border-blue-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                >
                  {LISTADO_CARRERAS.map((nombreCarrera) => (
                    <option key={nombreCarrera} value={nombreCarrera}>
                      {nombreCarrera}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-blue-900 mb-1"> Nombre Completo</label>
                <input 
                  type="text" 
                  value={ nombreCompleto} 
                  onChange={(e) =>  setNombreCompleto(e.target.value)}
                  className="w-full bg-white border border-blue-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-blue-900 mb-1">Controller Asignado</label>
                <input 
                  type="text" 
                  value={controller} 
                  onChange={(e) => setController(e.target.value)}
                  className="w-full bg-white border border-blue-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: FORMULARIO DEL REPORTE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* LADO IZQUIERDO: TEXTOS */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Categoría de Servicio</label>
                <select
                  value={categoriaSeleccionada}
                  onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                  disabled={isLoadingCategorias}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
                >
                  <option value="">Selecciona una categoría</option>
                  {categorias.map((cat) => (
                    <option key={cat.id || cat.category_id} value={cat.id || cat.category_id}>
                      {cat.name || cat.nombre}
                    </option>
                  ))}
                </select>
                {isLoadingCategorias && <span className="text-xs text-gray-400 mt-1 block">Cargando categorías...</span>}
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">¿Qué actividad hiciste?</label>
                <textarea
                  rows="4"
                  value={actividad}
                  onChange={(e) => setActividad(e.target.value)}
                  placeholder="Ej. Ayudé en limpiar la casa del vecino"
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
                />
              </div>

              {/* Horas */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">¿Cuántas horas?</label>
                <input
                  type="number"
                  min="1"
                  value={horas}
                  onChange={(e) => setHoras(e.target.value)}
                  placeholder="Ej. 5"
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
                />
              </div>
            </div>

            {/* LADO DERECHO: SUBIDA DE ARCHIVO (EVIDENCIA CON ANIMACIÓN DE CARGA) */}
            <div className="flex flex-col justify-center">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Evidencia (Solo PDF)</label>
              <div className="border-2 border-dashed border-blue-200 hover:border-blue-400 bg-blue-50/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-62.5">
                
                <input
                  type="file"
                  id="file-upload"
                  accept=".pdf"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  disabled={isReadingFile}
                  className="hidden"
                />

                <label htmlFor="file-upload" className={`cursor-pointer flex flex-col items-center space-y-3 ${isReadingFile ? 'pointer-events-none' : ''}`}>
                  {isReadingFile ? (
                    /* 🔄 SPINNER DE CARGA LOCAL */
                    <div className="flex flex-col items-center space-y-3">
                      <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <p className="text-sm font-semibold text-blue-700">Procesando y validando PDF...</p>
                      <p className="text-xs text-gray-400">Por favor, espera un momento</p>
                    </div>
                  ) : archivo ? (
                    <div className="space-y-1">
                      <div className="bg-green-100 p-3 rounded-full text-green-600 inline-block mb-1">
                        <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <p className="text-sm font-semibold text-blue-700">{archivo.name}</p>
                      <p className="text-xs text-gray-400">{(archivo.size / (1024 * 1024)).toFixed(2)} MB</p>
                      <span className="inline-block mt-2 bg-blue-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full hover:bg-blue-700 transition-colors">
                        Cambiar archivo
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Haz clic para buscar o arrastra tu PDF aquí</p>
                        <p className="text-xs text-gray-400 mt-1">Límite de tamaño: 5MB</p>
                      </div>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* ACCIONES Y BOTONES */}
          <div className="flex justify-between items-center border-t pt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              ← Atrás
            </button>

            <button
              type="submit"
              disabled={isSubmitting || isReadingFile}
              className={`px-8 py-3 rounded-full font-semibold text-white text-sm shadow-md transition-all ${
                isSubmitting || isReadingFile
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-[#0d47a1] hover:bg-blue-800 active:scale-95'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Enviando...</span>
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