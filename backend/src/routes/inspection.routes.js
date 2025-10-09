const express = require("express");
const router = express.Router();
const inspectionController = require("../controllers/inspection.controller");

router.get("/", inspectionController.getAllInspections);
router.post("/", inspectionController.createInspection);

module.exports = router;
