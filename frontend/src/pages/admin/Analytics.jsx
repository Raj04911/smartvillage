import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  BarElement
} from "chart.js";
import api from "../../utils/api";
import "./Analytics.css";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  BarElement
);

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const response = await api.get("/admin/analytics");
        setAnalytics(response.data.analytics);
      } catch (error) {
        console.error(error);
      }
    };

    loadAnalytics();
  }, []);

  if (!analytics) {
    return <div className="admin-page">Loading analytics...</div>;
  }

  const userGrowth = {
    labels: analytics.growthLabels,
    datasets: [
      {
        label: "New Users",
        data: analytics.growthValues,
        borderColor: "#1e40af",
        backgroundColor: "#1e40af",
        tension: 0.4
      }
    ]
  };

  const cropPerformance = {
    labels: analytics.cropPerformance.map((item) => item.label),
    datasets: [
      {
        label: "Crop AI Score",
        data: analytics.cropPerformance.map((item) => item.value),
        backgroundColor: "#2f855a"
      }
    ]
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>Analytics Dashboard</h2>
        <p>User growth and crop performance tracking from live data</p>
      </div>

      <div className="analytics-card">
        <Line data={userGrowth} />
      </div>

      <div className="analytics-card">
        <Bar data={cropPerformance} />
      </div>
    </div>
  );
};

export default Analytics;
