const db = require("../config/db");
const { upload } = require("../services/file.service");

// Obtener todos los incidentes
exports.getAllIncidents = (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM incidents ORDER BY id DESC").all();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear un nuevo incidente con imagen
exports.createIncident = (req, res) => {
  try {
    const { company_id, title, description } = req.body;
    const photo = req.file ? req.file.filename : null;

    const stmt = db.prepare(`
      INSERT INTO incidents (company_id, title, description, photo)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(company_id, title, description, photo);

    res.status(201).json({
      message: "Incidente creado correctamente",
      incident: {
        id: result.lastInsertRowid,
        company_id,
        title,
        description,
        photo,
      },
    });
  } catch (error) {
    console.error("Error al crear incidente:", error);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar incidente
exports.deleteIncident = (req, res) => {
  try {
    const { id } = req.params;
    const incident = db.prepare("SELECT * FROM incidents WHERE id = ?").get(id);
    if (!incident) return res.status(404).json({ error: "Incidente no encontrado" });

    if (incident.photo) {
      const fs = require("fs");
      const path = require("path");
      const photoPath = path.resolve(__dirname, "../../uploads", incident.photo);
      if (fs.existsSync(photoPath)) fs.unlinkSync(photoPath);
    }

    db.prepare("DELETE FROM incidents WHERE id = ?").run(id);
    res.json({ message: "Incidente eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
