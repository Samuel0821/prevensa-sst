const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const SECRET = process.env.JWT_SECRET || "prevensa_secret_key";

exports.register = (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = UserModel.findByEmail(email);
    if (existing)
      return res.status(400).json({ message: "El correo ya está registrado" });

    const user = UserModel.create({ name, email, password, role });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = (req, res) => {
  try {
    const { email, password } = req.body;
    const user = UserModel.findByEmail(email);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const valid = UserModel.verifyPassword(password, user.password);
    if (!valid)
      return res.status(401).json({ message: "Contraseña incorrecta" });

    // ✅ Token válido por 8 horas
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET, {
      expiresIn: "8h",
    });

    // ✅ Respuesta limpia y consistente
    res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
