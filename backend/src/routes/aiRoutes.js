const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { explainAttempt } = require("../controllers/aiController");

router.get("/explain/:id", protect, explainAttempt);

module.exports = router;