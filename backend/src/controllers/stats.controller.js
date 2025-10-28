// backend/src/controllers/stats.controller.js
const db = require('../config/db');

exports.getDashboardStats = (req, res) => {
  try {
    // Usar la conexión directa a la base de datos
    const totalCompanies = db.prepare('SELECT COUNT(id) as count FROM companies').get().count;
    const totalDocuments = db.prepare('SELECT COUNT(id) as count FROM documents').get().count;
    const totalIncidents = db.prepare('SELECT COUNT(id) as count FROM incidents').get().count;
    const totalTrainings = db.prepare('SELECT COUNT(id) as count FROM trainings').get().count;
    const totalUsers = db.prepare('SELECT COUNT(id) as count FROM users').get().count;

    // Calcular estadísticas de incidentes
    const closedIncidents = db.prepare("SELECT COUNT(id) as count FROM incidents WHERE status = 'cerrado'").get().count;
    const incidentsClosedPercentage = totalIncidents > 0 ? (closedIncidents / totalIncidents) * 100 : 0;

    // Calcular estadísticas de capacitaciones
    const completedTrainings = db.prepare("SELECT COUNT(id) as count FROM trainings WHERE status = 'completada'").get().count;
    const trainingsCompletedPercentage = totalTrainings > 0 ? (completedTrainings / totalTrainings) * 100 : 0;

    // Preparar el objeto de respuesta
    const stats = {
      totalCompanies: totalCompanies,
      totalDocuments: totalDocuments,
      totalIncidents: totalIncidents,
      totalTrainings: totalTrainings,
      totalUsers: totalUsers,
      incidentsClosedPercentage: Math.round(incidentsClosedPercentage),
      trainingsCompletedPercentage: Math.round(trainingsCompletedPercentage),
    };

    res.status(200).json(stats);

  } catch (error) {
    console.error('❌ Error al obtener estadísticas del dashboard:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
