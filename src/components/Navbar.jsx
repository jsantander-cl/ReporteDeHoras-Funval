import { useState } from 'react';

export default function Navbar({ title, showSearch, role }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const adminLinks = ["Curso Uno", "Curso Dos", "Curso Tres", "Curso Cuatro"];
  const studentLinks = ["Informacion", "Reportar Horas", "Horas Reportadas"];
  
  const currentLinks = role === 'admin' ? adminLinks : studentLinks;

  return (
    <div className="relative font-sans text-gray-800 mb-8">
      
      {/* BARRA SUPERIOR AZUL */}
      <nav className="bg-[#2b3a55] text-white p-3 flex justify-between items-center shadow-md">
        
        {/* LADO IZQUIERDO */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#2b3a55] hover:bg-gray-200 transition-colors focus:outline-none"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <h1 className="text-xl font-semibold tracking-wide">
            {title}
          </h1>
          
          {showSearch && (
            <div className="relative ml-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <input 
                type="text" 
                className="py-1 pl-9 pr-4 rounded-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-inner w-56 md:w-72"
                placeholder=""
              />
            </div>
          )}
        </div>

        {/* LADO DERECHO */}
        <div className="flex items-center gap-4">
          <button className="text-gray-300 hover:text-white focus:outline-none transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>

          <div className="relative flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full border border-white"></div>
            
            <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-3 w-40 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <button 
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  onClick={() => console.log("Cerrando sesión...")}
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* MENÚ LATERAL (SIDEBAR) */}
      {isSidebarOpen && (
        <div className="absolute left-0 top-full mt-1 w-64 bg-[#fdfaf3] border-l-4 border-[#2b3a55] shadow-lg z-10">
          <ul className="flex flex-col">
            {currentLinks.map((link, index) => (
              <li key={index} className="border-b-2 border-[#2b3a55] last:border-b-4">
                <a href="#" className="block py-2 px-4 text-lg text-gray-700 hover:bg-gray-100 transition-colors">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}