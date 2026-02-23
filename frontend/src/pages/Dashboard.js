import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import PerformanceChart from "../components/PerformanceChart";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [trend, setTrend] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch Dashboard Data
        const dashRes = await API.get("/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Fetch Leaderboard
        const leadRes = await API.get("/leaderboard");

        // Fetch Performance Trend
        const trendRes = await API.get("/performance", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setDashboardData(dashRes.data);
        setLeaderboard(leadRes.data.leaderboard);
        setTrend(trendRes.data.trend);

      } catch (err) {
        navigate("/");
      }
    };

    fetchData();
  }, [navigate]);

  if (!dashboardData)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Title */}
      <h2 className="text-3xl font-bold mb-8">Dashboard</h2>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-gray-600">
            Total Score
          </h3>
          <p className="text-3xl font-bold mt-2 text-blue-600">
            {dashboardData.totalScore}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-gray-600">
            Total Attempts
          </h3>
          <p className="text-3xl font-bold mt-2 text-green-600">
            {dashboardData.attempts.length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-gray-600">
            Current Rank
          </h3>
          <p className="text-3xl font-bold mt-2 text-purple-600">
            {leaderboard.find(
              (u) => u.userId === dashboardData.userId
            )?.rank || "-"}
          </p>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white p-6 rounded-xl shadow mb-10">
        <h3 className="text-xl font-semibold mb-4">
          Performance Trend
        </h3>

        {trend.length > 0 ? (
          <PerformanceChart trend={trend} />
        ) : (
          <p className="text-gray-500">No mock tests yet.</p>
        )}
      </div>

      {/* Leaderboard */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">
          Leaderboard
        </h3>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4">Rank</th>
                <th className="py-2 px-4">User</th>
                <th className="py-2 px-4">Score</th>
                <th className="py-2 px-4">Percentile</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-2 px-4 font-semibold">
                    {user.rank}
                  </td>
                  <td className="py-2 px-4">
                    {user.userId}
                  </td>
                  <td className="py-2 px-4">
                    {user.score}
                  </td>
                  <td className="py-2 px-4">
                    {user.percentile}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;