
// backend/src/routes/user.routes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { authenticate, isAdmin } = require("../middlewares/auth.middleware");

// --- Rutas de Administración de Usuarios (Solo para Admins) ---

// Obtener todos los usuarios
router.get("/", authenticate, isAdmin, userController.getAll);

// Crear un nuevo usuario
router.post("/", authenticate, isAdmin, userController.create);

// Actualizar un usuario existente
router.put("/:id", authenticate, isAdmin, userController.update);

// Eliminar un usuario
router.delete("/:id", authenticate, isAdmin, userController.deleteUser);

// Asignar una capacitación a un usuario
router.post("/:id/trainings", authenticate, isAdmin, userController.assignTraining);


// --- Ruta para Notificaciones Push (Para cualquier usuario autenticado) ---

// Guardar el token de notificación push del dispositivo
router.post(
  "/update-fcm-token", // Ruta actualizada para coincidir con el frontend
  authenticate, 
  userController.updateFCMToken // Nombre de controlador actualizado
);


module.exports = router;
