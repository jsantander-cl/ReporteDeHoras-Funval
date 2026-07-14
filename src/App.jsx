import Navbar from './components/Navbar';

export default function App() {
  const tipoDeUsuarioLogueado = 'student'; 

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* VISTA DEL ALUMNO */}
      {tipoDeUsuarioLogueado === 'student' && (
        <>
          <Navbar 
            title="Front end Development" 
            showSearch={false} 
            role="student" 
          />
          <main className="p-8">
            <h2 className="text-2xl text-gray-700">Bienvenido al panel de alumno</h2>
          </main>
        </>
      )}

      {/* VISTA DEL ADMINISTRADOR */}
      {tipoDeUsuarioLogueado === 'admin' && (
        <>
          <Navbar 
            title="Cursos" 
            showSearch={true} 
            role="admin" 
          />
          <main className="p-8">
            <h2 className="text-2xl text-gray-700">Panel de control de administrador</h2>
          </main>
        </>
      )}

    </div>
  );
}