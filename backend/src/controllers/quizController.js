const Quiz = require("../models/Quiz");
const Attempt = require("../models/Attempt");
const calculateScore = require("../utils/calculateScore");

exports.createQuiz = async (req, res) => {
  try {
    const { subject, topic, difficulty, questions } = req.body;

    const quiz = await Quiz.create({
      subject,
      topic,
      difficulty,
      questions,
    });

    res.status(201).json({
      message: "Quiz created successfully",
      quiz,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Don't send correct answers to frontend
    const quizData = quiz.toObject();
    quizData.questions = quizData.questions.map((q) => ({
      question: q.question,
      options: q.options,
      topic: q.topic,
      marks: q.marks,
      negativeMarks: q.negativeMarks,
      _id: q._id,
    }));

    res.json(quizData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const { answers } = req.body; // array of selected answers

    const { score, totalMarks, evaluatedAnswers } = calculateScore(
      quiz,
      answers,
    );

    const attempt = await Attempt.create({
      user: req.user._id,
      quiz: quiz._id,
      answers: evaluatedAnswers,
      score,
      totalMarks,
    });

    res.json({
      message: "Quiz submitted successfully",
      score,
      totalMarks,
      attempt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
