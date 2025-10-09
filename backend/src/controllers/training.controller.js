const db = require("../config/db");

exports.getAllTrainings = (req, res) => {
  try {
    const stmt = db.prepare("SELECT * FROM trainings");
    const trainings = stmt.all();
    res.json(trainings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createTraining = (req, res) => {
  try {
    const { company_id, topic, trainer, date, participants, status } = req.body;
    const stmt = db.prepare(`
      INSERT INTO trainings (company_id, topic, trainer, date, participants, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(company_id, topic, trainer, date, participants, status);
    res.status(201).json({
      message: "Capacitación creada correctamente",
      training: { id: info.lastInsertRowid, company_id, topic, trainer, date, participants, status },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
