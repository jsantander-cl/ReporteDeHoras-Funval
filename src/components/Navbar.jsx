export default function Navbar({ role }) {
  return (
    <nav className="bg-white px-6 py-4 flex justify-between items-center shadow-sm border-b border-gray-100">
      
      {/* LADO IZQUIERDO: Logo (Solo para alumno, el admin lo tiene en el sidebar) */}
      <div className="flex items-center gap-4">
        {role === 'student' ? (
          <div className="flex items-center gap-3">
            <button className="text-gray-500 hover:text-blue-600 focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-blue-700">EduManage</h1>
          </div>
        ) : (
          <h1 className="text-xl font-semibold text-gray-800 tracking-wide">EduManage</h1>
        )}
      </div>

      {/* LADO DERECHO: Buscador y Perfil */}
      <div className="flex items-center gap-6">
        
        {/* Buscador (Condicional según el rol y la imagen) */}
        {role === 'admin' ? (
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              className="py-2 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              placeholder="Search records..."
            />
          </div>
        ) : (
          <button className="text-gray-400 hover:text-blue-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        )}

        {/* Avatar de Usuario */}
        <button className="w-9 h-9 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors">
          <span className="text-sm font-semibold">U</span>
        </button>
      </div>
    </nav>
  );
}