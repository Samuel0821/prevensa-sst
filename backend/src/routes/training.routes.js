const express = require("express");
const router = express.Router();
const trainingController = require("../controllers/training.controller");

// Rutas
router.get("/", trainingController.getAllTrainings);
router.post("/", trainingController.createTraining);

module.exports = router;
