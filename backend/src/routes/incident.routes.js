// backend/src/routes/incident.routes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { getAllIncidents, createIncident, deleteIncident } = require("../controllers/incident.controller");

// Configuración de subida de archivos (imagenes)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../../uploads")),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});

const upload = multer({ storage });

// Rutas
router.get("/", getAllIncidents);
router.post("/", upload.single("photo"), createIncident);
router.delete("/:id", deleteIncident);

module.exports = router;
