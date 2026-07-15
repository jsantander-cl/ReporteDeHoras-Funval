//📂 FASE 2: COMPONENTES COMPARTIDOS DE INTERFAZ
//📌 Tarea 9: Modal de confirmación genérico (Para acciones destructivas)

import { AlertTriangle } from 'lucide-react'
import Button from '../common/Button'

// Props según Tarea 9: title, message, onConfirm, onCancel
const ModalConfirm = ({
  isOpen,
  title = '¿Estás seguro?',
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  loading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-sm sm:max-w-md shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          {message && <p className="text-slate-500 text-sm leading-relaxed px-2">{message}</p>}

          <div className="flex flex-col w-full gap-2.5 mt-4">
            <Button variant="danger" loading={loading} onClick={onConfirm} className="w-full justify-center">
              {confirmLabel}
            </Button>
            <Button variant="secondary" onClick={onCancel} className="w-full justify-center">
              {cancelLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalConfirm
