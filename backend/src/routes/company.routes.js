const express = require("express");
const router = express.Router();
const controller = require("../controllers/company.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

// Crear empresa
router.post("/", verifyToken, controller.createCompany);

// Listar empresas
router.get("/", verifyToken, controller.getAllCompanies);

// Obtener empresa por ID
router.get("/:id", verifyToken, controller.getCompanyById);

// Actualizar empresa
router.put("/:id", verifyToken, controller.updateCompany);

// Eliminar empresa
router.delete("/:id", verifyToken, controller.deleteCompany);

module.exports = router;
