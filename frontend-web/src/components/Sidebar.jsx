//frontend-web/src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const links = [
    { to: "/dashboard", label: "Panel de control" },
    { to: "/companies", label: "Empresas" },
    { to: "/documents", label: "Documentos" },
    { to: "/incidents", label: "Incidentes" },
    { to: "/trainings", label: "Capacitaciones" },
    ...(user.role === "admin" ? [{ to: "/users", label: "Usuarios" }] : []),
  ];

  return (
    <aside
      className={`${
        open ? "w-64" : "w-16"
      } bg-white border-r border-gray-200 text-gray-700 h-screen flex flex-col transition-all duration-300 shadow-sm`}
    >
      {/* Encabezado del menú */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h2 className={`${open ? "block" : "hidden"} font-bold text-blue-700 tracking-wide`}>
          Menú
        </h2>
        <button
          onClick={() => setOpen(!open)}
          className="text-blue-600 hover:text-blue-800"
        >
          {open ? "◀" : "▶"}
        </button>
      </div>

      {/* Enlaces */}
      <nav className="flex-1 p-3 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md transition-all ${
                isActive
                  ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600"
                  : "hover:bg-blue-50 text-gray-700"
              }`
            }
          >
            {open ? link.label : link.label[0]}
          </NavLink>
        ))}
      </nav>

      {/* Pie del sidebar */}
      <div className="p-3 text-center text-xs text-gray-400 border-t border-gray-100">
        Prevensa © {new Date().getFullYear()}
      </div>
    </aside>
  );
}
