//📂 FASE 2: COMPONENTES COMPARTIDOS DE INTERFAZ
//📌 Tarea 7: Componente de Paginación (Botones Sig/Ant e Indicador)

import { ChevronLeft, ChevronRight } from 'lucide-react'

// Props según Tarea 7: page, page_size, total, onPageChange
const Pagination = ({ page, pageSize, total, onPageChange }) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  const pagesToShow = () => {
    const pages = new Set([1, totalPages, page, page - 1, page + 1])
    return [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b)
  }

  return (
    <nav className="flex items-center justify-between pt-6 px-2">
      <span className="text-slate-400 text-xs font-semibold">
        Mostrando {from}-{to} de {total}
      </span>

      <div className="flex items-center gap-2">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pagesToShow().map((p, i, arr) => (
          <span key={p} className="flex items-center gap-2">
            {i > 0 && p - arr[i - 1] > 1 && <span className="text-slate-300 text-xs">…</span>}
            <button
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-colors ${
                p === page ? 'bg-[#004B93] text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {p}
            </button>
          </span>
        ))}

        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </nav>
  )
}

export default Pagination
