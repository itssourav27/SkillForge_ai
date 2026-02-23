const redis = require("../config/redis");
const User = require("../models/User");

exports.getLeaderboard = async (req, res) => {
  try {
    const totalUsers = await redis.zcard("leaderboard");

    const topUsers = await redis.zrevrange(
      "leaderboard",
      0,
      9,
      "WITHSCORES"
    );

    const formatted = [];

    for (let i = 0; i < topUsers.length; i += 2) {
      const userId = topUsers[i];
      const score = Number(topUsers[i + 1]);

      const rank = i / 2 + 1;
      const percentile =
        totalUsers > 0
          ? (((totalUsers - rank) / totalUsers) * 100).toFixed(2)
          : 0;

      formatted.push({
        rank,
        userId,
        score,
        percentile,
      });
    }

    res.json({
      totalUsers,
      leaderboard: formatted,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};