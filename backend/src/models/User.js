const mongoose = require("mongoose");

const subjectStatSchema = new mongoose.Schema({
  accuracy: {
    type: Number,
    default: 0,
  },
  attempts: {
    type: Number,
    default: 0,
  },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "student",
    },

    // 🔥 SUBJECT PERFORMANCE TRACKING
    subjectStats: {
      os: {
        type: subjectStatSchema,
        default: () => ({}),
      },
      cn: {
        type: subjectStatSchema,
        default: () => ({}),
      },
      dbms: {
        type: subjectStatSchema,
        default: () => ({}),
      },
      dsa: {
        type: subjectStatSchema,
        default: () => ({}),
      },
      toc: {
        type: subjectStatSchema,
        default: () => ({}),
      },
      compiler: {
        type: subjectStatSchema,
        default: () => ({}),
      },
    },

    // 🔥 For leaderboard
    totalScore: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);