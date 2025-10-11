// frontend-web/src/pages/Incidents.jsx
import { useState, useEffect } from "react";
import api from "../services/api";

export default function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({
    description: "",
    date: "",
    location: "",
    company_id: "",
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    loadIncidents();
    loadCompanies();
  }, []);

  const loadIncidents = async () => {
    try {
      const res = await api.get("/incidents");
      setIncidents(res.data);
    } catch (err) {
      console.error("Error al cargar incidentes:", err);
    }
  };

  const loadCompanies = async () => {
    try {
      const res = await api.get("/companies");
      setCompanies(res.data);
    } catch (err) {
      console.error("Error al cargar empresas:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.description || !form.date || !form.location) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (file) formData.append("photo", file);

    try {
      await api.post("/incidents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Incidente registrado correctamente");
      setForm({ description: "", date: "", location: "", company_id: "" });
      setFile(null);
      loadIncidents();
    } catch (err) {
      console.error("Error al registrar incidente:", err);
      alert("Error al registrar incidente");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("¿Seguro que deseas eliminar este incidente?")) {
      try {
        await api.delete(`/incidents/${id}`);
        loadIncidents();
      } catch (err) {
        console.error("Error al eliminar incidente:", err);
        alert("Error al eliminar incidente");
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">⚠️ Gestión de Incidentes</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 shadow rounded mb-6 space-y-2"
      >
        <input
          className="border p-2 w-full"
          placeholder="Descripción del incidente"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="date"
          className="border p-2 w-full"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
        <input
          className="border p-2 w-full"
          placeholder="Ubicación"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />

        <select
          className="border p-2 w-full"
          value={form.company_id}
          onChange={(e) => setForm({ ...form, company_id: e.target.value })}
        >
          <option value="">Seleccione empresa (opcional)</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          type="file"
          className="border p-2 w-full"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Registrar Incidente
        </button>
      </form>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-blue-600 text-white text-left">
            <th className="p-2">Descripción</th>
            <th className="p-2">Fecha</th>
            <th className="p-2">Ubicación</th>
            <th className="p-2">Empresa</th>
            <th className="p-2">Foto</th>
            <th className="p-2 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((i) => (
            <tr key={i.id} className="border-t">
              <td className="p-2">{i.description}</td>
              <td className="p-2">{i.date}</td>
              <td className="p-2">{i.location}</td>
              <td className="p-2">{i.company_name || "—"}</td>
              <td className="p-2">
                {i.photo ? (
                  <a
                    href={`http://localhost:4000/uploads/${i.photo}`}
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    Ver imagen
                  </a>
                ) : (
                  "—"
                )}
              </td>
              <td className="p-2 text-center">
                <button
                  onClick={() => handleDelete(i.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


