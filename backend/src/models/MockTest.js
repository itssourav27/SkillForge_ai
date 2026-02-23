const mongoose = require("mongoose");

const mockTestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }],
  startTime: { type: Date, default: Date.now },
  endTime: Date,
  totalScore: Number,
  totalMarks: Number,
});

module.exports = mongoose.model("MockTest", mockTestSchema);