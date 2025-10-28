//backend/src/routes/company.routes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/company.controller");
// Corregido: Usar 'authenticate' en lugar de 'verifyToken'
const { authenticate } = require("../middlewares/auth.middleware");

router.post("/", authenticate, controller.createCompany);
router.get("/", authenticate, controller.getAllCompanies);
router.get("/:id", authenticate, controller.getCompanyById);
router.put("/:id", authenticate, controller.updateCompany);
router.delete("/:id", authenticate, controller.deleteCompany);

module.exports = router;
