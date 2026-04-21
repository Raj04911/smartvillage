import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { formatCurrency } from "../../utils/formatCurrency";
import "./AdminDashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await api.get("/admin/stats");
        setStats(response.data.stats);
      } catch (error) {
        console.error(error);
      }
    };

    loadStats();
  }, []);

  if (!stats) {
    return <div className="admin-dashboard">Loading admin dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Admin Dashboard Overview</h2>
        <p>Real-time system metrics pulled from the database</p>
      </div>

      <div className="admin-hero-panel">
        <div className="admin-hero-copy">
          <span className="hero-chip">Command Center</span>
          <h3>Monitor supply, users, and price momentum across your crop network.</h3>
          <p>
            This view is tuned for operational awareness, so the highest-value numbers and
            freshest activity stay visible first.
          </p>
        </div>
        <div className="admin-hero-metrics">
          <div>
            <strong>{stats.activeUsers}</strong>
            <span>active accounts</span>
          </div>
          <div>
            <strong>{stats.pendingOrders}</strong>
            <span>pending orders</span>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card green">
          <div className="stat-title">Total Users</div>
          <div className="stat-value">{stats.totalUsers}</div>
        </div>

        <div className="stat-card blue">
          <div className="stat-title">Total Crops</div>
          <div className="stat-value">{stats.totalCrops}</div>
        </div>

        <div className="stat-card orange">
          <div className="stat-title">Total Orders</div>
          <div className="stat-value">{stats.totalOrders}</div>
        </div>

        <div className="stat-card dark">
          <div className="stat-title">Total Revenue</div>
          <div className="stat-value">{formatCurrency(stats.totalRevenue)}</div>
        </div>
      </div>

      <div className="recent-section">
        <h3>Recent Orders</h3>

        <table className="recent-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Crop</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            {stats.recentOrders.map((order) => (
              <tr key={order._id}>
                <td>#{order._id.slice(-5)}</td>
                <td>{order.userName}</td>
                <td>{order.primaryCrop}</td>
                <td>{formatCurrency(order.totalAmount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="summary-section">
        <div className="summary-card">
          <h4>System Health</h4>
          <p>MongoDB-backed APIs operational</p>
        </div>

        <div className="summary-card">
          <h4>Active Users</h4>
          <p>{stats.activeUsers} active user accounts</p>
        </div>

        <div className="summary-card">
          <h4>Pending Orders</h4>
          <p>{stats.pendingOrders} orders waiting for action</p>
        </div>

        <div className="summary-card">
          <h4>Top Demand District</h4>
          <p>{stats.districtDemand?.[0]?.district || "No demand data yet"}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
