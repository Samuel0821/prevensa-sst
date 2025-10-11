// backend/src/routes/auth.routes.js
const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth.controller");

// Rutas de autenticación
router.post("/register", auth.register);
router.post("/login", auth.login);

module.exports = router;

