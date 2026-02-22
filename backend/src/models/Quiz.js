const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  topic: { type: String, required: true },
  marks: { type: Number, default: 1 },
  negativeMarks: { type: Number, default: 0.33 }
});

const quizSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },   // OS, CN, DBMS
    topic: { type: String, required: true },
    difficulty: { type: String, default: "easy" },
    questions: [questionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);