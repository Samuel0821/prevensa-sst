// backend/src/routes/notification.routes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
// Corregido: Usar la desestructuración y el nombre correcto del middleware
const { authenticate } = require('../middlewares/auth.middleware');

// Ruta para que un usuario autenticado registre su token FCM
// Corregido: Usar 'authenticate' en lugar de 'authMiddleware.protect'
router.post('/register-token', authenticate, notificationController.registerToken);

module.exports = router;
