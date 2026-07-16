import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../../context/AuthContext";

export default function ProfileModal({ isOpen, onClose }) {
  const { user, updateProfile } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    fechaNacimiento: '',
    pais: 2 
  });

  const [errorMensaje, setErrorMensaje] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      const nombreCompleto = user.last_name 
        ? `${user.first_name || ''} ${user.last_name}`.trim() 
        : user.first_name || '';

      setFormData({
        nombre: nombreCompleto,
        email: user.email || '',
        telefono: user.phone_number || '',
        fechaNacimiento: user.birthdate || '',
        pais: user.country_id || 2 
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
    setErrorMensaje(null);
    setIsSubmitting(true);

    const partesDelNombre = formData.nombre.trim().split(' ');
    const primerNombre = partesDelNombre[0] || '';
    const apellidos = partesDelNombre.slice(1).join(' ');

    const payload = {
      first_name: primerNombre,
      email: formData.email,
      phone_number: formData.telefono,
      birthdate: formData.fechaNacimiento,
      country_id: parseInt(formData.pais)
    };

    if (apellidos) {
      payload.last_name = apellidos;
    }

    try {
      const result = await updateProfile(payload);
      
      if (result && result.success) {
        onClose();
      } else {
        setErrorMensaje("Datos rechazados por el servidor. Revisa el formato.");
      }
    } catch (error) {
      setErrorMensaje("Error de conexión.");
    } finally {
      setIsSubmitting(false);
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
          
          {errorMensaje && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-200">
              {errorMensaje}
            </div>
          )}
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre Completo</label>
            <input 
              name="nombre"
              className="w-full p-2.5 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              type="text" 
              value={formData.nombre}
              onChange={handleChange}
              disabled={isSubmitting}
              required
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
              required
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
              <option value="1">Perú</option>
              <option value="2">México</option>
              <option value="3">Colombia</option>
              <option value="4">Chile</option>
              <option value="5">Argentina</option>
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