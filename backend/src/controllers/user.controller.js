
// backend/src/controllers/user.controller.js
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const NotificationService = require('../services/notification.service'); // Importar el servicio
const UserModel = require('../models/user.model'); // Importar el modelo de usuario

// --- Existing functions (getAll, create, update, deleteUser) ---

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
exports.deleteUser = (req, res) => {
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

// ------------------------
// 📲 Guardar token de notificación push (FCM)
// ------------------------
exports.updateFCMToken = (req, res) => {
  try {
    const { fcmToken } = req.body; // Parámetro actualizado
    const userId = req.user.id; 

    if (!fcmToken) {
      return res.status(400).json({ message: "El token de notificación es requerido." });
    }

    const stmt = db.prepare("UPDATE users SET fcm_token = ? WHERE id = ?");
    const result = stmt.run(fcmToken, userId); // Variable actualizada

    if (result.changes === 0) {
      return res.status(404).json({ message: "Usuario no encontrado, no se pudo guardar el token." });
    }

    res.status(200).json({ message: "Token de notificación guardado correctamente." });

  } catch (err) {
    console.error("❌ Error al guardar el token de notificación:", err.message);
    if (err.message.includes("no such column: fcm_token")) {
        return res.status(500).json({ error: "Error de base de datos: La columna 'fcm_token' no existe en la tabla 'users'." });
    }
    res.status(500).json({ error: "Error interno del servidor al guardar el token." });
  }
};

// ------------------------
// 🎓 Asignar capacitación a un usuario
// ------------------------
exports.assignTraining = async (req, res) => {
  const { id: userId } = req.params;
  const { training_id, due_date } = req.body;

  try {
    // 1. Validar que el usuario y la capacitación existan
    const user = UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const training = db.prepare("SELECT name FROM trainings WHERE id = ?").get(training_id);
    if (!training) {
      return res.status(404).json({ message: "Capacitación no encontrada." });
    }

    // 2. Insertar la asignación en la base de datos
    const stmt = db.prepare(
      "INSERT INTO user_trainings (user_id, training_id, status, due_date) VALUES (?, ?, ?, ?)"
    );
    stmt.run(userId, training_id, 'pendiente', due_date);

    // 3. Enviar notificación push (si el usuario tiene un token)
    if (user.fcm_token) {
      const notificationTitle = 'Nueva Capacitación Asignada';
      const notificationBody = `Se te ha asignado la capacitación: "${training.name}".`;
      
      await NotificationService.sendNotification(
        [userId],
        notificationTitle,
        notificationBody,
        { type: 'new_training' }
      );
    }

    res.status(201).json({ message: "Capacitación asignada y notificación enviada correctamente." });

  } catch (error) {
    console.error("❌ Error al asignar la capacitación:", error);
    res.status(500).json({ error: "Error interno del servidor al asignar la capacitación." });
  }
};
