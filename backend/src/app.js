const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testroutes");
const quizRoutes = require("./routes/quizRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const aiRoutes = require("./routes/aiRoutes");
const mockRoutes = require("./routes/mockRoutes");
const performanceRoutes = require("./routes/performanceRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/mock", mockRoutes);
app.use("/api/performance", performanceRoutes);



app.get("/", (req, res) => {
  res.send("SkillForge GATE API Running 🚀");
});

module.exports = app;
