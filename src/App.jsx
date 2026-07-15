import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

export default function App() {
  const tipoDeUsuarioLogueado = 'admin'; // Cambia a 'student' para probar la otra vista

  return (
    <div className="min-h-screen bg-[#f4f7fe] font-sans text-gray-800">
      
      {tipoDeUsuarioLogueado === 'student' && (
        <div className="flex flex-col h-screen">
          <Navbar role="student" />
          <main className="p-8 flex-1">
            <h2 className="text-2xl font-semibold">Bienvenido al panel de alumno</h2>
          </main>
        </div>
      )}

      {tipoDeUsuarioLogueado === 'admin' && (
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          
          {/* Contenedor derecho para el Navbar y el contenido principal */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            <Navbar role="admin" />
            <main className="p-8">
              <h2 className="text-2xl font-semibold mb-6">Panel de Administración</h2>
              <p className="text-gray-500">Bienvenido de nuevo, administrador. Aquí tienes el resumen del día.</p>
              {/* Aquí irían las tarjetas de métricas y gráficos de tu imagen */}
            </main>
          </div>
        </div>
      )}

    </div>
  );
}