import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({
    name: "",
    nit: "",
    address: "",
    phone: "",
  });
  const [editing, setEditing] = useState(null);
  const navigate = useNavigate();

  // 🔹 Cargar empresas
  const fetchCompanies = async () => {
    try {
      const res = await api.get("/companies");
      setCompanies(res.data);
    } catch (err) {
      console.error("Error al obtener empresas:", err);
      if (err.response?.status === 401) {
        alert("⚠️ Sesión expirada. Por favor inicia sesión nuevamente.");
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // 🔹 Manejar cambios del formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Crear o actualizar empresa
  const saveCompany = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/companies/${editing}`, form);
        alert("✅ Empresa actualizada correctamente");
      } else {
        await api.post("/companies", form);
        alert("✅ Empresa creada correctamente");
      }

      setForm({ name: "", nit: "", address: "", phone: "" });
      setEditing(null);
      fetchCompanies();
    } catch (err) {
      console.error("Error al guardar empresa:", err);
      if (err.response?.status === 401) {
        alert("⚠️ Sesión expirada. Por favor inicia sesión nuevamente.");
        navigate("/login");
      } else {
        alert("⚠️ Ocurrió un error al guardar la empresa");
      }
    }
  };

  // 🔹 Editar empresa
  const editCompany = (company) => {
    setForm(company);
    setEditing(company.id);
  };

  // 🔹 Eliminar empresa
  const deleteCompany = async (id) => {
    if (!confirm("¿Deseas eliminar esta empresa?")) return;
    try {
      await api.delete(`/companies/${id}`);
      fetchCompanies();
    } catch (err) {
      console.error("Error al eliminar empresa:", err);
      if (err.response?.status === 401) {
        alert("⚠️ Sesión expirada. Por favor inicia sesión nuevamente.");
        navigate("/login");
      } else {
        alert("⚠️ Error al eliminar empresa");
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🏢 Gestión de Empresas</h1>

      {/* Formulario */}
      <form
        onSubmit={saveCompany}
        className="bg-white shadow-md rounded-lg p-4 mb-6"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="nit"
            placeholder="NIT"
            value={form.nit}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Dirección"
            value={form.address}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="phone"
            placeholder="Teléfono"
            value={form.phone}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 mt-4 rounded hover:bg-blue-700"
        >
          {editing ? "Actualizar Empresa" : "Crear Empresa"}
        </button>
      </form>

      {/* Tabla */}
      <table className="w-full border-collapse bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3 border">ID</th>
            <th className="p-3 border">Nombre</th>
            <th className="p-3 border">NIT</th>
            <th className="p-3 border">Dirección</th>
            <th className="p-3 border">Teléfono</th>
            <th className="p-3 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {companies.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center p-4 text-gray-500">
                No hay empresas registradas.
              </td>
            </tr>
          ) : (
            companies.map((c) => (
              <tr key={c.id}>
                <td className="p-3 border">{c.id}</td>
                <td className="p-3 border">{c.name}</td>
                <td className="p-3 border">{c.nit}</td>
                <td className="p-3 border">{c.address}</td>
                <td className="p-3 border">{c.phone}</td>
                <td className="p-3 border">
                  <button
                    onClick={() => editCompany(c)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteCompany(c.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}