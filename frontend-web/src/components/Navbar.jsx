// frontend-web/src/components/Navbar.jsx
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    if (window.confirm("¿Deseas cerrar sesión?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    }
  };

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-800">Prevensa SST</h1>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <span className="text-gray-800 text-sm font-semibold block">
            {user.name || "Usuario"}
          </span>
          {user.role && (
            <span className="text-gray-500 text-xs capitalize">{user.role}</span>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
