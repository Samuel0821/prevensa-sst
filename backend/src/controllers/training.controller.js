// backend/src/controllers/training.controller.js
const db = require("../config/db");

// Obtener todas las capacitaciones
exports.getAllTrainings = (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT t.*, c.name AS company_name
      FROM trainings t
      LEFT JOIN companies c ON t.company_id = c.id
      ORDER BY t.date DESC
    `);
    const trainings = stmt.all();
    res.json(trainings);
  } catch (error) {
    console.error("❌ Error al obtener capacitaciones:", error);
    res.status(500).json({ message: "Error al obtener capacitaciones" });
  }
};

// Crear capacitación
exports.createTraining = (req, res) => {
  try {
    const { company_id, topic, trainer, date, participants, status } = req.body;

    const stmt = db.prepare(`
      INSERT INTO trainings (company_id, topic, trainer, date, participants, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(company_id || null, topic, trainer, date, participants, status);

    res
      .status(201)
      .json({ id: result.lastInsertRowid, message: "Capacitación creada correctamente ✅" });
  } catch (error) {
    console.error("❌ Error al crear capacitación:", error);
    res.status(500).json({ message: "Error al crear capacitación" });
  }
};

// Actualizar capacitación
exports.updateTraining = (req, res) => {
  try {
    const { id } = req.params;
    const { company_id, topic, trainer, date, participants, status } = req.body;

    const stmt = db.prepare(`
      UPDATE trainings
      SET company_id = ?, topic = ?, trainer = ?, date = ?, participants = ?, status = ?
      WHERE id = ?
    `);
    const result = stmt.run(company_id || null, topic, trainer, date, participants, status, id);

    if (result.changes === 0)
      return res.status(404).json({ message: "Capacitación no encontrada ❌" });

    res.json({ message: "Capacitación actualizada correctamente ✅" });
  } catch (error) {
    console.error("❌ Error al actualizar capacitación:", error);
    res.status(500).json({ message: "Error al actualizar capacitación" });
  }
};

// Eliminar capacitación
exports.deleteTraining = (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare("DELETE FROM trainings WHERE id = ?");
    const result = stmt.run(id);

    if (result.changes === 0)
      return res.status(404).json({ message: "Capacitación no encontrada ❌" });

    res.json({ message: "Capacitación eliminada correctamente 🗑️" });
  } catch (error) {
    console.error("❌ Error al eliminar capacitación:", error);
    res.status(500).json({ message: "Error al eliminar capacitación" });
  }
};
