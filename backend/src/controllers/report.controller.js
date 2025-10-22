
const ReportService = require('../services/report.service');

class ReportController {
  static generateIncidentReport(req, res) {
    try {
      const doc = ReportService.generateIncidentReport(doc => {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=reporte_incidentes.pdf');
        doc.pipe(res);
      });
    } catch (error) {
      res.status(500).json({ message: 'Error al generar el reporte', error });
    }
  }
}

module.exports = ReportController;
