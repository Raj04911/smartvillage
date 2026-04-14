import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import "./Reports.css";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
);

const Reports = () => {
  const revenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Revenue (₹)",
        data: [20000, 35000, 40000, 50000, 65000],
        backgroundColor: "#14532d"
      }
    ]
  };

  const cropDistribution = {
    labels: ["Wheat", "Rice", "Tomato", "Onion"],
    datasets: [
      {
        data: [40, 25, 20, 15],
        backgroundColor: ["#14532d", "#1e40af", "#dc2626", "#f59e0b"]
      }
    ]
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>Platform Reports</h2>
        <p>Visual representation of system performance</p>
      </div>

      <div className="chart-grid">
        <div className="chart-card">
          <h3>Monthly Revenue</h3>
          <Bar data={revenueData} />
        </div>

        <div className="chart-card">
          <h3>Crop Distribution</h3>
          <Pie data={cropDistribution} />
        </div>
      </div>
    </div>
  );
};

export default Reports;