
// backend/src/controllers/auth.controller.js
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const SECRET = process.env.JWT_SECRET || "prevensa_secret_key";

exports.register = (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const existing = UserModel.findByEmail(email);
    if (existing) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

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
    // Acepta 'username' (de la app móvil) o 'email' (de la web)
    const { username, email, password } = req.body;
    const loginIdentifier = username || email;

    // Validar campos requeridos
    if (!loginIdentifier || !password) {
      return res
        .status(400)
        .json({ message: "Debe enviar email/usuario y contraseña" });
    }

    // Busca al usuario por su email (que es lo que se usa como username)
    const user = UserModel.findByEmail(loginIdentifier);
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

// Nueva función para obtener el perfil del usuario
exports.getProfile = (req, res) => {
  try {
    // El middleware 'protect' ya ha decodificado el token y ha puesto el usuario en req.user
    const userId = req.user.id;
    const user = UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Devolvemos solo la información pública y segura del usuario
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error("❌ Error en getProfile:", err);
    res.status(500).json({ message: "Error al obtener el perfil del usuario" });
  }
};
