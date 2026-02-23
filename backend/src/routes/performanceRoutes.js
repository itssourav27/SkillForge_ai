const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getPerformanceTrend } = require("../controllers/performanceController");

router.get("/", protect, getPerformanceTrend);

module.exports = router;