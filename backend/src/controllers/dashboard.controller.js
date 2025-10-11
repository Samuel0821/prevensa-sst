const db = require("../config/db");

exports.getStats = (req, res) => {
  try {
    const role = req.user?.role || "user";

    // Totales básicos
    const totalCompanies = db.prepare("SELECT COUNT(*) AS total FROM companies").get().total;
    const totalUsers = db.prepare("SELECT COUNT(*) AS total FROM users").get().total;
    const totalIncidents = db.prepare("SELECT COUNT(*) AS total FROM incidents").get().total;
    const openIncidents = db.prepare("SELECT COUNT(*) AS total FROM incidents WHERE status = 'open'").get().total;
    const closedIncidents = db.prepare("SELECT COUNT(*) AS total FROM incidents WHERE status = 'closed'").get().total;
    const totalTrainings = db.prepare("SELECT COUNT(*) AS total FROM trainings").get().total;
    const completedTrainings = db.prepare("SELECT COUNT(*) AS total FROM trainings WHERE status = 'Completada'").get().total;
    const pendingTrainings = db.prepare("SELECT COUNT(*) AS total FROM trainings WHERE status = 'Pendiente'").get().total;
    const totalDocuments = db.prepare("SELECT COUNT(*) AS total FROM documents").get().total;

    // 📊 Incidentes por mes (últimos 6 meses)
    const incidentsByMonth = db
      .prepare(`
        SELECT 
          strftime('%Y-%m', date) AS month, 
          COUNT(*) AS total
        FROM incidents
        WHERE date IS NOT NULL
        GROUP BY month
        ORDER BY month DESC
        LIMIT 6
      `)
      .all()
      .reverse();

    // 📊 Capacitaciones por mes (últimos 6 meses)
    const trainingsByMonth = db
      .prepare(`
        SELECT 
          strftime('%Y-%m', date) AS month, 
          COUNT(*) AS total
        FROM trainings
        WHERE date IS NOT NULL
        GROUP BY month
        ORDER BY month DESC
        LIMIT 6
      `)
      .all()
      .reverse();

    const stats = {
      companies: totalCompanies,
      users: totalUsers,
      incidents: { total: totalIncidents, open: openIncidents, closed: closedIncidents },
      trainings: { total: totalTrainings, completed: completedTrainings, pending: pendingTrainings },
      documents: totalDocuments,
      charts: {
        incidentsByMonth,
        trainingsByMonth,
      },
    };

    if (role !== "admin") {
      delete stats.users;
      delete stats.companies;
    }

    res.json(stats);
  } catch (error) {
    console.error("❌ Error al obtener estadísticas:", error);
    res.status(500).json({ message: "Error al obtener estadísticas" });
  }
};

