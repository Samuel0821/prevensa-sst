// backend/src/routes/stats.routes.js
const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');
// Corregido: Usar 'authenticate' en lugar de 'verifyToken'
const { authenticate } = require('../middlewares/auth.middleware');

// Definir la ruta para obtener las estadísticas del dashboard
// Se requiere un token válido para acceder
router.get('/dashboard', authenticate, statsController.getDashboardStats);

module.exports = router;
