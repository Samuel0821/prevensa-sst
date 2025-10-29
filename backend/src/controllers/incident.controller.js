
// backend/src/controllers/incident.controller.js
const db = require("../config/db");
const fileService = require("../services/file.service");
const NotificationService = require('../services/notification.service.js');
const UserModel = require('../models/user.model.js');
const { getIO } = require('../socket');

// ... (getAllIncidents y createIncident sin cambios) ...
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

exports.createIncident = async (req, res) => {
  try {
    const { description, date, location, company_id } = req.body;
    const photo = req.file ? req.file.filename : null;

    const stmt = db.prepare(`
      INSERT INTO incidents (description, date, location, company_id, photo, reported_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(description, date, location, company_id || null, photo, req.user.id);
    const newIncidentId = info.lastInsertRowid;

    const newIncident = db.prepare(`
        SELECT i.id, i.description, i.photo, i.location, i.date, i.status, i.created_at,
               c.name AS company_name, u.name as reported_by_name
        FROM incidents i
        LEFT JOIN companies c ON i.company_id = c.id
        LEFT JOIN users u ON i.reported_by = u.id
        WHERE i.id = ?
    `).get(newIncidentId);

    try {
      const admins = UserModel.getAll().filter(u => u.role === 'admin');
      if (admins.length > 0) {
        await NotificationService.sendNotification(
          admins.map(a => a.id),
          'Nuevo Incidente Reportado',
          `Se ha registrado un nuevo incidente: ${description}`,
          { incidentId: String(newIncidentId), type: 'new_incident' }
        );
      }
    } catch (notificationError) {
      console.error("Error al enviar la notificación push:", notificationError);
    }

    try {
      getIO().emit('new_incident', newIncident);
      console.log('Evento de nuevo incidente emitido por WebSocket.');
    } catch (socketError) {
      console.error("Error al emitir por WebSocket:", socketError);
    }

    res.status(201).json(newIncident);

  } catch (error) {
    console.error("❌ Error al crear incidente:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateIncident = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['abierto', 'cerrado'].includes(status)) {
      return res.status(400).json({ error: "Estado no válido. Use 'abierto' o 'cerrado'." });
    }

    const stmt = db.prepare("UPDATE incidents SET status = ? WHERE id = ?");
    const info = stmt.run(status, id);

    if (info.changes === 0) {
      return res.status(404).json({ error: "Incidente no encontrado." });
    }

    // 1. Obtener el incidente actualizado para emitirlo
    const updatedIncident = db.prepare(`
        SELECT i.id, i.description, i.photo, i.location, i.date, i.status, i.created_at,
               c.name AS company_name, u.name as reported_by_name
        FROM incidents i
        LEFT JOIN companies c ON i.company_id = c.id
        LEFT JOIN users u ON i.reported_by = u.id
        WHERE i.id = ?
    `).get(id);

    // 2. Emitir el evento de WebSocket
    try {
      getIO().emit('incident_updated', updatedIncident);
      console.log(`Evento de incidente actualizado (ID: ${id}) emitido por WebSocket.`);
    } catch (socketError) {
      console.error("Error al emitir evento de actualización por WebSocket:", socketError);
    }

    res.json(updatedIncident);
  } catch (error) {
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

    try {
      getIO().emit('incident_deleted', { id: incident.id });
      console.log(`Evento de incidente eliminado (ID: ${incident.id}) emitido por WebSocket.`);
    } catch (socketError) {
      console.error("Error al emitir evento de eliminación por WebSocket:", socketError);
    }

    res.json({ message: "Incidente eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
