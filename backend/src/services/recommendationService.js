const Attempt = require("../models/Attempt");
const Quiz = require("../models/Quiz");

const getRecommendations = async (user) => {
  const attempts = await Attempt.find({ user: user._id });

  const topicWeakness = {};

  // Aggregate weak topics
  attempts.forEach((attempt) => {
    for (let topic in attempt.weakTopics) {
      if (!topicWeakness[topic]) {
        topicWeakness[topic] = 0;
      }
      topicWeakness[topic] += attempt.weakTopics[topic];
    }
  });

  // Sort topics by weakness
  const sortedWeakTopics = Object.keys(topicWeakness).sort(
    (a, b) => topicWeakness[b] - topicWeakness[a]
  );

  const recommendedQuizzes = await Quiz.find({
    topic: { $in: sortedWeakTopics.slice(0, 3) },
  }).limit(5);

  return recommendedQuizzes;
};

module.exports = getRecommendations;