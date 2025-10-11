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
    <header className="bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo + Título */}
        <div className="flex items-center gap-3">
          <div className="bg-white text-blue-700 font-extrabold rounded-full w-9 h-9 flex items-center justify-center shadow-md">
          </div>
          <h1 className="text-lg font-semibold tracking-wide">PREVENSA SST</h1>
        </div>

        {/* Usuario + botón */}
        <div className="flex items-center gap-3">
          <div className="text-right leading-tight">
            <span className="block text-sm font-semibold">{user.name || "Usuario"}</span>
            {user.role && (
              <span className="text-xs text-blue-100 capitalize">{user.role}</span>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="bg-white text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-50 text-sm font-semibold transition"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
}

