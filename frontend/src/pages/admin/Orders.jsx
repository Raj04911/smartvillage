import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import "./AdminOrders.css";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/all");
        setOrders(res.data.orders);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      const response = await api.put(`/orders/update/${orderId}`, { status });

      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? response.data.order : order))
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>Manage Orders</h2>
        <p>Advance orders through the three-stage delivery tracker.</p>
      </div>

      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Total</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.userName || "N/A"}</td>
                <td>{order.userEmail || "N/A"}</td>
                <td>₹ {order.totalAmount}</td>

                <td>
                  <span className={`status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>

                <td>
                  <select
                    value={order.status}
                    onChange={(event) => updateStatus(order._id, event.target.value)}
                  >
                    <option value="Ordered">Ordered</option>
                    <option value="Shipped">Shipped</option>
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

export default AdminOrders;
