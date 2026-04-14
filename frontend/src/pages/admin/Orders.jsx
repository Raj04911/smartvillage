import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminOrders.css";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/orders/all"
      );
      setOrders(res.data.orders);
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/orders/update/${orderId}`,
        { status }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? { ...order, status }
            : order
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="admin-page">
      <h2>Manage Orders</h2>

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
                    onChange={(e) =>
                      updateStatus(order._id, e.target.value)
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
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