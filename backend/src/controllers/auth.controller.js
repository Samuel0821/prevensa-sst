
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../config/db");
const SECRET = process.env.JWT_SECRET || "prevensa_secret_key";

exports.register = (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const existing = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (existing) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);

    const stmt = db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
    const info = stmt.run(name, email, hashedPassword, role);

    const newUser = db.prepare("SELECT id, name, email, role FROM users WHERE id = ?").get(info.lastInsertRowid);

    res.status(201).json({
      message: "Usuario registrado correctamente",
      user: newUser,
    });
  } catch (err) {
    console.error("❌ Error en register:", err);
    res.status(500).json({ message: "Error al registrar usuario" });
  }
};

exports.login = (req, res) => {
  try {
    const { username, email, password } = req.body;
    const loginIdentifier = username || email;

    if (!loginIdentifier || !password) {
      return res.status(400).json({ message: "Debe enviar email/usuario y contraseña" });
    }

    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(loginIdentifier);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: "8h" });

    res.json({
      message: "Login exitoso",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("❌ Error en login:", err);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};

exports.getProfile = (req, res) => {
  try {
    const userId = req.user.id;
    const user = db.prepare("SELECT id, name, email, role FROM users WHERE id = ?").get(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (err) {
    console.error("❌ Error en getProfile:", err);
    res.status(500).json({ message: "Error al obtener el perfil del usuario" });
  }
};
