import React, { useState } from "react";
import "./ManageOrders.css";

const ManageOrders = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      user: "Ravi Kumar",
      crop: "Wheat",
      quantity: 50,
      total: 1250,
      status: "Pending"
    },
    {
      id: 2,
      user: "Anita Sharma",
      crop: "Rice",
      quantity: 40,
      total: 1200,
      status: "Confirmed"
    },
    {
      id: 3,
      user: "Mohit Singh",
      crop: "Tomato",
      quantity: 30,
      total: 900,
      status: "Delivered"
    }
  ]);

  const handleStatusChange = (id, newStatus) => {
    const updatedOrders = orders.map((order) =>
      order.id === id ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
  };

  return (
    <div className="manage-orders">
      <div className="page-header">
        <h2>Manage Orders</h2>
        <p>Track and update order status</p>
      </div>

      <div className="orders-table-section">
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Crop</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.user}</td>
                <td>{order.crop}</td>
                <td>{order.quantity} kg</td>
                <td>₹ {order.total}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    className={`status-select ${order.status.toLowerCase()}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageOrders;