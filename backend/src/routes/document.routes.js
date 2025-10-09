// backend/src/routes/document.routes.js
const express = require("express");
const router = express.Router();
const documentController = require("../controllers/document.controller");
const { upload } = require("../services/file.service");

// Subir documento (multipart)
router.post("/", upload.single("file"), documentController.uploadDocument);
router.get("/", documentController.getAllDocuments);
router.delete("/:id", documentController.deleteDocument);

module.exports = router;
