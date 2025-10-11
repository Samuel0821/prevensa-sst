// backend/src/controllers/incident.controller.js
const db = require("../config/db");
const fileService = require("../services/file.service");

exports.getAllIncidents = (req, res) => {
  try {
    const incidents = db.prepare(`
      SELECT i.id, i.title, i.description, i.photo, i.location, i.date, i.status, i.created_at,
             c.name AS company_name
      FROM incidents i
      LEFT JOIN companies c ON i.company_id = c.id
      ORDER BY i.created_at DESC
    `).all();
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createIncident = (req, res) => {
  try {
    console.log("📦 Body recibido:", req.body);
    console.log("🖼️ Archivo recibido:", req.file);

    const { description, date, location, company_id } = req.body;
    const photo = req.file ? req.file.filename : null;

    if (company_id) {
      const exists = db.prepare("SELECT id FROM companies WHERE id = ?").get(company_id);
      if (!exists) {
        return res.status(400).json({ error: "La empresa seleccionada no existe" });
      }
    }

    const stmt = db.prepare(`
      INSERT INTO incidents (description, date, location, company_id, photo)
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(description, date, location, company_id || null, photo);

    res.status(201).json({ id: info.lastInsertRowid, description, date, location, photo });
  } catch (error) {
    console.error("❌ Error al crear incidente:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteIncident = (req, res) => {
  try {
    const { id } = req.params;
    const incident = db.prepare("SELECT * FROM incidents WHERE id = ?").get(id);
    if (!incident) return res.status(404).json({ error: "Incidente no encontrado" });

    if (incident.photo) fileService.deleteFile(incident.photo);
    db.prepare("DELETE FROM incidents WHERE id = ?").run(id);

    res.json({ message: "Incidente eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

