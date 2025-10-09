const db = require("../config/db");
const fileService = require("../services/file.service");

exports.getAllDocuments = (req, res) => {
  try {
    const docs = db.prepare("SELECT * FROM documents").all();
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.uploadDocument = (req, res) => {
  try {
    console.log("🔹 Body recibido:", req.body);
    console.log("🔹 Archivo recibido:", req.file);

    if (!req.file) {
      return res.status(400).json({ error: "No se subió ningún archivo" });
    }

    const company_id = req.body.company_id || null;
    const title = req.body.title || "Sin título";
    const filename = req.file.filename;

    const stmt = db.prepare(`
      INSERT INTO documents (company_id, title, filename)
      VALUES (?, ?, ?)
    `);
    const info = stmt.run(company_id, title, filename);

    res.status(201).json({
      message: "Documento subido correctamente",
      document: {
        id: info.lastInsertRowid,
        company_id,
        title,
        filename,
      },
    });
  } catch (error) {
    console.error("❌ Error al subir documento:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteDocument = (req, res) => {
  try {
    const { id } = req.params;
    const doc = db.prepare("SELECT * FROM documents WHERE id = ?").get(id);
    if (!doc) return res.status(404).json({ error: "Documento no encontrado" });

    fileService.deleteFile(doc.filename);
    db.prepare("DELETE FROM documents WHERE id = ?").run(id);

    res.json({ message: "Documento eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
