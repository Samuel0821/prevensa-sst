const db = require("../config/db");

class IncidentModel {
  static create({ company_id = null, description, photo_url = null, location = null, reported_by = null, status = "open" }) {
    const stmt = db.prepare(`
      INSERT INTO incidents (company_id, description, photo_url, location, status, reported_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(company_id, description, photo_url, location, status, reported_by);
    return { id: info.lastInsertRowid, company_id, description, photo_url, location, status, reported_by };
  }

  static getAll() {
    return db.prepare(`SELECT * FROM incidents ORDER BY created_at DESC`).all();
  }

  static findById(id) {
    return db.prepare(`SELECT * FROM incidents WHERE id = ?`).get(id);
  }

  static update(id, fields = {}) {
    // construir actualización dinámica simple
    const allowed = ["description", "photo_url", "location", "status"];
    const set = [];
    const values = [];
    for (const key of allowed) {
      if (fields[key] !== undefined) {
        set.push(`${key} = ?`);
        values.push(fields[key]);
      }
    }
    if (set.length === 0) return this.findById(id);
    values.push(id);
    const stmt = db.prepare(`UPDATE incidents SET ${set.join(", ")} WHERE id = ?`);
    stmt.run(...values);
    return this.findById(id);
  }

  static delete(id) {
    const stmt = db.prepare(`DELETE FROM incidents WHERE id = ?`);
    return stmt.run(id);
  }
}

module.exports = IncidentModel;