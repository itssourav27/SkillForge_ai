const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { submitQuiz } = require("../controllers/quizController");

const {
  createQuiz,
  getQuizById,
} = require("../controllers/quizController");

router.post("/", protect, createQuiz);
router.get("/:id", protect, getQuizById);
router.post("/:id/submit", protect, submitQuiz);

module.exports = router;