const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth.middleware");
const dashboardController = require("../controllers/dashboard.controller");

router.get("/", verifyToken, dashboardController.getStats);

module.exports = router;
