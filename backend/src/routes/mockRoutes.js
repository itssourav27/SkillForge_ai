const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  startMock,
  submitMock,
} = require("../controllers/mockController");

router.post("/start", protect, startMock);
router.post("/submit", protect, submitMock);

module.exports = router;