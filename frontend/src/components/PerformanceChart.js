import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

function PerformanceChart({ trend }) {
  const data = {
    labels: trend.map((t) => `Test ${t.testNumber}`),
    datasets: [
      {
        label: "Percentage",
        data: trend.map((t) => t.percentage),
        borderColor: "blue",
        fill: false,
      },
    ],
  };

  return <Line data={data} />;
}

export default PerformanceChart;