export default function Sidebar() {
  const adminLinks = [
    { name: "Dashboard", active: true },
    { name: "Reports", active: false },
    { name: "Users", active: false },
    { name: "Maintenance", active: false }
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6">
        <h1 className="text-2xl font-bold text-blue-700">EduManage</h1>
      </div>

      {/* Tarjeta de Perfil Admin */}
      <div className="px-4 py-6">
        <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3 border border-gray-100">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
            A
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">Admin Panel</p>
            <p className="text-xs text-gray-500">Administrador</p>
          </div>
        </div>
      </div>

      {/* Enlaces de Navegación */}
      <nav className="flex-1 px-4 space-y-1">
        {adminLinks.map((link, index) => (
          <a 
            key={index} 
            href="#" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              link.active 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-blue-600'
            }`}
          >
            {/* Ícono de ejemplo genérico*/}
            <div className={`w-5 h-5 rounded ${link.active ? 'bg-white/20' : 'bg-gray-200'}`}></div>
            {link.name}
          </a>
        ))}
      </nav>
    </aside>
  );
}