import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import "./UserDashboard.css";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get(`/orders/user/${user._id || user.email}`);
        setOrders(res.data.orders);
      } catch (error) {
        console.error(error);
      }
    };

    if (user?.email) {
      fetchOrders();
    }
  }, [user?._id, user?.email]);

  const totalSpent = orders.reduce(
    (acc, order) => acc + order.totalAmount,
    0
  );

  const pendingOrders = orders.filter(
    (o) => o.status === "Pending"
  ).length;

  const completedOrders = orders.filter(
    (o) => o.status === "Delivered"
  ).length;

  const recentDistricts = [...new Set(
    orders.flatMap((order) => order.items.map((item) => item.district).filter(Boolean))
  )]
    .slice(0, 3)
    .join(" • ");

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <h2>Welcome, {user?.name}</h2>
        <p>Track your crop activity, buying rhythm, and district-level movement from one place.</p>
      </div>

      <div className="dashboard-hero-panel">
        <div className="hero-panel-copy">
          <span className="hero-chip">Buyer Intelligence</span>
          <h3>Stay ahead of mandi shifts with faster price and demand signals.</h3>
          <p>
            Your workspace now blends orders, location-aware crop access, and AI-backed
            forecasts so buying decisions feel timely instead of reactive.
          </p>
        </div>
        <div className="hero-panel-stats">
          <div>
            <strong>{orders.length}</strong>
            <span>orders tracked</span>
          </div>
          <div>
            <strong>{recentDistricts || "No districts yet"}</strong>
            <span>active districts</span>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card green">
          <div className="stat-title">Total Orders</div>
          <div className="stat-value">{orders.length}</div>
        </div>

        <div className="stat-card blue">
          <div className="stat-title">Total Spent</div>
          <div className="stat-value">₹ {totalSpent}</div>
        </div>

        <div className="stat-card orange">
          <div className="stat-title">Pending Orders</div>
          <div className="stat-value">{pendingOrders}</div>
        </div>
      </div>

      <div className="recent-section">
        <h3>Recent Orders</h3>

        <table className="recent-table">
          <thead>
            <tr>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.slice(0, 3).map((order) => (
              <tr key={order._id}>
                <td>
                  {order.items.map((item, i) => (
                    <div key={i}>{item.name}</div>
                  ))}
                </td>
                <td>₹ {order.totalAmount}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="summary-section">
        <div className="summary-card">
          <h4>Pending</h4>
          <p>{pendingOrders} Orders</p>
        </div>

        <div className="summary-card">
          <h4>Completed</h4>
          <p>{completedOrders} Delivered</p>
        </div>

        <div className="summary-card">
          <h4>Focus Region</h4>
          <p>{user?.district ? `${user.district}, ${user.state}` : "Choose a district filter"}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
