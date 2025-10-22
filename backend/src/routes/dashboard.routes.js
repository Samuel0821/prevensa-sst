const express = require("express");
const router = express.Router();
// Corregido: Usar 'authenticate' en lugar de 'verifyToken'
const { authenticate } = require("../middlewares/auth.middleware");
const dashboardController = require("../controllers/dashboard.controller");

router.get("/", authenticate, dashboardController.getStats);

module.exports = router;
