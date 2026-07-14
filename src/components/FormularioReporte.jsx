import { useState } from 'react';

/* Aqui usare useState y useEffect aparte del context para el axios pero hice preguntas que pueden preguntar al profe */

const FormularioReporte = () => {
  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
      
      {/* Logo */}
      <header className="flex justify-center mb-8">
  <img 
    src="/funval.jpg" 
    alt="Logo Funval" 
    className="w-full h-28 object-cover rounded-lg shadow-sm" 
  />
</header>

      {/* Credenciales */}
      <section className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-8">
  <h2 className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-4">Datos del usuario</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="block text-xs font-bold text-blue-600 mb-1">ID</label>
      <input type="text" defaultValue="" className="w-full bg-white border border-blue-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none" />
    </div>
    <div>
      <label className="block text-xs font-bold text-blue-600 mb-1">Carrera</label>
      <input type="text" defaultValue="" className="w-full bg-white border border-blue-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none" />
    </div>
    <div>
      <label className="block text-xs font-bold text-blue-600 mb-1">Controller Asignado</label>
      <input type="text" defaultValue="" className="w-full bg-white border border-blue-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none" />
    </div>
    <div>
      <label className="block text-xs font-bold text-blue-600 mb-1">Responsable</label>
      <input type="text" defaultValue="" className="w-full bg-white border border-blue-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none" />
    </div>
  </div>
</section>

      {/* Formulario principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">¿Qué actividad hiciste?</label>
            <textarea className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" rows="3"></textarea>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">¿Cuántas horas?</label>
            <input type="number" className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>

        <div className="border-2 border-dashed border-blue-200 rounded-xl flex flex-col items-center justify-center p-6 bg-blue-50/50 hover:bg-blue-50 transition cursor-pointer">
          <svg className="w-10 h-10 text-blue-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
          <p className="text-sm font-semibold text-blue-600">Adjuntar archivo</p>
          <p className="text-xs text-blue-400">Formato PDF</p>
          <input type="file" accept=".pdf" className="hidden" id="file-upload" />
          <label htmlFor="file-upload" className="mt-2 text-xs text-white bg-blue-600 px-3 py-1 rounded-full cursor-pointer hover:bg-blue-700">Seleccionar</label>
        </div>
      </div>

      {/* Botones de atras y enviar */}
      <footer className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
        <button className="px-6 py-2 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg transition">Atrás</button>
        <button className="px-8 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition">Enviar</button>
      </footer>
    </div>
  );
};

export default FormularioReporte;