// backend/src/routes/company.routes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/company.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/", verifyToken, controller.createCompany);
router.get("/", verifyToken, controller.getAllCompanies);
router.get("/:id", verifyToken, controller.getCompanyById);
router.put("/:id", verifyToken, controller.updateCompany);
router.delete("/:id", verifyToken, controller.deleteCompany);

module.exports = router;
