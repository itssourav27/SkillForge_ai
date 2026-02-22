const calculateScore = (quiz, submittedAnswers) => {
  let score = 0;
  let totalMarks = 0;

  const evaluatedAnswers = quiz.questions.map((question, index) => {
    const submitted = submittedAnswers[index];
    totalMarks += question.marks;

    if (!submitted) {
      return {
        questionId: question._id,
        selectedAnswer: null,
        isCorrect: false,
      };
    }

    if (submitted === question.correctAnswer) {
      score += question.marks;
      return {
        questionId: question._id,
        selectedAnswer: submitted,
        isCorrect: true,
      };
    } else {
      score -= question.negativeMarks;
      return {
        questionId: question._id,
        selectedAnswer: submitted,
        isCorrect: false,
      };
    }
  });

  return { score, totalMarks, evaluatedAnswers };
};

module.exports = calculateScore;
