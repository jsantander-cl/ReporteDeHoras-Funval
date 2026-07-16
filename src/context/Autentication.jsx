import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Importamos el contexto desde el archivo de useAuth
import { AuthContext } from './useAuth'; 

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (savedToken && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          localStorage.clear();
        }
      }
      setLoading(false);
    };
    checkSession();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    navigate('/admin/dashboard');
  };

const logout = async () => {
    console.log("🔌 Iniciando proceso de cierre de sesión...");
    try {
      const token = localStorage.getItem('token');
      console.log("🔑 Enviando token al servidor:", token);
      
      await fetch('/api/v1/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      console.log("📡 API respondió correctamente al logout.");
    } catch (error) {
      console.warn("⚠️ API de logout no disponible (corriendo local), limpiando localmente:", error);
    } finally {
      // Limpieza de datos locales
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.clear();
      
      console.log("🧹 ¡Local Storage limpiado con éxito!");
      console.log("🚪 Redirigiendo al login...");
      navigate('/login');
    }
  };
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};