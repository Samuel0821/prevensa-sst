const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ error: "No se proporcionó token" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token inválido" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "clave_secreta");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token no válido o expirado" });
  }
};


