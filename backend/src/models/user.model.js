const db = require("../config/db");
const bcrypt = require("bcryptjs");

class UserModel {
  static getAll() {
    return db.prepare("SELECT id, name, email, role, created_at FROM users").all();
  }

  static findByEmail(email) {
    return db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  }

  static create(user) {
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    const stmt = db.prepare(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)"
    );
    const result = stmt.run(user.name, user.email, hashedPassword, user.role || "user");
    return { id: result.lastInsertRowid, name: user.name, email: user.email, role: user.role || "user" };
  }

  static verifyPassword(password, hash) {
    return bcrypt.compareSync(password, hash);
  }
}

module.exports = UserModel;

