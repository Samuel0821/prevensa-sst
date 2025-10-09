import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpia sesión completamente
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();

    // Redirige al login
    navigate("/login", { replace: true });
  };

  // Obtiene datos del usuario almacenado
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-800">Prevensa SST</h1>

      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-700 flex flex-col items-end">
          <span className="font-medium">
            {user.name || user.email || "Usuario"}
          </span>
          {user.role && (
            <span className="text-gray-500 text-xs capitalize">
              {user.role}
            </span>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
