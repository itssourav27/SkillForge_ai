const Quiz = require("../models/Quiz");
const MockTest = require("../models/MockTest");
const User = require("../models/User");
const calculateScore = require("../utils/calculateScore");
const redis = require("../config/redis");

/**
 * 🚀 Start Mock Test
 */
exports.startMock = async (req, res) => {
  try {
    const quizzes = await Quiz.find().limit(5);

    if (!quizzes.length) {
      return res.status(400).json({ message: "No quizzes available" });
    }

    const mock = await MockTest.create({
      user: req.user._id,
      quizzes: quizzes.map((q) => q._id),
      startTime: new Date(),
    });

    res.json({
      message: "Mock test started",
      mockId: mock._id,
      quizzes,
      durationMinutes: 180,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/**
 * 🧠 Submit Mock Test + Analytics
 */
exports.submitMock = async (req, res) => {
  try {
    const { mockId, answers } = req.body;

    const mock = await MockTest.findById(mockId).populate("quizzes");

    if (!mock) {
      return res.status(404).json({ message: "Mock not found" });
    }

    let totalScore = 0;
    let totalMarks = 0;

    const subjectStats = {};

    for (let i = 0; i < mock.quizzes.length; i++) {
      const quiz = mock.quizzes[i];
      const result = calculateScore(quiz, answers[i]);

      totalScore += result.score;
      totalMarks += result.totalMarks;

      // 🔥 Subject-wise aggregation
      if (!subjectStats[quiz.subject]) {
        subjectStats[quiz.subject] = {
          score: 0,
          total: 0,
        };
      }

      subjectStats[quiz.subject].score += result.score;
      subjectStats[quiz.subject].total += result.totalMarks;
    }

    // Save mock results
    mock.totalScore = totalScore;
    mock.totalMarks = totalMarks;
    mock.endTime = new Date();
    await mock.save();

    // 🔥 Update user total score
    const user = await User.findById(req.user._id);
    user.totalScore += totalScore;
    await user.save();

    // 🔥 Update leaderboard in Redis
    await redis.zadd(
      "leaderboard",
      user.totalScore,
      user._id.toString()
    );

    // 🔥 Overall Accuracy
    const accuracy =
      totalMarks > 0
        ? ((totalScore / totalMarks) * 100).toFixed(2)
        : "0.00";

    // 🔥 Subject Breakdown
    const subjectBreakdown = {};
    const weakSubjects = [];

    for (let subject in subjectStats) {
      const percent =
        subjectStats[subject].total > 0
          ? (subjectStats[subject].score /
              subjectStats[subject].total) *
            100
          : 0;

      subjectBreakdown[subject] = percent.toFixed(2);

      if (percent < 50) {
        weakSubjects.push(subject);
      }
    }

    res.json({
      message: "Mock submitted successfully",
      totalScore,
      totalMarks,
      accuracy,
      subjectBreakdown,
      weakSubjects,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * 📊 Get Latest Mock Analytics
 */
exports.getLatestMock = async (req, res) => {
  try {
    const mock = await MockTest.findOne({ user: req.user._id })
      .sort({ startTime: -1 });

    if (!mock) {
      return res.json({ message: "No mock data" });
    }

    const accuracy =
      mock.totalMarks > 0
        ? ((mock.totalScore / mock.totalMarks) * 100).toFixed(2)
        : "0.00";

    res.json({
      totalScore: mock.totalScore,
      totalMarks: mock.totalMarks,
      accuracy,
      subjectBreakdown: mock.subjectBreakdown || {},
      weakSubjects: mock.weakSubjects || [],
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};