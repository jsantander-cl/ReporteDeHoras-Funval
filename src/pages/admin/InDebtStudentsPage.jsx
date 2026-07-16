import React, { useState } from 'react';

const InDebtStudentsPage = () => {
  // Datos simulados idénticos a tu maqueta
  const [students] = useState([
    {
      id: 1,
      name: "Mariana Rojas",
      email: "m.rojas@edu-inst.com",
      progress: 60,
      completed: 120,
      total: 200,
      missing: 80,
      statusColor: "bg-amber-500", // Progreso medio
      badgeBg: "bg-orange-50 text-orange-700 border-orange-200",
      badgeText: "80 Horas Faltantes",
      initials: "MR"
    },
    {
      id: 2,
      name: "Carlos Arrieta",
      email: "c.arrieta@edu-inst.com",
      progress: 90,
      completed: 180,
      total: 200,
      missing: 20,
      statusColor: "bg-[#0F3993]", // Casi completado (azul institucional)
      badgeBg: "bg-blue-50 text-[#0F3993] border-blue-100",
      badgeText: "20 Horas Faltantes",
      initials: "CA"
    },
    {
      id: 3,
      name: "Sofia Garcia",
      email: "s.garcia@edu-inst.com",
      progress: 25,
      completed: 50,
      total: 200,
      missing: 150,
      statusColor: "bg-red-600", // Crítico
      badgeBg: "bg-red-50 text-red-700 border-red-200",
      badgeText: "150 Horas Faltantes",
      initials: "SG"
    }
  ]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 px-4 pt-6 font-sans">
      
      {/* Título y Descripción */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0F3993] leading-tight">
          Estudiantes con Deuda de Horas
        </h1>
        <p className="text-gray-600 text-sm mt-2">
          Gestión y seguimiento de alumnos que aún no han completado sus horas de servicio social o prácticas profesionales.
        </p>
      </div>

      {/* Buscador */}
      <div className="relative mb-4">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          🔍
        </span>
        <input
          type="text"
          placeholder="Buscar por nombre o correo electrónico..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3993] focus:border-transparent shadow-sm"
        />
      </div>

      {/* Botones de Acción */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-medium text-sm shadow-sm active:bg-gray-50">
          <span>░</span> Filtrar
        </button>
        <button className="flex items-center justify-center gap-2 bg-[#0F3993] text-white py-3 rounded-xl font-medium text-sm shadow-sm active:bg-[#0b2b70]">
          <span>📥</span> Exportar
        </button>
      </div>

      {/* Listado de Tarjetas de Estudiantes */}
      <div className="space-y-4">
        {students.map((student) => (
          <div key={student.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm relative">
            
            {/* Header de la tarjeta */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-50 text-[#0F3993] border border-blue-200 rounded-full flex items-center justify-center font-semibold text-sm">
                {student.initials}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-base">{student.name}</h3>
                <p className="text-xs text-gray-500">{student.email}</p>
              </div>
              <button className="text-gray-400 text-xl font-bold px-2 py-1">⋮</button>
            </div>

            {/* Progreso */}
            <div className="mb-4">
              <div className="flex justify-between text-xs font-semibold text-gray-500 mb-2">
                <span>Progreso de Horas</span>
                <span className="text-gray-900">{student.progress}%</span>
              </div>
              {/* Barra de progreso de fondo */}
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${student.statusColor} transition-all duration-500`} 
                  style={{ width: `${student.progress}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {student.completed} / {student.total} Completadas
              </div>
            </div>

            <hr className="border-gray-100 my-4" />

            {/* Footer de la tarjeta con Badge y Botón */}
            <div className="flex items-center justify-between">
              <div className={`px-3 py-1.5 rounded-full border text-xs font-bold flex items-center gap-1.5 ${student.badgeBg}`}>
                <span>⚠️</span> {student.badgeText}
              </div>
              <button className="text-[#0F3993] text-sm font-semibold hover:underline">
                Ver Detalle
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-center gap-2 mt-8">
        <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 bg-white">
          &lt;
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#0F3993] text-white font-semibold text-sm shadow-sm">
          1
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 bg-white text-sm">
          2
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 bg-white text-sm">
          3
        </button>
        <span className="text-gray-400 text-sm px-1">...</span>
        <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 bg-white text-sm">
          12
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 bg-white">
          &gt;
        </button>
      </div>

    </div>
  );
};

export default InDebtStudentsPage;