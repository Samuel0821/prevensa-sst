const express = require("express");
const router = express.Router();
const controller = require("../controllers/incident.controller");
const { upload } = require("../services/file.service");
const { verifyToken } = require("../middlewares/auth.middleware");

// 📸 Crear incidente (con imagen)
router.post("/", verifyToken, upload.single("photo"), controller.createIncident);

// 📋 Listar incidentes
router.get("/", verifyToken, controller.getAllIncidents);

// ❌ Eliminar incidente
router.delete("/:id", verifyToken, controller.deleteIncident);

module.exports = router;
