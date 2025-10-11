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
    ...(user.role === "admin"
      ? [{ to: "/users", label: "Usuarios" }]
      : []),
  ];

  return (
    <aside
      className={`${
        open ? "w-64" : "w-16"
      } bg-blue-700 text-white h-screen transition-all duration-300 flex flex-col`}
    >
      <div className="flex items-center justify-between p-4 border-b border-blue-500">
        <h2 className={`${open ? "block" : "hidden"} font-semibold`}>
          Prevensa
        </h2>
        <button
          onClick={() => setOpen(!open)}
          className="text-white focus:outline-none"
        >
          {open ? "◀" : "▶"}
        </button>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md hover:bg-blue-600 transition ${
                isActive ? "bg-blue-600 font-semibold" : ""
              }`
            }
          >
            {open ? link.label : link.label[0]}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
