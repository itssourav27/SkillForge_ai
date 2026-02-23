import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function MockAnalytics() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await API.get("/mock/latest", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.data || res.data.message === "No mock data") {
          setData(null);
        } else {
          setData(res.data);
        }
      } catch (err) {
        navigate("/");
      }
    };

    fetchData();
  }, [navigate]);

  if (!data)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-600">No mock data available.</p>
      </div>
    );

  const pieData = {
    labels: Object.keys(data.subjectBreakdown),
    datasets: [
      {
        data: Object.values(data.subjectBreakdown),
        backgroundColor: [
          "#3B82F6",
          "#10B981",
          "#F59E0B",
          "#EF4444",
          "#8B5CF6",
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h2 className="text-3xl font-bold mb-8">Mock Analytics</h2>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-600 font-semibold">Total Score</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {data.totalScore}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-600 font-semibold">Total Marks</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {data.totalMarks}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-600 font-semibold">Accuracy</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {data.accuracy}%
          </p>
        </div>

      </div>

      {/* Weak Subjects */}
      <div className="bg-white p-6 rounded-xl shadow mb-10">
        <h3 className="text-xl font-semibold mb-4">Weak Subjects</h3>

        {data.weakSubjects.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {data.weakSubjects.map((sub, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-medium"
              >
                {sub}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-green-600 font-medium">
            None 🎉 Great performance!
          </p>
        )}
      </div>

      {/* Pie Chart */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">
          Subject Breakdown
        </h3>

        <div className="max-w-md">
          <Pie data={pieData} />
        </div>
      </div>

    </div>
  );
}

export default MockAnalytics;