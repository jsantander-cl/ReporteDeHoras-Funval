import { useEffect, useState } from 'react'
import api from '../../services/api'
import { FileX, Download } from 'lucide-react'
import Spinner from './Spinner'

const PdfViewer = ({ reportId }) => {
  const [pdfUrl, setPdfUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let objectUrl = null
    
    const fetchPdf = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await api.get(`/reports/${reportId}/evidence/stream`, {
          responseType: 'blob'
        })
        const blob = new Blob([response.data], { type: 'application/pdf' })
        objectUrl = URL.createObjectURL(blob)
        setPdfUrl(objectUrl)
      } catch (err) {
        setError('No se pudo cargar la evidencia.')
      } finally {
        setLoading(false)
      }
    }

    if (reportId) fetchPdf()

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [reportId])

  if (loading) return <Spinner text="Cargando documento..." />

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-error-container/40 rounded-xl border border-error-container text-on-error-container">
        <FileX className="w-10 h-10 mb-2" />
        <span className="text-sm">{error}</span>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="border border-outline-variant rounded-xl overflow-hidden shadow-sm bg-surface-container-low">
        <iframe 
          src={pdfUrl} 
          className="w-full h-[500px]"
          title="Evidencia del reporte"
        />
      </div>
      <a
        href={pdfUrl}
        download={`evidencia-${reportId}.pdf`}
        className="inline-flex items-center text-sm text-primary hover:text-primary-container"
      >
        <Download className="w-4 h-4 mr-1" />
        Descargar PDF
      </a>
    </div>
  )
}

export default PdfViewer