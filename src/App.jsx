//📌 Enrutador centralizado con react-router-dom y envoltura de contextos


import UsersListPage from "./pages/admin/UsersListPage";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      
      <UsersListPage></UsersListPage>
    </div>
  );
}

export default App;