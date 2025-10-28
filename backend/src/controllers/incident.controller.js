// backend/src/controllers/incident.controller.js
const db = require("../config/db");
const fileService = require("../services/file.service");
// const NotificationService = require('../services/notification.service'); // Desactivado
// const UserModel = require('../models/user.model'); // Desactivado

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
    console.log("📦 Body recibido:", req.body);
    console.log("🖼️ Archivo recibido:", req.file);

    const { description, date, location, company_id } = req.body;
    const photo = req.file ? req.file.filename : null;

    if (company_id) {
      const exists = db.prepare("SELECT id FROM companies WHERE id = ?").get(company_id);
      if (!exists) {
        return res.status(400).json({ error: "La empresa seleccionada no existe" });
      }
    }

    const stmt = db.prepare(`
      INSERT INTO incidents (description, date, location, company_id, photo, reported_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(description, date, location, company_id || null, photo, req.user.id);

    // --- NOTIFICACIÓN A ADMINS (DESACTIVADA) ---
    /* try {
      const admins = UserModel.getAll().filter(u => u.role === 'admin');
      const adminIds = admins.map(a => a.id);

      if (adminIds.length > 0) {
        await NotificationService.sendNotification(
          adminIds,
          'Nuevo Incidente Reportado',
          `Se ha registrado un nuevo incidente: ${description}`,
          { incidentId: String(info.lastInsertRowid), type: 'new_incident' } 
        );
      }
    } catch (notificationError) {
      console.error("Error al enviar la notificación:", notificationError);
      // No bloqueamos la respuesta principal por un error de notificación
    } */
    console.log("🟡 Notificaciones para nuevos incidentes están desactivadas.");
    // --- FIN NOTIFICACIÓN ---

    res.status(201).json({ id: info.lastInsertRowid, description, date, location, photo });
  } catch (error) {
    console.error("❌ Error al crear incidente:", error);
    res.status(500).json({ error: error.message });
  }
};

// Función para actualizar el estado de un incidente
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

    res.json({ message: "Incidente actualizado correctamente." });
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

    res.json({ message: "Incidente eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
