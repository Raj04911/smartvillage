import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserDashboard.css";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/orders/user/${user.email}`
      );
      setOrders(res.data.orders);
    } catch (error) {
      console.error(error);
    }
  };

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

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <h2>Welcome, {user?.name}</h2>
        <p>Here is your activity overview</p>
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
      </div>
    </div>
  );
};

export default Dashboard;