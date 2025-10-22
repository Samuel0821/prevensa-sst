// backend/src/models/user.model.js
const db = require("../config/db");
const bcrypt = require("bcryptjs");

class UserModel {
  static getAll() {
    return db
      .prepare("SELECT id, name, email, role, created_at FROM users")
      .all();
  }

  static findByEmail(email) {
    return db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  }

  static findById(id) {
    return db.prepare("SELECT * FROM users WHERE id = ?").get(id);
  }

  static create(user) {
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    const stmt = db.prepare(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)"
    );
    const result = stmt.run(
      user.name,
      user.email,
      hashedPassword,
      user.role || "user"
    );
    return {
      id: result.lastInsertRowid,
      name: user.name,
      email: user.email,
      role: user.role || "user",
    };
  }

  static verifyPassword(password, hash) {
    return bcrypt.compareSync(password, hash);
  }

  static updateFcmToken(userId, fcmToken) {
    const stmt = db.prepare('UPDATE users SET fcm_token = ? WHERE id = ?');
    const result = stmt.run(fcmToken, userId);
    return result.changes > 0;
  }
}

module.exports = UserModel;
