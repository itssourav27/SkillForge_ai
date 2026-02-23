const redis = require("../config/redis");
const User = require("../models/User");
const Attempt = require("../models/Attempt");

exports.getDashboard = async (req, res) => {
  try {
    const cacheKey = `dashboard:${req.user._id}`;

    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }
    if (cachedData) {
  console.log("Serving from Redis cache");
  return res.json(JSON.parse(cachedData));
}

    const user = await User.findById(req.user._id).select("-password");
    const attempts = await Attempt.find({ user: req.user._id });

    const response = {
      subjectStats: user.subjectStats,
      totalAttempts: attempts.length,
      attempts,
    };

    await redis.set(cacheKey, JSON.stringify(response), "EX", 300);

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
