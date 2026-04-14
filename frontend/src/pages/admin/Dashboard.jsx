import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 120,
    totalCrops: 45,
    totalOrders: 230,
    totalRevenue: 185000
  });

  const [recentOrders] = useState([
    { id: 1, user: "Ravi Kumar", crop: "Wheat", amount: 2500 },
    { id: 2, user: "Anita Sharma", crop: "Rice", amount: 3200 },
    { id: 3, user: "Mohit Singh", crop: "Tomato", amount: 1800 },
    { id: 4, user: "Suresh Yadav", crop: "Onion", amount: 2100 }
  ]);

  useEffect(() => {
    setStats((prev) => ({ ...prev }));
  }, []);

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Admin Dashboard Overview</h2>
        <p>Monitor overall system performance</p>
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
          <div className="stat-value">₹ {stats.totalRevenue}</div>
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
            {recentOrders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.user}</td>
                <td>{order.crop}</td>
                <td>₹ {order.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="summary-section">
        <div className="summary-card">
          <h4>System Health</h4>
          <p>All services operational</p>
        </div>

        <div className="summary-card">
          <h4>Active Users</h4>
          <p>89 currently online</p>
        </div>

        <div className="summary-card">
          <h4>Pending Approvals</h4>
          <p>6 crops awaiting approval</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;