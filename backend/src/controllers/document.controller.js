
// backend/src/controllers/document.controller.js
const db = require("../config/db");
const fs = require('fs');
const path = require('path');

exports.getAllDocuments = (req, res) => {
  try {
    // --- SOLUCIÓN DEFINITIVA ---
    // Se seleccionan AMBOS campos: `filename` para la web y `url` para el móvil.
    // Ambas propiedades apuntan al mismo dato para dar soporte a ambos clientes.
    const docs = db.prepare(`
      SELECT d.id, d.title, d.filename, d.filename AS url, d.uploaded_at,
             c.name AS company_name, c.id AS company_id
      FROM documents d
      LEFT JOIN companies c ON d.company_id = c.id
      ORDER BY d.uploaded_at DESC
    `).all();
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.uploadDocument = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se subió ningún archivo" });
    }

    const company_id = req.body.company_id || null;
    const title = req.body.title || "Sin título";
    const filename = req.file.filename;

    if (company_id) {
      const exists = db.prepare("SELECT id FROM companies WHERE id = ?").get(company_id);
      if (!exists) {
        const filePath = path.join(__dirname, '..', '..', 'uploads', filename);
        fs.unlinkSync(filePath);
        return res.status(400).json({ error: "La empresa seleccionada no existe" });
      }
    }

    const stmt = db.prepare(`
      INSERT INTO documents (company_id, title, filename)
      VALUES (?, ?, ?)
    `);
    const info = stmt.run(company_id, title, filename);

    // Se devuelve un objeto consistente con `getAllDocuments`, incluyendo ambas propiedades.
    res.status(201).json({
      message: "Documento subido correctamente",
      document: { id: info.lastInsertRowid, company_id, title, filename: filename, url: filename },
    });
  } catch (error) {
    console.error("❌ Error al subir documento:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteDocument = (req, res) => {
    try {
        const { id } = req.params;
        const doc = db.prepare("SELECT filename FROM documents WHERE id = ?").get(id);

        if (!doc) {
            return res.status(404).json({ error: "Documento no encontrado" });
        }

        const filePath = path.join(__dirname, '..', '..', 'uploads', doc.filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        db.prepare("DELETE FROM documents WHERE id = ?").run(id);
        res.json({ message: "Documento eliminado correctamente" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
