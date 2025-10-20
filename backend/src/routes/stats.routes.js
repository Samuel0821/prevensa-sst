
const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Definir la ruta para obtener las estadísticas del dashboard
// Se requiere un token válido para acceder
router.get('/dashboard', verifyToken, statsController.getDashboardStats);

module.exports = router;
