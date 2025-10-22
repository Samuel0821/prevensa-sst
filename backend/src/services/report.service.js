
const PDFDocument = require('pdfkit');
const IncidentModel = require('../models/incident.model');

class ReportService {
  static generateIncidentReport(callback) {
    const doc = new PDFDocument({ margin: 50 });

    // Título y fecha
    doc.fontSize(20).text('Reporte de Incidentes', { align: 'center' });
    doc.fontSize(12).text(`Generado el: ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(2);

    // Encabezados de la tabla
    const tableTop = doc.y;
    const itemX = 50;
    const descriptionX = 150;
    const locationX = 300;
    const statusX = 400;
    const dateX = 480;

    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('ID', itemX, tableTop);
    doc.text('Descripción', descriptionX, tableTop);
    doc.text('Ubicación', locationX, tableTop);
    doc.text('Estado', statusX, tableTop);
    doc.text('Fecha', dateX, tableTop);
    doc.font('Helvetica');

    // Línea de separación
    doc.moveTo(itemX, doc.y + 15).lineTo(550, doc.y + 15).stroke();
    doc.moveDown();

    // Contenido de la tabla
    const incidents = IncidentModel.getAll();
    incidents.forEach(incident => {
      const y = doc.y;
      doc.text(incident.id, itemX, y);
      doc.text(incident.description, descriptionX, y, { width: 140 });
      doc.text(incident.location, locationX, y, { width: 90 });
      doc.text(incident.status, statusX, y);
      doc.text(new Date(incident.created_at).toLocaleDateString(), dateX, y);
      doc.moveDown(2.5);
    });

    doc.end();
    callback(doc);
  }
}

module.exports = ReportService;
