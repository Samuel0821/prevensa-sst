
// frontend-web/src/pages/Incidents.jsx
import { useState, useEffect } from "react";
import api from "../services/api";
import { useNotification } from "../context/NotificationContext"; // 1. Importar hook

// --- FUNCIÓN DE UTILIDAD ---
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const [year, month, day] = dateString.split('T')[0].split('-');
  return `${day}-${month}-${year}`;
};

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
  const { addNotification } = useNotification(); // 2. Usar el hook
  const API_URL_PRODUCTION = "https://prevensap-backend.onrender.com";

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
      addNotification("Error al cargar los incidentes", "error");
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
      addNotification("Todos los campos son obligatorios", "error"); // 3. Reemplazar alert
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (file) formData.append("photo", file);

    try {
      await api.post("/incidents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      addNotification("Incidente registrado correctamente"); // 3. Reemplazar alert
      setForm({ description: "", date: "", location: "", company_id: "" });
      setFile(null);
      loadIncidents();
    } catch (err) {
      console.error("Error al registrar incidente:", err);
      addNotification("Error al registrar incidente", "error"); // 3. Reemplazar alert
    }
  };

  const handleDelete = async (id) => {
    if (confirm("¿Seguro que deseas eliminar este incidente?")) {
      try {
        await api.delete(`/incidents/${id}`);
        addNotification("Incidente eliminado con éxito");
        loadIncidents();
      } catch (err) {
        console.error("Error al eliminar incidente:", err);
        addNotification("Error al eliminar incidente", "error"); // 3. Reemplazar alert
      }
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await api.get("/reports/incidents", {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'reporte_incidentes.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error("Error al descargar el reporte:", err);
      addNotification("No se pudo generar el reporte", "error"); // 3. Reemplazar alert
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">⚠️ Gestión de Incidentes</h2>
        <button 
          onClick={handleDownloadReport}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Descargar Reporte (PDF)
        </button>
      </div>

      {/* ... (el resto del JSX del formulario y la tabla no cambia) ... */}
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
              <td className="p-2">{formatDate(i.date)}</td>
              <td className="p-2">{i.location}</td>
              <td className="p-2">{i.company_name || "—"}</td>
              <td className="p-2">
                {i.photo ? (
                  <a
                    href={`${API_URL_PRODUCTION}/${i.photo}`}
                    target="_blank"
                    rel="noopener noreferrer"
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
