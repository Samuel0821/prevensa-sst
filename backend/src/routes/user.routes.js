//backend/src/routes/user.routes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { verifyToken, isAdmin } = require("../middlewares/auth.middleware");

// ✅ Solo administradores pueden gestionar usuarios
router.get("/", verifyToken, isAdmin, userController.getAll);
router.post("/", verifyToken, isAdmin, userController.create);
router.put("/:id", verifyToken, isAdmin, userController.update);
router.delete("/:id", verifyToken, isAdmin, userController.delete);

module.exports = router;
