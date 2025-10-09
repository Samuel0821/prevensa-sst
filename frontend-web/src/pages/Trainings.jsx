import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

export default function Trainings() {
  const [trainings, setTrainings] = useState([]);
  const [form, setForm] = useState({
    topic: "",
    date: "",
  });

  const fetchTrainings = async () => {
    try {
      const res = await api.get("/trainings");
      setTrainings(res.data);
    } catch (err) {
      console.error("Error al obtener capacitaciones:", err);
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/trainings", form);
      alert("✅ Capacitación registrada");
      setForm({ topic: "", date: "" });
      fetchTrainings();
    } catch (err) {
      console.error("Error al guardar capacitación:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🎓 Capacitaciones</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-4 mb-6"
      >
        <input
          type="text"
          placeholder="Tema"
          value={form.topic}
          onChange={(e) => setForm({ ...form, topic: e.target.value })}
          className="border p-2 rounded w-full mb-3"
          required
        />
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="border p-2 rounded w-full mb-3"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Registrar Capacitación
        </button>
      </form>

      <ul>
        {trainings.map((t) => (
          <li key={t.id} className="border-b py-2">
            <strong>{t.topic}</strong> — {t.date}
          </li>
        ))}
      </ul>
    </div>
  );
}
