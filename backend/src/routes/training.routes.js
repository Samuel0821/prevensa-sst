// backend/src/routes/training.routes.js
const express = require("express");
const router = express.Router();
const trainingController = require("../controllers/training.controller");

// Obtener todas las capacitaciones
router.get("/", trainingController.getAllTrainings);

// Crear nueva capacitación
router.post("/", trainingController.createTraining);

// Actualizar capacitación
router.put("/:id", trainingController.updateTraining);

// Eliminar capacitación
router.delete("/:id", trainingController.deleteTraining);

module.exports = router;
