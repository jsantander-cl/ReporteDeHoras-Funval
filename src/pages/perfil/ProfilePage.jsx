import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../../context/AuthContext";

export default function ProfileModal({ isOpen, onClose }) {
  const { user, updateProfile } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    fechaNacimiento: '',
    pais: ''
  });

  // NUEVO: Estados para manejar la experiencia del usuario y evitar fallos silenciosos
  const [errorMensaje, setErrorMensaje] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        email: user.email || '',
        telefono: user.telefono || '',
        fechaNacimiento: user.fechaNacimiento || '',
        pais: user.pais || 'MX' 
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMensaje(null); // Limpiamos errores previos al intentar de nuevo
    setIsSubmitting(true); // Bloqueamos la UI para evitar múltiples clics

    try {
      // Llamamos a tu contexto
      const result = await updateProfile(formData);
      
      if (result && result.success) {
        onClose(); // Éxito: cerramos el modal
      } else {
        // Fallo manejado por el backend
        setErrorMensaje("No se pudieron guardar los cambios. Revisa los datos e intenta de nuevo.");
      }
    } catch (error) {
      // Fallo de red o servidor caído
      setErrorMensaje("Ocurrió un error inesperado al contactar al servidor.");
    } finally {
      setIsSubmitting(false); // Siempre desbloqueamos el botón al terminar
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden flex flex-col">
        
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-blue-800">Mi Perfil</h2>
          <p className="text-sm text-gray-500 mt-1">Edita tus datos personales</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          
          {/* NUEVO: Renderizado condicional del mensaje de error */}
          {errorMensaje && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-200">
              {errorMensaje}
            </div>
          )}
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</label>
            <input 
              name="nombre"
              className="w-full p-2.5 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              type="text" 
              value={formData.nombre}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</label>
            <input 
              name="email"
              className="w-full p-2.5 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              type="email" 
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Teléfono</label>
            <input 
              name="telefono"
              className="w-full p-2.5 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              type="tel" 
              value={formData.telefono}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha de Nacimiento</label>
            <input 
              name="fechaNacimiento"
              className="w-full p-2.5 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              type="date" 
              value={formData.fechaNacimiento}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">País</label>
            <select 
              name="pais"
              value={formData.pais}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full p-2.5 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="PE">Perú</option>
              <option value="MX">México</option>
              <option value="CO">Colombia</option>
              <option value="CL">Chile</option>
              <option value="AR">Argentina</option>
            </select>
          </div>

          <div className="flex gap-3 mt-4">
            <button 
              className={`flex-1 text-white py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                isSubmitting 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-700 hover:bg-blue-800 active:scale-95'
              }`} 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <button 
              className="flex-1 border border-gray-300 text-blue-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-50" 
              onClick={onClose} 
              type="button"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}