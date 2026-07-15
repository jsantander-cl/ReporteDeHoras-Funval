import React from 'react';

const MantenimientoGlobal = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col">
      
      {/* Header Superior */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Icono de menú hamburguesa simple */}
          <button className="text-gray-500 hover:text-gray-700 md:hidden">
            <span className="text-xl">☰</span>
          </button>
          <span className="text-xl font-bold text-[#0F3993]">EduManage</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 hidden sm:inline">Mantenimiento</span>
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
            {/* Simulación de avatar de usuario */}
            <div className="w-full h-full bg-[#0F3993] text-white flex items-center justify-center text-xs font-bold">
              AU
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        
        {/* Barra Lateral Izquierda (Sidebar) */}
        <aside className="w-64 bg-white border-r border-gray-200 p-4 hidden md:flex flex-col justify-between">
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 text-sm font-medium transition-colors">
              <span className="text-lg">⚙️</span> Dashboard
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 text-sm font-medium transition-colors">
              <span className="text-lg">📊</span> Reports
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 text-sm font-medium transition-colors">
              <span className="text-lg">👥</span> Users
            </button>
            {/* Activo */}
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 text-[#0F3993] text-sm font-semibold transition-colors">
              <span className="text-lg">⚙️</span> Maintenance
            </button>
          </div>

          {/* Perfil del admin abajo */}
          <div className="border-t border-gray-100 pt-4">
            <p className="font-bold text-gray-900 text-sm">Admin User</p>
            <p className="text-xs text-gray-400 mt-0.5">v1.2.0</p>
          </div>
        </aside>

        {/* Contenido Principal */}
        <main className="flex-1 p-6 md:p-8 max-w-5xl">
          
          {/* Título de la Sección */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-[#0F3993]">Mantenimiento Global</h1>
            <p className="text-gray-500 text-sm mt-1">
              Panel central de administración institucional. Gestione los parámetros base para la operación del ecosistema EduManage.
            </p>
          </div>

          {/* Grid de 3 Columnas (Tarjetas de Mantenimiento) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            
            {/* Tarjeta 1: Gestión de Países */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
              <div className="p-6 flex flex-col items-center text-center flex-1">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl mb-4 text-[#0F3993]">
                  🏳️
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Gestión de Países</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Administra la lista global de regiones, códigos ISO y localizaciones operativas.
                </p>
              </div>
              <div className="px-6 pb-6 pt-2 flex gap-2">
                <button className="flex-1 bg-[#0F3993] hover:bg-[#0b2b70] text-white font-semibold text-xs py-3 rounded-xl transition-colors">
                  Visualizar Elementos
                </button>
                <button className="bg-blue-50 hover:bg-blue-100 text-[#0F3993] font-bold text-lg px-4 rounded-xl border border-blue-200 transition-colors">
                  +
                </button>
              </div>
            </div>

            {/* Tarjeta 2: Gestión de Cursos */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
              <div className="p-6 flex flex-col items-center text-center flex-1">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl mb-4 text-[#0F3993]">
                  🎓
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Gestión de Cursos</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Control de currículos, programas académicos y períodos de vigencia institucional.
                </p>
              </div>
              <div className="px-6 pb-6 pt-2 flex gap-2">
                <button className="flex-1 bg-[#0F3993] hover:bg-[#0b2b70] text-white font-semibold text-xs py-3 rounded-xl transition-colors">
                  Visualizar Elementos
                </button>
                <button className="bg-blue-50 hover:bg-blue-100 text-[#0F3993] font-bold text-lg px-4 rounded-xl border border-blue-200 transition-colors">
                  +
                </button>
              </div>
            </div>

            {/* Tarjeta 3: Categorías */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
              <div className="p-6 flex flex-col items-center text-center flex-1">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl mb-4 text-[#0F3993]">
                  ⛃
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Categorías</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Taxonomía de contenidos, etiquetas administrativas y agrupación de recursos educativos.
                </p>
              </div>
              <div className="px-6 pb-6 pt-2 flex gap-2">
                <button className="flex-1 bg-[#0F3993] hover:bg-[#0b2b70] text-white font-semibold text-xs py-3 rounded-xl transition-colors">
                  Visualizar Elementos
                </button>
                <button className="bg-blue-50 hover:bg-blue-100 text-[#0F3993] font-bold text-lg px-4 rounded-xl border border-blue-200 transition-colors">
                  +
                </button>
              </div>
            </div>

          </div>

          {/* Fila Inferior (Últimos Cambios y Estado del Sistema) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Panel Izquierdo: Últimos Cambios */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span>🔄</span>
                <h4 className="font-bold text-sm text-gray-800">Últimos Cambios</h4>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-xs border-b border-gray-100 pb-2">
                  <span className="text-gray-600 font-medium">País "Colombia" agregado</span>
                  <span className="text-gray-400">Hace 10m</span>
                </div>
                <div className="flex justify-between text-xs border-b border-gray-100 pb-2">
                  <span className="text-gray-600 font-medium">Curso "React" actualizado</span>
                  <span className="text-gray-400">Hace 1h</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 font-medium">Categoría "Electiva" eliminada</span>
                  <span className="text-gray-400">Ayer</span>
                </div>
              </div>
            </div>

            {/* Panel Derecho: Estado del Sistema */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span>ℹ️</span>
                <h4 className="font-bold text-sm text-gray-800">Estado del Sistema</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Conexión a Base de Datos:</span>
                  <span className="text-green-600 font-bold">Excelente</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Último respaldo automático:</span>
                  <span className="text-gray-700 font-semibold">Hoy, 04:00 AM</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Versión del Core:</span>
                  <span className="text-gray-700 font-semibold">v3.4.1-build</span>
                </div>
              </div>
            </div>

          </div>

        </main>
      </div>

    </div>
  );
};

export default MantenimientoGlobal;