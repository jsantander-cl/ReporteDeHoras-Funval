import { ChevronLeft, ChevronRight } from 'lucide-react'

const Pagination = ({ page, totalPages, onPageChange, loading = false }) => {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-surface-container-lowest border-t border-outline-variant sm:px-6">
      <div className="text-sm text-on-surface-variant">
        Página <span className="font-medium text-on-surface">{page}</span> de{' '}
        <span className="font-medium text-on-surface">{totalPages}</span>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1 || loading}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-on-surface-variant bg-surface-container-lowest border border-outline-variant rounded-lg hover:bg-surface-container-low disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Anterior
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages || loading}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-on-surface-variant bg-surface-container-lowest border border-outline-variant rounded-lg hover:bg-surface-container-low disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Siguiente
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  )
}

export default Pagination
