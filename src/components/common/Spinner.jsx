import { Loader2 } from 'lucide-react'

const Spinner = ({ size = 'md', text = 'Cargando...' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10'
  }

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Loader2 className={`${sizes[size]} animate-spin text-blue-600`} />
      {text && <span className="mt-2 text-sm text-gray-600">{text}</span>}
    </div>
  )
}

export default Spinner