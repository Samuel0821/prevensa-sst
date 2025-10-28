// backend/src/routes/user.routes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
// Corregido: Se importa el middleware de autenticación como `authenticate`
const { authenticate, isAdmin } = require("../middlewares/auth.middleware"); 

// --- Rutas de Administración de Usuarios (Solo para Admins) ---

// Obtener todos los usuarios
router.get("/", authenticate, isAdmin, userController.getAll);

// Crear un nuevo usuario
router.post("/", authenticate, isAdmin, userController.create);

// Actualizar un usuario existente
router.put("/:id", authenticate, isAdmin, userController.update);

// Corregido: Se cambió el nombre de la función de 'delete' a 'deleteUser'
router.delete("/:id", authenticate, isAdmin, userController.deleteUser);


// --- Ruta para Notificaciones Push (Para cualquier usuario autenticado) ---

// Guardar el token de notificación push del dispositivo
router.post(
  "/save-push-token", 
  authenticate, // Middleware para asegurar que el usuario esté logueado
  userController.savePushToken
);


module.exports = router;
