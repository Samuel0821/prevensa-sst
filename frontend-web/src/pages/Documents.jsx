// frontend-web/src/pages/Documents.jsx
import { useState, useEffect } from "react";
import api from "../services/api";

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({ title: "", company_id: "" });
  const [file, setFile] = useState(null);

  useEffect(() => {
    loadDocuments();
    loadCompanies();
  }, []);

  const loadDocuments = async () => {
    try {
      const res = await api.get("/documents");
      setDocuments(res.data);
    } catch (err) {
      console.error("Error al cargar documentos:", err);
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
    if (!file) {
      alert("Por favor selecciona un archivo");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("company_id", form.company_id);
    formData.append("file", file);

    try {
      await api.post("/documents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Documento subido correctamente");
      setForm({ title: "", company_id: "" });
      setFile(null);
      loadDocuments();
    } catch (err) {
      console.error("❌ Error al subir documento:", err);
      alert("Error al subir documento");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("¿Seguro que deseas eliminar este documento?")) {
      try {
        await api.delete(`/documents/${id}`);
        loadDocuments();
      } catch (err) {
        console.error("Error al eliminar documento:", err);
        alert("Error al eliminar documento");
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">📄 Gestión de Documentos</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 shadow rounded mb-6 space-y-2"
      >
        <input
          className="border p-2 w-full"
          placeholder="Título"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
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
          Subir Documento
        </button>
      </form>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-blue-600 text-white text-left">
            <th className="p-2">Título</th>
            <th className="p-2">Empresa</th>
            <th className="p-2">Archivo</th>
            <th className="p-2 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((d) => (
            <tr key={d.id} className="border-t">
              <td className="p-2">{d.title}</td>
              <td className="p-2">{d.company_name || "—"}</td>
              <td className="p-2">
                <a
                  href={`http://localhost:4000/uploads/${d.filename}`}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  Ver documento
                </a>
              </td>
              <td className="p-2 text-center">
                <button
                  onClick={() => handleDelete(d.id)}
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


