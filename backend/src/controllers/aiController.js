const Attempt = require("../models/Attempt");
const Quiz = require("../models/Quiz");
const generateExplanation = require("../services/aiService");

exports.explainAttempt = async (req, res) => {
  try {
    const attempt = await Attempt.findById(req.params.id).populate("quiz");

    if (!attempt) {
      return res.status(404).json({ message: "Attempt not found" });
    }

    const explanations = [];

    for (let i = 0; i < attempt.answers.length; i++) {
      const ans = attempt.answers[i];

      if (!ans.isCorrect) {
        const question = attempt.quiz.questions[i];

        const explanation = await generateExplanation(
          question.question,
          question.correctAnswer,
          ans.selectedAnswer
        );

        explanations.push({
          question: question.question,
          explanation,
        });
      }
    }

    res.json({ explanations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
