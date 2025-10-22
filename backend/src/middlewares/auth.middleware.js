const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || "prevensa_secret_key";

// Corregido: Se cambió el nombre de la función de 'verifyToken' a 'authenticate' para que coincida con la importación en las rutas.
// ✅ Verifica que el token JWT sea válido
exports.authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token no proporcionado" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
};

// ✅ Permite acceso solo a administradores
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Acceso denegado. Solo administradores." });
  }
  next();
};
