// backend/src/controllers/auth.controller.js
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const SECRET = process.env.JWT_SECRET || "prevensa_secret_key";

exports.register = (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validar campos requeridos
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    // Validar si el usuario ya existe
    const existing = UserModel.findByEmail(email);
    if (existing) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // Crear usuario
    const user = UserModel.create({ name, email, password, role });

    res.status(201).json({
      message: "Usuario registrado correctamente",
      user,
    });
  } catch (err) {
    console.error("❌ Error en register:", err);
    res.status(500).json({ message: "Error al registrar usuario" });
  }
};

exports.login = (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos requeridos
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Debe enviar correo y contraseña" });
    }

    const user = UserModel.findByEmail(email);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const valid = UserModel.verifyPassword(password, user.password);
    if (!valid)
      return res.status(401).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET, {
      expiresIn: "8h",
    });

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
