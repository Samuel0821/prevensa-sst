// backend/src/middlewares/auth.middleware.js
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "prevensa_secret_key";

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) return res.status(401).json({ error: "No se proporcionó token" });

  const parts = authHeader.split(" ");
  if (parts.length !== 2) return res.status(401).json({ error: "Token inválido" });

  const scheme = parts[0];
  const token = parts[1];
  if (!/^Bearer$/i.test(scheme)) return res.status(401).json({ error: "Formato de token inválido" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token no válido o expirado" });
  }
};
