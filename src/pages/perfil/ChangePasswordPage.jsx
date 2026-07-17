import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({ field: '', message: '' });

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
    if (error.field === e.target.name) setError({ field: '', message: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({ field: '', message: '' });

    // Verificacion de la contraseña
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      setError({ field: 'confirmNewPassword', message: 'Las nuevas contraseñas no coinciden' });
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.patch('/api/v1/profile/password', {
        current_password: passwords.currentPassword,
        new_password: passwords.newPassword
      });
      toast.success("Contraseña actualizada correctamente");
      navigate(-1);
    } catch (err) {
      // Lógica para capturar el error 409 que viene del servidor
      const serverDetail = err.response?.data?.detail;

      if (err.response?.status === 409 && serverDetail === 'Current password is incorrect') {
        setError({ field: 'currentPassword', message: 'Contraseña actual incorrecta' });
      } else {
        toast.error("Error al actualizar la contraseña");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-700 mb-6 font-medium">
          <ArrowLeft size={18} /> Volver
        </button>

        <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
          <Lock className="text-blue-600" /> Cambiar Contraseña
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Contraseña Actual */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">CONTRASEÑA ACTUAL</label>
            <input 
              name="currentPassword" type="password" onChange={handleChange} value={passwords.currentPassword} required
              className={`w-full p-3 rounded-xl border ${error.field === 'currentPassword' ? 'border-red-500 bg-red-50' : 'border-gray-200'} outline-none`}
            />
            {error.field === 'currentPassword' && (
              <p className="text-red-500 text-xs ml-1 font-medium">{error.message}</p>
            )}
          </div>

          {/* Nueva Contraseña */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">NUEVA CONTRASEÑA</label>
            <input 
              name="newPassword" type="password" onChange={handleChange} value={passwords.newPassword} required
              className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 outline-none"
            />
          </div>

          {/* Confirmar */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">CONFIRMAR NUEVA CONTRASEÑA</label>
            <input 
              name="confirmNewPassword" type="password" onChange={handleChange} value={passwords.confirmNewPassword} required
              className={`w-full p-3 rounded-xl border ${error.field === 'confirmNewPassword' ? 'border-red-500 bg-red-50' : 'border-gray-200'} outline-none`}
            />
            {error.field === 'confirmNewPassword' && (
              <p className="text-red-500 text-xs ml-1 font-medium">{error.message}</p>
            )}
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full mt-2 bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition-all">
            {isSubmitting ? 'Procesando...' : 'Actualizar contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
}