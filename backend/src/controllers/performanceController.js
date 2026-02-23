const MockTest = require("../models/MockTest");

exports.getPerformanceTrend = async (req, res) => {
  try {
    const mocks = await MockTest.find({ user: req.user._id })
      .sort({ startTime: 1 });

    const trend = mocks.map((mock, index) => ({
      testNumber: index + 1,
      score: mock.totalScore,
      totalMarks: mock.totalMarks,
      percentage:
        mock.totalMarks > 0
          ? ((mock.totalScore / mock.totalMarks) * 100).toFixed(2)
          : 0,
      date: mock.startTime,
    }));

    res.json({ trend });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};