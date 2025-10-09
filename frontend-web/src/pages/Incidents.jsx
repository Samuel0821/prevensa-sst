// frontend-web/src/pages/Incidents.jsx
import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

export default function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [photo, setPhoto] = useState(null);

  // 🔹 Cargar incidentes
  const loadIncidents = async () => {
    try {
      const res = await api.get("/incidents");
      setIncidents(res.data);
    } catch (err) {
      console.error("Error al cargar incidentes:", err);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  // 🔹 Registrar nuevo incidente
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("description", description);
      formData.append("date", date);
      formData.append("location", location);
      if (photo) formData.append("photo", photo);

      await api.post("/incidents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Incidente registrado correctamente");
      setDescription("");
      setDate("");
      setLocation("");
      setPhoto(null);
      loadIncidents();
    } catch (err) {
      console.error("Error al registrar incidente:", err);
      alert("Error al registrar incidente");
    }
  };

  // 🔹 Eliminar incidente
  const handleDelete = async (id) => {
    if (!window.confirm("¿Deseas eliminar este incidente?")) return;
    try {
      await api.delete(`/incidents/${id}`);
      alert("Incidente eliminado correctamente");
      loadIncidents();
    } catch (err) {
      console.error("Error al eliminar incidente:", err);
      alert("Error al eliminar incidente");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-700 mb-4">🚨 Registro de Incidentes</h2>

      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción del incidente"
          className="w-full border p-2 rounded"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Ubicación"
          className="w-full border p-2 rounded"
        />
        <input type="file" onChange={(e) => setPhoto(e.target.files[0])} className="w-full" />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Registrar Incidente
        </button>
      </form>

      <h3 className="text-lg font-semibold mb-2">📋 Incidentes registrados</h3>

      {incidents.length === 0 ? (
        <p>No hay incidentes registrados.</p>
      ) : (
        <ul className="space-y-3">
          {incidents.map((inc) => (
            <li
              key={inc.id}
              className="p-3 bg-white shadow rounded flex justify-between items-center"
            >
              <div>
                <strong>{inc.date}</strong> — {inc.description}
                <br />
                <small>{inc.location}</small>
                {inc.photo && (
                  <div>
                    <img
                      src={`http://localhost:4000/uploads/${inc.photo}`}
                      alt="Evidencia"
                      className="mt-2 w-32 rounded border"
                    />
                  </div>
                )}
              </div>
              <button
                onClick={() => handleDelete(inc.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
