
// backend/src/routes/auth.routes.js
const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth.controller");
// Corregido: El middleware se llama 'verifyToken', no 'protect'
const { verifyToken } = require("../middlewares/auth.middleware");

// Rutas de autenticación
router.post("/register", auth.register);
router.post("/login", auth.login);

// Ruta para obtener el perfil del usuario (protegida)
// Corregido: Usando el middleware correcto 'verifyToken'
router.get("/profile", verifyToken, auth.getProfile);

module.exports = router;
