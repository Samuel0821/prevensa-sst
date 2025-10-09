const db = require("../config/db");

// Obtener todas las inspecciones
exports.getAllInspections = (req, res) => {
  try {
    const stmt = db.prepare("SELECT * FROM inspections");
    const inspections = stmt.all();
    res.json(inspections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear nueva inspección
exports.createInspection = (req, res) => {
  try {
    const { company_id, inspector, area, findings, recommendations, date, status } = req.body;
    const stmt = db.prepare(`
      INSERT INTO inspections (company_id, inspector, area, findings, recommendations, date, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(company_id, inspector, area, findings, recommendations, date, status);
    res.status(201).json({
      message: "Inspección registrada correctamente",
      inspection: { id: info.lastInsertRowid, company_id, inspector, area, findings, recommendations, date, status }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
