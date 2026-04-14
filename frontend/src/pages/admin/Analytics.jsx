import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";
import "./Analytics.css";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const Analytics = () => {
  const userGrowth = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "New Users",
        data: [20, 40, 60, 80],
        borderColor: "#1e40af",
        backgroundColor: "#1e40af",
        tension: 0.4
      }
    ]
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>Analytics Dashboard</h2>
        <p>User growth & performance tracking</p>
      </div>

      <div className="analytics-card">
        <Line data={userGrowth} />
      </div>
    </div>
  );
};

export default Analytics;