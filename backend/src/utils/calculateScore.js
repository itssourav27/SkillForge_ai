const calculateScore = (quiz, submittedAnswers) => {
  let score = 0;
  let totalMarks = 0;
  const weakTopics = {};

  const evaluatedAnswers = quiz.questions.map((question, index) => {
    const submitted = submittedAnswers[index];
    totalMarks += question.marks;

    if (!submitted || submitted !== question.correctAnswer) {
      score -= question.negativeMarks;

      if (!weakTopics[question.topic]) {
        weakTopics[question.topic] = 0;
      }
      weakTopics[question.topic] += 1;

      return {
        questionId: question._id,
        selectedAnswer: submitted || null,
        isCorrect: false,
      };
    }

    score += question.marks;

    return {
      questionId: question._id,
      selectedAnswer: submitted,
      isCorrect: true,
    };
  });

  return { score, totalMarks, evaluatedAnswers, weakTopics };
};

module.exports = calculateScore;