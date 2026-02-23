const User = require("../models/User");
const getRecommendations = require("../services/recommendationService");

exports.getRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const recommendations = await getRecommendations(user);

    res.json({
      message: "Recommendations generated",
      recommendations,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};