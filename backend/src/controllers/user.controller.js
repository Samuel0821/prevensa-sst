//backend/src/controllers/user.controller.js
const db = require("../config/db");
const bcrypt = require("bcryptjs");

// ------------------------
// 📋 Obtener todos los usuarios
// ------------------------
exports.getAll = (req, res) => {
  try {
    const users = db
      .prepare("SELECT id, name, email, role, created_at FROM users")
      .all();
    res.json(users);
  } catch (err) {
    console.error("❌ Error al obtener usuarios:", err.message);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

// ------------------------
// ➕ Crear usuario nuevo
// ------------------------
exports.create = (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
    if (existing) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const stmt = db.prepare(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)"
    );
    const result = stmt.run(name, email, hashedPassword, role || "user");

    res.status(201).json({
      id: result.lastInsertRowid,
      name,
      email,
      role: role || "user",
      message: "Usuario creado correctamente"
    });
  } catch (err) {
    console.error("❌ Error al crear usuario:", err.message);
    res.status(500).json({ error: "Error al crear usuario" });
  }
};

// ------------------------
// ✏️ Actualizar usuario existente
// ------------------------
exports.update = (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, password } = req.body;

    const existing = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
    if (!existing) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    let query, params;
    if (password && password.trim() !== "") {
      const hashedPassword = bcrypt.hashSync(password, 10);
      query = "UPDATE users SET name = ?, email = ?, role = ?, password = ? WHERE id = ?";
      params = [name, email, role, hashedPassword, id];
    } else {
      query = "UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?";
      params = [name, email, role, id];
    }

    const result = db.prepare(query).run(...params);
    if (result.changes === 0) {
      return res.status(404).json({ message: "Usuario no encontrado o sin cambios" });
    }

    res.json({ message: "Usuario actualizado correctamente" });
  } catch (err) {
    console.error("❌ Error al actualizar usuario:", err.message);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

// ------------------------
// 🗑️ Eliminar usuario
// ------------------------
exports.delete = (req, res) => {
  try {
    const { id } = req.params;
    const result = db.prepare("DELETE FROM users WHERE id = ?").run(id);

    if (result.changes === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (err) {
    console.error("❌ Error al eliminar usuario:", err.message);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};
