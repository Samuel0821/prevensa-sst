
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
// Corregido: Usar la desestructuración y el nombre correcto del middleware
const { authenticate } = require('../middlewares/auth.middleware');

// Ruta para generar el reporte de incidentes en PDF
// Corregido: Usar 'authenticate' en lugar de 'authMiddleware.protect'
router.get('/incidents', authenticate, reportController.generateIncidentReport);

module.exports = router;
