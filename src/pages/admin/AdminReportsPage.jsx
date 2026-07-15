//📂 FASE 5: MÓDULO DE ADMINISTRACIÓN
//📌 Tarea 27: Listado de Reportes con filtros (Filtros por estado y alumno)

import React, { useState } from 'react';

export default function AdminReportsPage() {
  const [reports, setReports] = useState([
    {
      id: 1,
      student: 'Alejandro Luna',
      initials: 'AL',
      category: 'Servicio Comunitario',
      reportedHours: '04:30',
      approvedHours: '04:30',
      status: 'Approved',
      date: '12 OCT 2023',
    },
    {
      id: 2,
      student: 'Sofía Ramírez',
      initials: 'SR',
      category: 'Prácticas Profesionales',
      reportedHours: '08:00',
      approvedHours: '--:--',
      status: 'Pending',
      date: '10 OCT 2023',
    },
    {
      id: 3,
      student: 'Carlos Pérez',
      initials: 'CP',
      category: 'Taller Extracurricular',
      reportedHours: '02:15',
      approvedHours: '00:00',
      status: 'Rejected',
      date: '05 OCT 2023',
    },
    {
      id: 4,
      student: 'Alejandro Luna',
      initials: 'AL',
      category: 'Apoyo Administrativo',
      reportedHours: '05:00',
      approvedHours: '05:00',
      status: 'Approved',
      date: '01 OCT 2023',
    },
  ]);

  // Estados de control de filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos los estados');
  const [timeTab, setTimeTab] = useState('Recientes');

  // Filtrado lógico
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'Todos los estados' ||
      (statusFilter === 'Aprobados' && report.status === 'Approved') ||
      (statusFilter === 'Pendientes' && report.status === 'Pending') ||
      (statusFilter === 'Rechazados' && report.status === 'Rejected');

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="text-slate-800 font-sans min-h-screen bg-[#F8FAFC] pb-24">
      {/* Header / TopAppBar */}
      <header className="w-full bg-white border-b border-slate-200 flex justify-between items-center px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button className="text-slate-600 hover:bg-slate-100 p-2 rounded-lg transition-colors flex items-center justify-center">
            {/* SVG Menu Icon */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-xl font-bold text-[#004B93]">EduManage</span>
        </div>
        <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200">
          <img 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJkcqzST54NHdZtWtUxtOwKCio_L63IWrNlC-gmJeGPhxkFq29YWdZ5Z1STkd0EVgZLUCtRpL6jxJJE0bXKw0LUqNeYb6YZnzDEdrJQulUF5BXK3Orbwf7muW5XqkZV6XcVgbJTCFDHDdFZgJr-jrYZB04eBh4lVLe9isuHSo1whKAvSoLmjDERUp4SLAOaLdhXcgrr1WTbjx7vlLSWOB0zLKJnKMxG6b5ccUl878ux0eAW4FCS6ODsw" 
            alt="Profile"
          />
        </div>
      </header>

      <main className="max-w-container-max mx-auto px-8 py-8 flex flex-col gap-6">
        {/* Título de la página */}
        <div>
          <h1 className="text-3xl font-extrabold text-[#0C2340] tracking-tight">Mis Reportes</h1>
          <p className="text-slate-500 text-sm mt-1">Consulta el estado y seguimiento de tus actividades registradas.</p>
        </div>

        {/* Buscador y Dropdown en la misma línea */}
        <section className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:max-w-190 relative">
            {/* SVG Search Icon */}
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 flex items-center justify-center pointer-events-none">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por estudiante o categoría..."
              className="w-full bg-white border border-slate-200 rounded-full pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#004B93]/20 focus:border-[#004B93] transition-all text-sm placeholder-slate-400 shadow-sm"
            />
          </div>

          <div className="relative w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-50 appearance-none bg-white border border-slate-200 rounded-full pl-5 pr-10 py-3 outline-none text-sm text-slate-600 cursor-pointer focus:ring-2 focus:ring-[#004B93]/20 focus:border-[#004B93] shadow-sm"
            >
              <option>Todos los estados</option>
              <option>Aprobados</option>
              <option>Pendientes</option>
              <option>Rechazados</option>
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
        </section>

        {/* Botones de Filtro por Tiempo */}
        <div className="flex gap-3">
          {['Recientes', 'Este Mes', 'Semestre Actual'].map((tab) => (
            <button
              key={tab}
              onClick={() => setTimeTab(tab)}
              className={`px-6 py-2 rounded-full text-xs font-semibold transition-all border ${
                timeTab === tab
                  ? 'bg-[#004B93] text-white border-[#004B93] shadow-sm'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/*Tarjetas de Reportes*/}
        <div className="bg-[#F1F5F9] border border-slate-200/60 rounded-2xl p-4 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-spacing-y-2 border-separate">
              <thead>
                <tr className="text-slate-400 font-bold text-xs tracking-wider uppercase">
                  <th className="px-6 pb-2">ESTUDIANTE</th>
                  <th className="px-6 pb-2">CATEGORÍA</th>
                  <th className="px-6 pb-2">HORAS REPORTADAS</th>
                  <th className="px-6 pb-2">HORAS APROBADAS</th>
                  <th className="px-6 pb-2">ESTADO</th>
                  <th className="px-6 pb-2">FECHA</th>
                  <th className="px-6 pb-2 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => (
                  <tr key={report.id} className="bg-white hover:bg-slate-50 transition-colors shadow-sm rounded-xl">
                    {/* Estudiante */}
                    <td className="px-6 py-4 rounded-l-xl flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#E2E8F0] text-[#004B93] font-bold text-xs flex items-center justify-center">
                        {report.initials}
                      </div>
                      <span className="font-semibold text-slate-700 text-sm">{report.student}</span>
                    </td>
                    {/* Categoría */}
                    <td className="px-6 py-4 text-slate-500 text-sm">{report.category}</td>
                    {/* Horas Reportadas */}
                    <td className="px-6 py-4 font-mono font-bold text-[#004B93] text-sm">
                      {report.reportedHours}
                    </td>
                    {/* Horas Aprobadas */}
                    <td className="px-6 py-4 font-mono text-sm">
                      <span className={
                        report.approvedHours === '--:--' 
                          ? 'text-slate-300' 
                          : report.approvedHours === '00:00' 
                          ? 'text-red-500 font-bold' 
                          : 'text-[#004B93] font-bold'
                      }>
                        {report.approvedHours}
                      </span>
                    </td>
                    {/* Estado */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold whitespace-nowrap ${
                          report.status === 'Approved'
                            ? 'bg-[#E6F9F0] text-[#10B981]'
                            : report.status === 'Pending'
                            ? 'bg-[#FEF3C7] text-[#D97706]'
                            : 'bg-[#FEE2E2] text-[#EF4444]'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            report.status === 'Approved'
                              ? 'bg-[#10B981]'
                              : report.status === 'Pending'
                              ? 'bg-[#D97706]'
                              : 'bg-[#EF4444]'
                          }`}
                        ></span>
                        {report.status}
                      </span>
                    </td>
                    {/* Fecha */}
                    <td className="px-6 py-4 text-slate-500 text-xs font-semibold">{report.date}</td>
                    <td className="px-6 py-4 rounded-r-xl text-right">
                      <button className="text-slate-400 hover:text-slate-700 transition-colors flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100 mx-auto">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredReports.length === 0 && (
            <div className="py-12 text-center text-slate-400 bg-white rounded-xl shadow-sm">
              No hay reportes que coincidan con los filtros seleccionados.
            </div>
          )}
        </div>

        {/* Paginación */}
        <nav className="flex items-center justify-between pt-6 px-2">
          <button className="flex items-center gap-1.5 text-sm font-semibold text-[#004B93] hover:text-[#003870] transition-colors group">
            <svg className="w-5 h-5 transform group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Anterior
          </button>
          <div className="flex gap-3">
            <button className="w-8 h-8 rounded-full bg-[#004B93] text-white font-bold text-xs flex items-center justify-center shadow-sm">1</button>
            <button className="w-8 h-8 rounded-full text-slate-500 font-semibold hover:bg-slate-100 text-xs flex items-center justify-center transition-colors">2</button>
            <button className="w-8 h-8 rounded-full text-slate-500 font-semibold hover:bg-slate-100 text-xs flex items-center justify-center transition-colors">3</button>
          </div>
          <button className="flex items-center gap-1.5 text-sm font-semibold text-[#004B93] hover:text-[#003870] transition-colors group">
            Siguiente
            <svg className="w-5 h-5 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </nav>
      </main>
    </div>
  );
}

