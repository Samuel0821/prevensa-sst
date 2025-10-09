// backend/src/models/company.model.js
const db = require("../config/db");

class CompanyModel {
  static create({ name, nit, address, phone }) {
    const stmt = db.prepare(`
      INSERT INTO companies (name, nit, address, phone)
      VALUES (?, ?, ?, ?)
    `);
    const info = stmt.run(name, nit, address, phone);
    return { id: info.lastInsertRowid, name, nit, address, phone };
  }

  static getAll() {
    return db.prepare(`SELECT * FROM companies ORDER BY created_at DESC`).all();
  }

  static findById(id) {
    return db.prepare(`SELECT * FROM companies WHERE id = ?`).get(id);
  }

  static update(id, data) {
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
    values.push(id);
    const stmt = db.prepare(`UPDATE companies SET ${fields.join(", ")} WHERE id = ?`);
    stmt.run(...values);
    return this.findById(id);
  }

  static delete(id) {
    const stmt = db.prepare(`DELETE FROM companies WHERE id = ?`);
    stmt.run(id);
    return { message: "Empresa eliminada" };
  }
}

module.exports = CompanyModel;
