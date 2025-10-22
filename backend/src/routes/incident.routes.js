
// backend/src/routes/incident.routes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { getAllIncidents, createIncident, deleteIncident, updateIncident } = require("../controllers/incident.controller");
const { authenticate } = require("../middlewares/auth.middleware"); // Corregido: Ruta y nombre del middleware

// Configuración de subida de archivos (imágenes)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../../uploads")),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});

const upload = multer({ storage });

// Rutas
// Se aplica el middleware 'authenticate' para proteger las rutas
router.get("/", authenticate, getAllIncidents);
router.post("/", authenticate, upload.single("photo"), createIncident);
router.put("/:id", authenticate, updateIncident);
router.delete("/:id", authenticate, deleteIncident);

module.exports = router;
