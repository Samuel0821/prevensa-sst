// frontend-web/src/pages/Documents.jsx
import { useEffect, useState } from "react";
import api from "../services/api";

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");

  const fetchDocuments = async () => {
    try {
      const res = await api.get("/documents");
      setDocuments(res.data);
    } catch (err) {
      console.error("Error al obtener documentos:", err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Selecciona un archivo primero");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("company_id", 1);

    try {
      await api.post("/documents", formData, { headers: { "Content-Type": "multipart/form-data" } });
      alert("✅ Documento subido correctamente");
      setFile(null);
      setTitle("");
      fetchDocuments();
    } catch (err) {
      console.error("Error al subir documento:", err);
      alert("Error al subir documento");
    }
  };

  const deleteDocument = async (id) => {
    if (!confirm("¿Eliminar este documento?")) return;
    try {
      await api.delete(`/documents/${id}`);
      fetchDocuments();
    } catch (err) {
      console.error("Error al eliminar documento:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📑 Gestión de Documentos</h1>

      <form onSubmit={handleUpload} className="bg-white shadow-md rounded-lg p-4 mb-6">
        <input type="text" placeholder="Título del documento" value={title} onChange={(e) => setTitle(e.target.value)} className="border p-2 rounded w-full mb-3" required />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} className="border p-2 rounded w-full mb-3" required />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Subir Documento</button>
      </form>

      <ul>
        {documents.map((doc) => (
          <li key={doc.id} className="border-b py-2 flex justify-between items-center">
            <span>
              {doc.title} —{" "}
              <a href={`http://localhost:4000/uploads/${doc.filename}`} target="_blank" rel="noreferrer" className="text-blue-600 underline">Ver archivo</a>
            </span>
            <button onClick={() => deleteDocument(doc.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
