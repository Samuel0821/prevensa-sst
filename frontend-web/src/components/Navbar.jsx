// frontend-web/src/components/Navbar.jsx
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-800">Prevensa SST</h1>
      <div className="flex items-center gap-3">
        <span className="text-gray-600 text-sm">{user.name || "Usuario"}</span>
        <button onClick={handleLogout} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Cerrar sesión</button>
      </div>
    </header>
  );
}
