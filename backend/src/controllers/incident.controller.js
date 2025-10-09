// backend/src/controllers/incident.controller.js
const db = require("../config/db");
const path = require("path");
const fs = require("fs");

// 📦 Obtener todos los incidentes
exports.getAllIncidents = (req, res) => {
  try {
    const incidents = db.prepare("SELECT * FROM incidents ORDER BY created_at DESC").all();
    res.json(incidents);
  } catch (err) {
    console.error("❌ Error al obtener incidentes:", err);
    res.status(500).json({ message: "Error al obtener incidentes" });
  }
};

// 🧾 Crear un incidente
exports.createIncident = (req, res) => {
  try {
    console.log("📦 Body recibido:", req.body);
    console.log("🖼️ Archivo recibido:", req.file);

    const { description, date, location } = req.body;
    const photo = req.file ? req.file.filename : null;

    const stmt = db.prepare(`
      INSERT INTO incidents (description, date, location, photo)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(description, date, location, photo);

    res.status(201).json({ message: "Incidente registrado correctamente", id: result.lastInsertRowid });
  } catch (err) {
    console.error("❌ Error al crear incidente:", err);
    res.status(500).json({ message: "Error al registrar incidente" });
  }
};

// 🗑️ Eliminar un incidente
exports.deleteIncident = (req, res) => {
  try {
    const { id } = req.params;

    // Buscar incidente antes de eliminar
    const incident = db.prepare("SELECT * FROM incidents WHERE id = ?").get(id);
    if (!incident) {
      return res.status(404).json({ message: "Incidente no encontrado" });
    }

    // Eliminar archivo asociado (si existe)
    if (incident.photo) {
      const photoPath = path.join(__dirname, "../../uploads", incident.photo);
      if (fs.existsSync(photoPath)) fs.unlinkSync(photoPath);
    }

    // Eliminar registro en la base de datos
    db.prepare("DELETE FROM incidents WHERE id = ?").run(id);

    res.json({ message: "Incidente eliminado correctamente" });
  } catch (err) {
    console.error("❌ Error al eliminar incidente:", err);
    res.status(500).json({ message: "Error al eliminar incidente" });
  }
};
