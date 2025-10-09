import { useState, useEffect } from "react";
import api from "../api/axiosConfig";

export default function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [form, setForm] = useState({
    description: "",
    date: "",
  });
  const [photo, setPhoto] = useState(null);

  const fetchIncidents = async () => {
    try {
      const res = await api.get("/incidents");
      setIncidents(res.data);
    } catch (err) {
      console.error("Error al obtener incidentes:", err);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("description", form.description);
    data.append("date", form.date);
    if (photo) data.append("photo", photo);

    try {
      await api.post("/incidents", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Incidente registrado correctamente");
      setForm({ description: "", date: "" });
      setPhoto(null);
      fetchIncidents();
    } catch (err) {
      console.error("Error al registrar incidente:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🚨 Registro de Incidentes</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-4 mb-6"
      >
        <textarea
          name="description"
          placeholder="Descripción del incidente"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          className="border p-2 rounded w-full mb-3"
          required
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="border p-2 rounded w-full mb-3"
          required
        />
        <input
          type="file"
          onChange={(e) => setPhoto(e.target.files[0])}
          className="border p-2 rounded w-full mb-3"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Registrar Incidente
        </button>
      </form>

      <ul>
        {incidents.map((i) => (
          <li
            key={i.id}
            className="border-b py-2 flex justify-between items-center"
          >
            <div>
              <strong>{i.date}</strong> — {i.description}
              <br />
              {i.photo ? (
                <img
                  src={`http://localhost:4000/uploads/${i.photo}`}
                  alt="foto incidente"
                  className="w-24 mt-2 rounded"
                />
              ) : (
                <span className="text-gray-500">Sin imagen</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
