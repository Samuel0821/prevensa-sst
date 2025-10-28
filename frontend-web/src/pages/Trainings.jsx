//frontend-web/src/pages/Trainings.jsx
import { useEffect, useState } from "react";
import api from "../services/api"; // CORREGIDO: Importar la instancia correcta de Axios

export default function Trainings() {
  const [trainings, setTrainings] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    company_id: "",
    topic: "",
    trainer: "",
    date: "",
    participants: "",
    status: "Pendiente",
  });

  // 🔹 Cargar capacitaciones
  const loadTrainings = async () => {
    try {
      const res = await api.get("/trainings");
      setTrainings(res.data);
    } catch (err) {
      console.error("Error al cargar capacitaciones:", err);
    }
  };

  // 🔹 Cargar empresas
  const loadCompanies = async () => {
    try {
      const res = await api.get("/companies");
      setCompanies(res.data);
    } catch (err) {
      console.error("Error al cargar empresas:", err);
    }
  };

  useEffect(() => {
    loadTrainings();
    loadCompanies();
  }, []);

  // 🔹 Manejar cambios de inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Crear o actualizar capacitación
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/trainings/${editingId}`, formData);
        alert("Capacitación actualizada correctamente");
      } else {
        await api.post("/trainings", formData);
        alert("Capacitación registrada correctamente");
      }

      setFormData({
        company_id: "",
        topic: "",
        trainer: "",
        date: "",
        participants: "",
        status: "Pendiente",
      });
      setEditingId(null);
      loadTrainings();
    } catch (err) {
      console.error("Error al guardar capacitación:", err);
      alert("Error al guardar capacitación");
    }
  };

  // 🔹 Editar una capacitación
  const handleEdit = (training) => {
    setEditingId(training.id);
    setFormData({
      company_id: training.company_id || "",
      topic: training.topic,
      trainer: training.trainer,
      date: training.date,
      participants: training.participants,
      status: training.status,
    });
  };

  // 🔹 Eliminar una capacitación
  const handleDelete = async (id) => {
    if (!window.confirm("¿Deseas eliminar esta capacitación?")) return;
    try {
      await api.delete(`/trainings/${id}`);
      alert("Capacitación eliminada correctamente");
      loadTrainings();
    } catch (err) {
      console.error("Error al eliminar capacitación:", err);
      alert("Error al eliminar capacitación");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-700 mb-4">
        📚 Gestión de Capacitaciones
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <select
          name="company_id"
          value={formData.company_id}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Seleccione empresa (opcional)</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="topic"
          placeholder="Tema"
          value={formData.topic}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="trainer"
          placeholder="Capacitador"
          value={formData.trainer}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          name="participants"
          placeholder="Número de participantes"
          value={formData.participants}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option>Pendiente</option>
          <option>Completada</option>
          <option>Cancelada</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingId ? "Actualizar" : "Registrar"} Capacitación
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setFormData({
                company_id: "",
                topic: "",
                trainer: "",
                date: "",
                participants: "",
                status: "Pendiente",
              });
            }}
            className="ml-2 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
          >
            Cancelar
          </button>
        )}
      </form>

      <h3 className="text-lg font-semibold mb-2">
        📋 Capacitaciones registradas
      </h3>

      {trainings.length === 0 ? (
        <p>No hay capacitaciones registradas.</p>
      ) : (
        <ul className="space-y-3">
          {trainings.map((t) => (
            <li
              key={t.id}
              className="p-3 bg-white shadow rounded flex justify-between items-center"
            >
              <div>
                <strong>{t.date}</strong> — {t.topic}
                <br />
                <small>Capacitador: {t.trainer}</small>
                <br />
                <small>Participantes: {t.participants}</small>
                <br />
                <small>
                  Empresa: <b>{t.company_name || "—"}</b>
                </small>
                <br />
                <span
                  className={`text-sm font-semibold ${
                    t.status === "Completada"
                      ? "text-green-600"
                      : t.status === "Cancelada"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {t.status}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(t)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
