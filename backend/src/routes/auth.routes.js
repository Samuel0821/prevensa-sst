//backend/src/routes/auth.routes.js
const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth.controller");
// Corregido: El middleware se llama 'authenticate'
const { authenticate } = require("../middlewares/auth.middleware");

// Rutas de autenticación
router.post("/register", auth.register);
router.post("/login", auth.login);

// Ruta para obtener el perfil del usuario (protegida)
// Corregido: Usando el middleware correcto 'authenticate'
router.get("/profile", authenticate, auth.getProfile);

module.exports = router;
