const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getLatestMock } = require("../controllers/mockController");


const {
  startMock,
  submitMock,
} = require("../controllers/mockController");

router.post("/start", protect, startMock);
router.post("/submit", protect, submitMock);
router.get("/latest", protect, getLatestMock);

module.exports = router;