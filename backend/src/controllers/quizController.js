const Quiz = require("../models/Quiz");
const Attempt = require("../models/Attempt");
const User = require("../models/User");
const calculateScore = require("../utils/calculateScore");
const redis = require("../config/redis");

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

    const { answers } = req.body;

    const { score, totalMarks, evaluatedAnswers, weakTopics } =
      calculateScore(quiz, answers);

    const attempt = await Attempt.create({
      user: req.user._id,
      quiz: quiz._id,
      answers: evaluatedAnswers,
      score,
      totalMarks,
      weakTopics,
    });

    const user = await User.findById(req.user._id);
    user.totalScore += score;
    await user.save();

    await redis.del(`dashboard:${req.user._id}`);

    await redis.zadd(
      "leaderboard",
      user.totalScore,
      user._id.toString()
    );

    res.json({
      message: "Quiz submitted successfully",
      score,
      totalMarks,
      weakTopics,
      attempt,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};