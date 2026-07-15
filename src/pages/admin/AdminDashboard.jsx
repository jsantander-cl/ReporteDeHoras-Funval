import React, { useState, useEffect } from 'react';

// Se usa "export function" para que tu import { AdminDashboard } funcione sin errores
export default function AdminDashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="font-inter bg-surface text-on-surface min-h-[max(884px,100dvh)] flex flex-col">
      
      {/* Navigation Drawer (Desktop Sidebar) */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-sidebar-width bg-surface border-r border-outline-variant flex-col p-md z-40">
        <div className="mb-lg">
          {/* typography: headline-md */}
          <span className="text-[24px] font-[600] leading-[32px] text-primary">FUNVAL</span>
        </div>
        
        <div className="flex items-center gap-sm p-sm mb-lg bg-surface-container-low rounded-lg">
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary [font-variation-settings:'FILL'_0,'wght'_400,'GRAD'_0,'opsz'_24] align-middle">person</span>
          </div>
          <div className="overflow-hidden">
            {/* typography: title-md */}
            <p className="text-[18px] font-[500] leading-[24px] text-on-surface truncate">Admin Panel</p>
            {/* typography: body-md */}
            <p className="text-[14px] font-[400] leading-[20px] text-on-surface-variant">Administrator</p>
          </div>
        </div>

        <nav className="flex flex-col gap-base">
          <a className="flex items-center gap-sm px-md py-sm bg-primary-container text-white rounded-lg transition-all" href="#dashboard">
            <span className="material-symbols-outlined [font-variation-settings:'FILL'_0,'wght'_400,'GRAD'_0,'opsz'_24] align-middle">dashboard</span>
            <span className="text-[18px] font-[500] leading-[24px]">Dashboard</span>
          </a>
          <a className="flex items-center gap-sm px-md py-sm text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="#reports">
            <span className="material-symbols-outlined [font-variation-settings:'FILL'_0,'wght'_400,'GRAD'_0,'opsz'_24] align-middle">description</span>
            <span className="text-[18px] font-[500] leading-[24px]">Reports</span>
          </a>
          <a className="flex items-center gap-sm px-md py-sm text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="#users">
            <span className="material-symbols-outlined [font-variation-settings:'FILL'_0,'wght'_400,'GRAD'_0,'opsz'_24] align-middle">group</span>
            <span className="text-[18px] font-[500] leading-[24px]">Users</span>
          </a>
          <a className="flex items-center gap-sm px-md py-sm text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="#maintenance">
            <span className="material-symbols-outlined [font-variation-settings:'FILL'_0,'wght'_400,'GRAD'_0,'opsz'_24] align-middle">settings</span>
            <span className="text-[18px] font-[500] leading-[24px]">Maintenance</span>
          </a>
        </nav>
        
        <div className="mt-auto p-sm">
          {/* typography: label-md */}
          <div className="flex items-center gap-xs text-green-600 text-[12px] font-[600] leading-[16px] tracking-[0.05em]">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            Online
          </div>
        </div>
      </aside>

      {/* Top App Bar */}
      <header className="fixed top-0 w-full md:left-sidebar-width md:w-[calc(100%-var(--spacing-sidebar-width))] z-30 bg-surface-container-lowest border-b border-outline-variant shadow-sm flex justify-between items-center px-lg py-sm">
        <div className="flex items-center gap-sm">
          <button 
            className="md:hidden cursor-pointer active:scale-95 p-base" 
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <span className="material-symbols-outlined text-primary [font-variation-settings:'FILL'_0,'wght'_400,'GRAD'_0,'opsz'_24] align-middle">menu</span>
          </button>
          <h1 className="text-[24px] font-[600] leading-[32px] text-primary">FUNVAL Admin</h1>
        </div>
        <div className="flex items-center gap-md">
          <div className="hidden sm:flex bg-surface-container-low px-md py-xs rounded-full border border-outline-variant items-center gap-sm">
            <span className="material-symbols-outlined text-outline [font-variation-settings:'FILL'_0,'wght'_400,'GRAD'_0,'opsz'_24] align-middle">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-[14px] w-48 outline-none" placeholder="Search records..." type="text" />
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-primary-container p-[2px] cursor-pointer active:scale-95 transition-transform">
            <img 
              className="w-full h-full rounded-full object-cover" 
              alt="Admin Profile" 
              src="https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg" 
            />
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="pt-24 pb-24 md:pb-lg px-sm md:px-lg md:ml-sidebar-width">
        {/* Welcome Header */}
        <div className="mb-lg">
          {/* typography: headline-lg */}
          <h2 className="text-[32px] font-[600] leading-[40px] tracking-[-0.01em] text-on-surface mb-xs">Panel de Administración</h2>
          {/* typography: body-lg */}
          <p className="text-[16px] font-[400] leading-[24px] text-on-surface-variant">Bienvenido de nuevo, administrador. Aquí tienes el resumen del día.</p>
        </div>

        {/* Global Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md mb-lg">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-sm">
              <div className="p-xs bg-primary-container/10 rounded-lg">
                <span className="material-symbols-outlined text-primary [font-variation-settings:'FILL'_1,'wght'_400,'GRAD'_0,'opsz'_24] align-middle">group</span>
              </div>
              {/* typography: label-md */}
              <span className="text-[12px] font-[600] leading-[16px] tracking-[0.05em] text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+12%</span>
            </div>
            <h3 className="text-on-surface-variant text-[12px] font-[600] leading-[16px] tracking-[0.05em] uppercase">Total Estudiantes</h3>
            {/* typography: display-lg (adjusted for card sizing) */}
            <p className="text-[48px] font-[700] leading-[56px] tracking-[-0.02em] text-on-surface mt-xs">1,284</p>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-sm">
              <div className="p-xs bg-error-container/20 rounded-lg">
                <span className="material-symbols-outlined text-error [font-variation-settings:'FILL'_1,'wght'_400,'GRAD'_0,'opsz'_24] align-middle">report</span>
              </div>
              <span className="text-[12px] font-[600] leading-[16px] tracking-[0.05em] text-error bg-error-container/30 px-2 py-0.5 rounded-full">Prioridad Alta</span>
            </div>
            <h3 className="text-on-surface-variant text-[12px] font-[600] leading-[16px] tracking-[0.05em] uppercase">Reportes por Revisar</h3>
            <p className="text-[48px] font-[700] leading-[56px] tracking-[-0.02em] text-on-surface mt-xs">24</p>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
            <div className="flex justify-between items-start mb-sm">
              <div className="p-xs bg-secondary-container rounded-lg">
                <span className="material-symbols-outlined text-on-secondary-container [font-variation-settings:'FILL'_1,'wght'_400,'GRAD'_0,'opsz'_24] align-middle">sensors</span>
              </div>
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full border-2 border-surface-container-lowest bg-slate-300"></div>
                <div className="w-6 h-6 rounded-full border-2 border-surface-container-lowest bg-slate-400"></div>
                <div className="w-6 h-6 rounded-full border-2 border-surface-container-lowest bg-slate-500"></div>
              </div>
            </div>
            <h3 className="text-on-surface-variant text-[12px] font-[600] leading-[16px] tracking-[0.05em] uppercase">Usuarios Activos</h3>
            <p className="text-[48px] font-[700] leading-[56px] tracking-[-0.02em] text-on-surface mt-xs">452</p>
          </div>
        </div>

        {/* Main Bento Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-md items-start">
          
          {/* Activity Chart Section */}
          <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm">
            <div className="flex justify-between items-center mb-lg">
              <h3 className="text-[18px] font-[500] leading-[24px] text-on-surface">Horas registradas esta semana</h3>
              <select className="bg-surface-container-low border-none rounded-lg text-[12px] font-[600] py-1 px-3 focus:ring-primary-container outline-none">
                <option>Últimos 7 días</option>
                <option>Este mes</option>
              </select>
            </div>
            <div className="relative h-64 w-full flex items-end justify-between px-2 gap-2">
              <div className={`flex-1 bg-primary-container/20 hover:bg-primary-container transition-[height] duration-700 delay-100 ease-out rounded-t-lg relative group ${mounted ? 'h-[40%]' : 'h-0'}`}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-white text-[10px] py-1 px-2 rounded hidden group-hover:block">12h</div>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-on-surface-variant font-[600]">Lun</span>
              </div>
              <div className={`flex-1 bg-primary-container/20 hover:bg-primary-container transition-[height] duration-700 delay-200 ease-out rounded-t-lg relative group ${mounted ? 'h-[65%]' : 'h-0'}`}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-white text-[10px] py-1 px-2 rounded hidden group-hover:block">18h</div>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-on-surface-variant font-[600]">Mar</span>
              </div>
              <div className={`flex-1 bg-primary-container/40 hover:bg-primary-container transition-[height] duration-700 delay-300 ease-out rounded-t-lg relative group ${mounted ? 'h-[85%]' : 'h-0'}`}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-white text-[10px] py-1 px-2 rounded hidden group-hover:block">24h</div>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-on-surface-variant font-[600]">Mie</span>
              </div>
              <div className={`flex-1 bg-primary-container/20 hover:bg-primary-container transition-[height] duration-700 delay-150 ease-out rounded-t-lg relative group ${mounted ? 'h-[50%]' : 'h-0'}`}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-white text-[10px] py-1 px-2 rounded hidden group-hover:block">15h</div>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-on-surface-variant font-[600]">Jue</span>
              </div>
              <div className={`flex-1 bg-primary-container/30 hover:bg-primary-container transition-[height] duration-700 delay-500 ease-out rounded-t-lg relative group ${mounted ? 'h-[75%]' : 'h-0'}`}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-white text-[10px] py-1 px-2 rounded hidden group-hover:block">21h</div>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-on-surface-variant font-[600]">Vie</span>
              </div>
              <div className={`flex-1 bg-secondary-container/30 hover:bg-secondary transition-[height] duration-700 delay-700 ease-out rounded-t-lg relative group ${mounted ? 'h-[25%]' : 'h-0'}`}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-white text-[10px] py-1 px-2 rounded hidden group-hover:block">8h</div>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-on-surface-variant font-[600]">Sab</span>
              </div>
              <div className={`flex-1 bg-secondary-container/30 hover:bg-secondary transition-[height] duration-700 delay-[800ms] ease-out rounded-t-lg relative group ${mounted ? 'h-[15%]' : 'h-0'}`}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-white text-[10px] py-1 px-2 rounded hidden group-hover:block">4h</div>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-on-surface-variant font-[600]">Dom</span>
              </div>
            </div>
          </div>

          {/* Recent Activity List */}
          <div className="lg:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm h-full flex flex-col">
            <h3 className="text-[18px] font-[500] leading-[24px] text-on-surface mb-md">Actividad Reciente</h3>
            <div className="flex flex-col gap-md">
              <div className="flex gap-sm">
                <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-on-secondary-container text-[14px] [font-variation-settings:'FILL'_0,'wght'_400,'GRAD'_0,'opsz'_24] align-middle">edit</span>
                </div>
                <div>
                  <p className="text-[14px] font-[600] leading-[20px] text-on-surface">Actualización de Sistema</p>
                  <p className="text-[14px] font-[400] leading-[20px] text-on-surface-variant">Módulo de mantenimiento actualizado v2.4</p>
                  <span className="text-[10px] text-outline">Hace 2 horas</span>
                </div>
              </div>
              <div className="flex gap-sm">
                <div className="w-8 h-8 rounded-full bg-primary-container/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-[14px] [font-variation-settings:'FILL'_0,'wght'_400,'GRAD'_0,'opsz'_24] align-middle">person_add</span>
                </div>
                <div>
                  <p className="text-[14px] font-[600] leading-[20px] text-on-surface">Nuevo Usuario: Juan Perez</p>
                  <p className="text-[14px] font-[400] leading-[20px] text-on-surface-variant">Registrado como Estudiante Regular</p>
                  <span className="text-[10px] text-outline">Hace 5 horas</span>
                </div>
              </div>
              <div className="flex gap-sm">
                <div className="w-8 h-8 rounded-full bg-error-container/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-error text-[14px] [font-variation-settings:'FILL'_0,'wght'_400,'GRAD'_0,'opsz'_24] align-middle">warning</span>
                </div>
                <div>
                  <p className="text-[14px] font-[600] leading-[20px] text-on-surface">Reporte de Incidencia #104</p>
                  <p className="text-[14px] font-[400] leading-[20px] text-on-surface-variant">Fallo en servidor de base de datos</p>
                  <span className="text-[10px] text-outline">Hace 1 día</span>
                </div>
              </div>
            </div>
            <button className="mt-auto pt-md text-primary text-[12px] font-[600] leading-[16px] tracking-[0.05em] hover:underline flex items-center gap-xs">
              Ver todo el historial
              <span className="material-symbols-outlined text-[14px] [font-variation-settings:'FILL'_0,'wght'_400,'GRAD'_0,'opsz'_24] align-middle">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Featured Resource Section */}
        <div className="mt-lg grid grid-cols-1 md:grid-cols-2 gap-md">
          <div className="relative rounded-2xl overflow-hidden h-48 group">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110 bg-[url('https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg')]"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-transparent flex flex-col justify-center p-lg">
              <h4 className="text-white text-[24px] font-[600] leading-[32px] mb-xs">Gestión de Usuarios</h4>
              <p className="text-white/80 text-[14px] font-[400] leading-[20px] mb-md max-w-[240px]">Administra perfiles, roles y permisos de acceso global.</p>
              <button className="bg-white text-primary px-md py-xs rounded-lg text-[14px] font-[600] w-fit active:scale-95 transition-transform">Acceder ahora</button>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden h-48 group">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110 bg-[url('https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg')]"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 to-transparent flex flex-col justify-center p-lg">
              <h4 className="text-white text-[24px] font-[600] leading-[32px] mb-xs">Mantenimiento</h4>
              <p className="text-white/80 text-[14px] font-[400] leading-[20px] mb-md max-w-[240px]">Configuración de base de datos y logs de sistema.</p>
              <button className="bg-white text-secondary px-md py-xs rounded-lg text-[14px] font-[600] w-fit active:scale-95 transition-transform">Configurar</button>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Navigation Drawer (Sidebar Overlay) */}
      <div 
        className={`fixed inset-y-0 left-0 w-[280px] bg-surface z-50 transform transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] border-r border-outline-variant md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-md flex flex-col h-full">
          <div className="flex justify-between items-center mb-lg">
            <span className="text-[24px] font-[600] leading-[32px] text-primary">FUNVAL Admin</span>
            <button className="p-xs" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="material-symbols-outlined text-on-surface [font-variation-settings:'FILL'_0,'wght'_400,'GRAD'_0,'opsz'_24] align-middle">close</span>
            </button>
          </div>
          <div className="flex items-center gap-sm p-sm mb-lg bg-surface-container-low rounded-lg">
            <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary [font-variation-settings:'FILL'_0,'wght'_400,'GRAD'_0,'opsz'_24] align-middle">person</span>
            </div>
            <div>
              <p className="text-[18px] font-[500] leading-[24px] text-on-surface">Admin User</p>
              <p className="text-[14px] font-[400] leading-[20px] text-on-surface-variant">Administrator</p>
            </div>
          </div>
          <nav className="flex flex-col gap-base">
            <a className="flex items-center gap-sm px-md py-sm bg-primary-container text-on-primary rounded-lg" href="#dashboard">
              <span className="material-symbols-outlined [font-variation-settings:'FILL'_0,'wght'_400,'GRAD'_0,'opsz'_24] align-middle">dashboard</span>
              <span className="text-[18px] font-[500] leading-[24px]">Dashboard</span>
            </a>
            <a className="flex items-center gap-sm px-md py-sm text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="#reports">
              <span className="material-symbols-outlined [font-variation-settings:'FILL'_0,'wght'_400,'GRAD'_0,'opsz'_24] align-middle">description</span>
              <span className="text-[18px] font-[500] leading-[24px]">Reports</span>
            </a>
            <a className="flex items-center gap-sm px-md py-sm text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="#users">
              <span className="material-symbols-outlined [font-variation-settings:'FILL'_0,'wght'_400,'GRAD'_0,'opsz'_24] align-middle">group</span>
              <span className="text-[18px] font-[500] leading-[24px]">Users</span>
            </a>
            <a className="flex items-center gap-sm px-md py-sm text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="#maintenance">
              <span className="material-symbols-outlined [font-variation-settings:'FILL'_0,'wght'_400,'GRAD'_0,'opsz'_24] align-middle">settings</span>
              <span className="text-[18px] font-[500] leading-[24px]">Maintenance</span>
            </a>
          </nav>
          <div className="mt-auto pt-lg">
            <div className="flex items-center gap-xs text-green-600 text-[12px] font-[600] leading-[16px] tracking-[0.05em] px-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              Online
            </div>
          </div>
        </div>
      </div>
      
      {/* Drawer Overlay Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity ${isMobileMenuOpen ? 'opacity-100 block' : 'opacity-0 hidden'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      {/* Bottom Navigation Bar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center bg-surface border-t border-outline-variant px-sm pb-base pt-2 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <a className="flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-xl px-4 py-1 active:scale-90 transition-transform" href="#home">
          <span className="material-symbols-outlined [font-variation-settings:'FILL'_1,'wght'_400,'GRAD'_0,'opsz'_24] align-middle">home</span>
          <span className="text-[12px] font-[600] leading-[16px] tracking-[0.05em]">Home</span>
        </a>
        <a className="flex flex-col items-center justify-center text-on-surface-variant active:scale-90 transition-transform" href="#reports">
          <span className="material-symbols-outlined [font-variation-settings:'FILL'_0,'wght'_400,'GRAD'_0,'opsz'_24] align-middle">analytics</span>
          <span className="text-[12px] font-[600] leading-[16px] tracking-[0.05em]">Reports</span>
        </a>
        <a className="flex flex-col items-center justify-center text-on-surface-variant active:scale-90 transition-transform" href="#new">
          <span className="material-symbols-outlined text-primary text-[32px] [font-variation-settings:'FILL'_0,'wght'_400,'GRAD'_0,'opsz'_24] align-middle">add_circle</span>
          <span className="text-[12px] font-[600] leading-[16px] tracking-[0.05em]">New</span>
        </a>
        <a className="flex flex-col items-center justify-center text-on-surface-variant active:scale-90 transition-transform" href="#profile">
          <span className="material-symbols-outlined [font-variation-settings:'FILL'_0,'wght'_400,'GRAD'_0,'opsz'_24] align-middle">person</span>
          <span className="text-[12px] font-[600] leading-[16px] tracking-[0.05em]">Profile</span>
        </a>
      </nav>
    </div>
  );
}