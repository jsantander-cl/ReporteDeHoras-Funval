import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function StudentDashboard() {

  const [activeTab, setActiveTab] = useState('Home');
  const { user } = useContext(AuthContext); // Obtenemos el usuario del estado global

  return (
    <div className="bg-slate-50 text-blue-800 mb-24 md:mb-0 min-h-screen relative font-sans">
      
      {/* TopAppBar */}
      <header className="bg-white dark:bg-slate-800 text-blue-800 dark:text-blue-300 w-full top-0 sticky border-b border-slate-200  shadow-sm flex justify-between items-center px-8 py-3 z-40">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined cursor-pointer active:scale-95 transition-colors hover:bg-slate-100 dark:hover:bg-blue-800 p-2 rounded-lg">
            menu
          </span>
          <h1 className="text-2xl font-bold text-blue-800 dark:text-blue-200">
            FUNVAL
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-slate-500 hover:bg-slate-100 p-2 rounded-full">
            🔎
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-200 cursor-pointer active:scale-95">
            <img 
              className="w-full h-full object-cover" 
              alt="Perfil del estudiante" 
              src="https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg" 
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col gap-8">
        
        {/* Welcome Section */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="animate-in fade-in slide-in-from-left duration-700">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-800">
              {/* Mostramos dinámicamente el nombre o un valor por defecto */}
              Hola, {user?.nombre || 'Pame'}
            </h2>
            <p className="text-lg text-slate-600 mt-2">
              Aquí puedes reportar tus horas de servicio.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="bg-blue-700 text-white px-6 py-2.5 rounded-xl text-base font-medium flex items-center gap-2 hover:bg-blue-800 active:scale-95 transition-all shadow-md">
              <span className="w-8 h-8 flex items-center justify-center bg-red-600 rounded-full text-white font-bold text-xl leading-none">
    +</span><span>Enviar Nuevo Reporte</span>
            </button>
            <button className="border border-slate-300 text-blue-700 px-6 py-2.5 rounded-xl text-base font-medium flex items-center gap-2 hover:bg-slate-100 active:scale-95 transition-all">
              <span className="material-symbols-outlined text-[20px]">👁</span>
              <span>Ver mis Reportes</span>
            </button>
          </div>
        </section>

        {/* Metric Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Horas Totales */}
          <div className="bg-white/80 backdrop-blur-md border border-slate-200/50 p-6 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-blue-100 text-blue-800 rounded-xl">
                <span className="material-symbols-outlined">⏰</span>
              </div>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Acumulado</span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Horas Totales</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-slate-900">15</span>
                <span className="text-lg font-medium text-slate-500">/ 20</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-blue-700 h-full rounded-full transition-all duration-1000 w-[62%]"></div>
              </div>
            </div>
          </div>

          {/* Reportes Pendientes */}
          <div className="bg-white/80 backdrop-blur-md border border-slate-200/50 p-6 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-indigo-100 text-indigo-800 rounded-xl">
                <span className="material-symbols-outlined">📈</span>
              </div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">En Revisión</span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Horas Pendientes</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-slate-900">3</span>
                <span className="material-symbols-outlined text-indigo-500 text-[32px] animate-pulse">⌛</span>
              </div>
              <p className="text-sm text-indigo-600 mt-3 font-medium">Próxima actualización en 24h</p>
            </div>
          </div>

          {/* Horas Aprobadas */}
          <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200/50 p-6 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl">
                <span className="material-symbols-outlined">✅</span>
              </div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Verificado</span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Horas Aprobadas</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-slate-900">12</span>
                <span className="material-symbols-outlined text-emerald-500 text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>✔</span>
              </div>
              <div className="mt-3 flex gap-1 items-center text-emerald-700">
    
                <h2 className="text-sm font-medium">+12h esta semana</h2>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Activity Table Card */}
          <div className="lg:col-span-8 bg-white/80 backdrop-blur-md border border-slate-200/50 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-900">Actividad Reciente</h3>
              <button className="text-blue-700 text-sm font-semibold hover:underline">Ver Todo</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider">REPORTE</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider">FECHA</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider text-center">ESTADO</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider text-right">HORAS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="hover:bg-slate-50 transition-colors cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-700">
                          <span className="material-symbols-outlined text-[18px]">📑</span>
                        </div>
                        <span className="text-sm font-medium text-slate-900">Asistencia Técnica Lab 3</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">14 Oct, 2023</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">Aprobado</span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-slate-900">4.5</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-700">
                          <span className="material-symbols-outlined text-[18px]">📑</span>
                        </div>
                        <span className="text-sm font-medium text-slate-900">Mantenimiento Preventivo</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">12 Oct, 2023</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">En Revisión</span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-slate-900">6.0</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Side Card */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-blue-800 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
              <h3 className="text-lg font-semibold mb-2 relative z-10">Meta del Mes</h3>
              <p className="text-sm mb-6 relative z-10 opacity-90">Estás a solo 5 horas de completar tu requerimiento mensual de servicio.</p>
              <button className="bg-white text-blue-800 w-full py-3 rounded-xl text-xs uppercase tracking-widest font-bold active:scale-95 transition-all shadow-sm">Ver Roadmap</button>
            </div>
            
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border-2 border-dashed border-slate-300 text-center flex flex-col items-center gap-3 py-8">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                <span className="material-symbols-outlined">📎</span>
              </div>
              <h4 className="text-base font-semibold text-slate-900">Carga rápida</h4>
              <p className="text-sm text-slate-500 px-4">Arrastra tus evidencias aquí para iniciar un nuevo reporte automático.</p>
            </div>
          </div>
        </section>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center bg-white px-4 pb-2 pt-2 border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:hidden z-50">
        {[
          { id: 'Home', icon: 'home' },
          { id: 'Reports', icon: 'analytics' },
          { id: 'New', icon: 'add_circle' },
          { id: 'Profile', icon: 'person' }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center px-4 py-2 active:scale-90 transition-transform ${
              activeTab === tab.id 
                ? 'bg-blue-100 text-blue-800 rounded-2xl' 
                : 'text-slate-500'
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === tab.id ? "'FILL' 1" : "'FILL' 0" }}>
              {tab.icon}
            </span>
            <span className="text-[10px] font-bold mt-1">{tab.id}</span>
          </button>
        ))}
      </nav>

      {/* Background Subtle Decorations */}
      <div className="fixed top-0 right-0 -z-10 opacity-30 pointer-events-none">
        <svg fill="none" height="400" viewBox="0 0 400 400" width="400" xmlns="http://www.w3.org/2000/svg">
          <circle cx="200" cy="200" fill="url(#paint0_linear)" r="150"></circle>
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear" x1="200" x2="200" y1="50" y2="350">
              <stop stopColor="#0F52BA" stopOpacity="0.2"></stop>
              <stop offset="1" stopColor="#0F52BA" stopOpacity="0"></stop>
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}