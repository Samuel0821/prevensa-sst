const express = require("express");
const router = express.Router();
const documentController = require("../controllers/document.controller");
const { upload } = require("../services/file.service");

// 📎 Subir documento (con multer)
router.post("/", upload.single("file"), documentController.uploadDocument);

// 📋 Listar todos
router.get("/", documentController.getAllDocuments);

// ❌ Eliminar documento
router.delete("/:id", documentController.deleteDocument);

module.exports = router;

