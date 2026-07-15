//📂 FASE 5: MÓDULO DE ADMINISTRACIÓN
//📌 Tarea 22: Listado de Usuarios (Tabla paginada con botón crear/eliminar)
//📌 Tarea 25: Eliminar usuario (Despliega ModalConfirm para soft-delete)

import React, { useState, useRef, useEffect } from 'react';

export default function UsersListPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [users, setUsers] = useState([
    {
      id: 1,
      initials: 'JD',
      name: 'Javier Delgado',
      email: 'javier.delgado@edumanage.edu',
      role: 'ADMIN',
      status: 'Activo',
      regDate: '12 Oct 2023',
      rawDate: new Date('2023-10-12'),
    },
    {
      id: 2,
      initials: 'MR',
      name: 'Mariana Rojas',
      email: 'm.rojas_stud@edumanage.edu',
      role: 'STUDENT',
      status: 'Inactivo',
      regDate: '05 Jan 2024',
      rawDate: new Date('2024-01-05'),
    },
    {
      id: 3,
      initials: 'CA',
      name: 'Carlos Arrieta',
      email: 'c.arrieta@edumanage.edu',
      role: 'STUDENT',
      status: 'Activo',
      regDate: '18 Jan 2024',
      rawDate: new Date('2024-01-18'),
    },
    {
      id: 4,
      initials: 'SG',
      name: 'Sofia Garcia',
      email: 'sofia.g@edumanage.edu',
      role: 'STUDENT',
      status: 'Activo',
      regDate: '02 Feb 2024',
      rawDate: new Date('2024-02-02'),
    }
  ]);

  // Estados interactivos de búsqueda y filtrado
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [importedFileName, setImportedFileName] = useState('');

  // NUEVOS ESTADOS DE FILTRADO 
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [filterRole, setFilterRole] = useState('ALL'); 
  const [filterStatus, setFilterStatus] = useState('ALL'); 
  const [sortByDate, setSortByDate] = useState('DESC'); 

  // Estados de Modales
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  //  Formulario de Edición
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: '',
    status: ''
  });

  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Cerrar el menú de filtros
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFilterDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // importación de archivo pdf
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImportedFileName(file.name);
      alert(`¡Archivo "${file.name}" cargado con éxito para importación!`);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  //  FLUJO DE ELIMINAR 
  const triggerDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedUser) {
      setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    }
  };

  // FLUJO DE EDITAR 
  const triggerEdit = (user) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setIsEditModalOpen(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const confirmEdit = (e) => {
    e.preventDefault();
    if (selectedUser) {
      const nameParts = editForm.name.trim().split(' ');
      const newInitials = nameParts.length > 1 
        ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
        : nameParts[0][0].toUpperCase();

      setUsers(prev => prev.map(u => {
        if (u.id === selectedUser.id) {
          return {
            ...u,
            name: editForm.name,
            email: editForm.email,
            role: editForm.role,
            status: editForm.status,
            initials: newInitials
          };
        }
        return u;
      }));

      setIsEditModalOpen(false);
      setSelectedUser(null);
    }
  };

  // LÓGICA FILTRADO Y ORDENAMIENTO DE USUARIOS
  const filteredUsers = users
    .filter(user => {
      // 1. Filtro por barra de búsqueda
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 2. Filtro por Rol
      const matchesRole = filterRole === 'ALL' || user.role === filterRole;

      // 3. Filtro por Estado (Activo / Inactivo)
      const matchesStatus = filterStatus === 'ALL' || user.status === filterStatus;

      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      // 4. Ordenamiento por Fecha de Registro
      if (sortByDate === 'ASC') {
        return a.rawDate - b.rawDate; // Antiguos 
      } else {
        return b.rawDate - a.rawDate; // Recientes 
      }
    });

  // Limpiador de filtros
  const resetFilters = () => {
    setFilterRole('ALL');
    setFilterStatus('ALL');
    setSortByDate('DESC');
  };

  const hasActiveFilters = filterRole !== 'ALL' || filterStatus !== 'ALL' || sortByDate !== 'DESC';

  return (
    <div className="text-slate-800 font-sans min-h-screen bg-[#F8FAFC] pb-24 relative overflow-x-hidden">
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <aside 
        className={`fixed inset-y-0 left-0 w-72 bg-[#F8FAFC] border-r border-slate-200 z-50 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-out transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col">
          <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="text-slate-500 hover:bg-slate-100 p-2 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="text-xl font-bold text-[#004B93]">EduManage</span>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#004B93] flex items-center justify-center text-white shadow-sm shadow-[#004B93]/20">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#004B93]">Admin Panel</h4>
                <p className="text-slate-400 text-xs">Administrator</p>
              </div>
            </div>
          </div>

          <nav className="flex flex-col gap-1 px-4 mt-2">
            <a href="#" className="flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-slate-800 font-semibold text-sm rounded-xl hover:bg-slate-100 transition-all">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Dashboard
            </a>
            <a href="#" className="flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-slate-800 font-semibold text-sm rounded-xl hover:bg-slate-100 transition-all">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Reports
            </a>
            <a href="#" className="flex items-center gap-4 px-4 py-3 bg-[#004B93] text-white font-bold text-sm rounded-xl shadow-md shadow-[#004B93]/20 transition-all">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Users
            </a>
          </nav>
        </div>
      </aside>

      {/* HEADER PRINCIPAL */}
      <header className="w-full bg-white border-b border-slate-200 flex justify-between items-center px-8 py-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="text-slate-600 hover:bg-slate-100 p-2 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-xl font-bold text-[#004B93]">EduManage</span>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-6">
            <a href="#" className="text-slate-600 hover:text-[#004B93] font-semibold text-sm transition-colors">Dashboard</a>
            <a href="#" className="text-slate-600 hover:text-[#004B93] font-semibold text-sm transition-colors">Reports</a>
            <a href="#" className="text-[#004B93] font-bold text-sm border-b-2 border-[#004B93] pb-1">Users</a>
          </div>
          <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200">
            <img 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJkcqzST54NHdZtWtUxtOwKCio_L63IWrNlC-gmJeGPhxkFq29YWdZ5Z1STkd0EVgZLUCtRpL6jxJJE0bXKw0LUqNeYb6YZnzDEdrJQulUF5BXK3Orbwf7muW5XqkZV6XcVgbJTCFDHDdFZgJr-jrYZB04eBh4lVLe9isuHSo1whKAvSoLmjDERUp4SLAOaLdhXcgrr1WTbjx7vlLSWOB0zLKJnKMxG6b5ccUl878ux0eAW4FCS6ODsw" 
              alt="Profile"
            />
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-container-max mx-auto px-8 py-8 flex flex-col gap-6">
        
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#0C2340] tracking-tight">Gestión de Usuarios</h1>
            <p className="text-slate-500 text-sm mt-1">Administra y organiza los accesos de la plataforma institucional.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".csv" 
              className="hidden" 
            />

            <button 
              onClick={triggerFileInput}
              className="border border-[#004B93] text-[#004B93] px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Importación Masiva (CSV)
            </button>

            <a 
              href="/create-user" 
              className="bg-[#004B93] hover:bg-[#003870] text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm shadow-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Crear Usuario
            </a>
          </div>
        </section>

        {/* Alerta de Archivo Importado */}
        {importedFileName && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Archivo listo para procesar: <strong>{importedFileName}</strong>
            </span>
            <button onClick={() => setImportedFileName('')} className="text-emerald-500 hover:text-emerald-800 cursor-pointer">
              Descartar
            </button>
          </div>
        )}

        {/* Barra de Filtros e Interacciones */}
        <section className="flex flex-col md:flex-row gap-3 items-center">
          <div className="w-full md:flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 flex items-center justify-center pointer-events-none">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre o email..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#004B93]/20 focus:border-[#004B93] transition-all text-sm placeholder-slate-400 shadow-sm"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto relative" ref={dropdownRef}>
            {/* BOTÓN FILTRAR CON DROPDOWN */}
            <button 
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className={`flex-1 md:w-44 border px-4 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer ${
                hasActiveFilters 
                  ? 'border-[#004B93] bg-[#E6F0FA] text-[#004B93]' 
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Filtrar {hasActiveFilters && <span className="w-2.5 h-2.5 bg-[#004B93] rounded-full"></span>}
            </button>

            {/* PANEL DE FILTROS DESPLEGABLE */}
            {isFilterDropdownOpen && (
              <div className="absolute right-0 top-14 w-72 bg-white border border-slate-200 rounded-2xl p-5 shadow-xl z-50 flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <h4 className="font-bold text-slate-800 text-sm">Filtros Avanzados</h4>
                  {hasActiveFilters && (
                    <button 
                      onClick={resetFilters}
                      className="text-xs text-[#004B93] font-bold hover:underline cursor-pointer"
                    >
                      Limpiar
                    </button>
                  )}
                </div>

                {/* Filtro de Rol */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rol</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['ALL', 'ADMIN', 'STUDENT'].map((role) => (
                      <button
                        key={role}
                        onClick={() => setFilterRole(role)}
                        className={`text-xs py-2 rounded-lg font-bold border transition-all cursor-pointer ${
                          filterRole === role 
                            ? 'border-[#004B93] bg-[#E6F0FA] text-[#004B93]' 
                            : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        {role === 'ALL' ? 'Todos' : role}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filtro de Estado */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estado</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['ALL', 'Activo', 'Inactivo'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`text-xs py-2 rounded-lg font-bold border transition-all cursor-pointer ${
                          filterStatus === status 
                            ? 'border-[#004B93] bg-[#E6F0FA] text-[#004B93]' 
                            : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        {status === 'ALL' ? 'Todos' : status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ordenamiento de Fecha de Registro */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fecha de Creación</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => setSortByDate('DESC')}
                      className={`text-xs py-2 rounded-lg font-bold border transition-all cursor-pointer ${
                        sortByDate === 'DESC' 
                          ? 'border-[#004B93] bg-[#E6F0FA] text-[#004B93]' 
                          : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      Más recientes
                    </button>
                    <button
                      onClick={() => setSortByDate('ASC')}
                      className={`text-xs py-2 rounded-lg font-bold border transition-all cursor-pointer ${
                        sortByDate === 'ASC' 
                          ? 'border-[#004B93] bg-[#E6F0FA] text-[#004B93]' 
                          : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      Más antiguos
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* BOTÓN RESET GENERAL RÁPIDO */}
            {hasActiveFilters && (
              <button 
                onClick={resetFilters}
                className="border border-red-200 bg-red-50 text-red-500 p-3 rounded-xl hover:bg-red-100 transition-colors shadow-sm flex items-center justify-center cursor-pointer"
                title="Limpiar todos los filtros"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </section>

        {/* Listado de Filtros Activos en forma de chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-semibold text-slate-400">Filtros aplicados:</span>
            {filterRole !== 'ALL' && (
              <span className="bg-slate-100 border border-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                Rol: {filterRole}
                <button onClick={() => setFilterRole('ALL')} className="text-slate-400 hover:text-slate-600 font-extrabold ml-1 cursor-pointer">×</button>
              </span>
            )}
            {filterStatus !== 'ALL' && (
              <span className="bg-slate-100 border border-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                Estado: {filterStatus}
                <button onClick={() => setFilterStatus('ALL')} className="text-slate-400 hover:text-slate-600 font-extrabold ml-1 cursor-pointer">×</button>
              </span>
            )}
            {sortByDate !== 'DESC' && (
              <span className="bg-slate-100 border border-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                Creación: Más antiguos
                <button onClick={() => setSortByDate('DESC')} className="text-slate-400 hover:text-slate-600 font-extrabold ml-1 cursor-pointer">×</button>
              </span>
            )}
          </div>
        )}

        {/* Tarjetas de Usuarios */}
        <div className="flex flex-col gap-3">
          {filteredUsers.map((user) => (
            <div 
              key={user.id} 
              className={`bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:grid md:grid-cols-12 md:items-center gap-4 shadow-sm transition-all hover:border-slate-300 ${
                user.status === 'Inactivo' ? 'opacity-70 bg-slate-50/50' : ''
              }`}
            >
              <div className="md:col-span-5 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-base ${
                  user.role === 'ADMIN' ? 'bg-[#E6F0FA] text-[#004B93]' : 'bg-[#F1F5F9] text-slate-500'
                }`}>
                  {user.initials}
                </div>
                <div>
                  <h3 className="font-bold text-slate-700 text-sm">{user.name}</h3>
                  <p className="text-slate-400 text-xs mt-0.5">{user.email}</p>
                </div>
              </div>

              <div className="md:col-span-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider ${
                  user.role === 'ADMIN' ? 'bg-[#E6F0FA] text-[#004B93]' : 'bg-[#F1F5F9] text-slate-500'
                }`}>
                  {user.role}
                </span>
              </div>

              <div className="md:col-span-2">
                <span className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <span className={`w-2 h-2 rounded-full ${user.status === 'Activo' ? 'bg-[#10B981]' : 'bg-slate-400'}`}></span>
                  {user.status}
                </span>
              </div>

              <div className="md:col-span-2 text-slate-400 text-xs font-semibold">
                Reg: {user.regDate}
              </div>

              <div className="md:col-span-1 flex justify-end gap-2">
                {/* BOTÓN EDITAR */}
                <button 
                  onClick={() => triggerEdit(user)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-[#004B93] hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                {/* BOTÓN ELIMINAR */}
                <button 
                  onClick={() => triggerDelete(user)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <div className="py-12 text-center text-slate-400 bg-white rounded-xl shadow-sm border border-slate-200">
              Ningún usuario coincide con los filtros aplicados.
            </div>
          )}
        </div>

        {/* Paginación Interactiva Dinámica */}
        <nav className="flex items-center justify-between pt-6 px-2 border-t border-slate-200/60 mt-4">
          <span className="text-slate-400 text-xs font-semibold">
            Mostrando {filteredUsers.length} de {users.length} usuarios
          </span>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 transition-colors flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="w-8 h-8 rounded-lg bg-[#004B93] text-white font-bold text-xs flex items-center justify-center">1</button>
            <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 transition-colors flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </nav>
      </main>

      {/* MODAL DE EDICIÓN  */}
      {isEditModalOpen && selectedUser && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-100 flex items-center justify-center p-4 transition-opacity duration-300"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl w-full max-w-sm sm:max-w-md md:w-115 shadow-2xl p-6 transform scale-100 transition-transform"
            onClick={(e) => e.stopPropagation()}
            style={{ minWidth: '320px' }}
          >
            <div className="flex flex-col gap-5 w-full">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="text-xl font-extrabold text-[#0C2340]">Editar Usuario</h3>
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={confirmEdit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nombre Completo</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={editForm.name}
                    onChange={handleEditInputChange}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#004B93]/20 focus:border-[#004B93] transition-all text-sm font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Correo Electrónico</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={editForm.email}
                    onChange={handleEditInputChange}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#004B93]/20 focus:border-[#004B93] transition-all text-sm font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rol de Acceso</label>
                    <select
                      name="role"
                      value={editForm.role}
                      onChange={handleEditInputChange}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#004B93]/20 focus:border-[#004B93] transition-all text-sm font-semibold text-slate-700 cursor-pointer"
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="STUDENT">STUDENT</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estado del Usuario</label>
                    <select
                      name="status"
                      value={editForm.status}
                      onChange={handleEditInputChange}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#004B93]/20 focus:border-[#004B93] transition-all text-sm font-semibold text-slate-700 cursor-pointer"
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-4 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => setIsEditModalOpen(false)}
                    className="sm:flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-3 rounded-xl font-semibold text-sm transition-colors cursor-pointer text-center"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="sm:flex-1 bg-[#004B93] hover:bg-[#003870] text-white py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer text-center shadow-md"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN PARA ELIMINAR  */}
      {isDeleteModalOpen && selectedUser && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-100 flex items-center justify-center p-4 transition-opacity duration-300"
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl w-full max-w-sm sm:max-w-md md:w-110 shadow-2xl p-6 transform scale-100 transition-transform"
            onClick={(e) => e.stopPropagation()}
            style={{ minWidth: '320px' }}
          >
            <div className="flex flex-col items-center text-center gap-4 w-full">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              
              <h2 className="text-xl font-bold text-slate-800 w-full block">¿Eliminar Usuario?</h2>
              <p className="text-slate-500 text-sm leading-relaxed w-full whitespace-normal block px-2">
                ¿Estás seguro de que deseas eliminar a <span className="font-bold text-slate-800 inline">{selectedUser.name}</span>? Esta acción no se puede deshacer.
              </p>
              
              <div className="flex flex-col w-full gap-2.5 mt-4">
                <button 
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold text-sm transition-colors active:scale-95 cursor-pointer block"
                  onClick={confirmDelete}
                >
                  Sí, Eliminar Usuario
                </button>
                <button 
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 py-3 rounded-xl font-semibold text-sm transition-colors cursor-pointer block"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}