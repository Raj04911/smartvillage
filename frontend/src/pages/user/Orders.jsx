import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user?.email) {
      fetchOrders();
    }
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

  return (
    <div className="orders-page">
      <div className="page-header">
        <h2>Your Orders</h2>
        <p>Track your purchases</p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-orders">No orders yet</div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              
              <div className="order-top">
                <div>
                  <div className="order-id">Order #{order._id.slice(-5)}</div>
                  <div className="order-date">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="order-right">
                  <span className={`status-badge ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                  <div className="order-total">₹ {order.totalAmount}</div>
                </div>
              </div>

              <div className="order-details">
                <table className="details-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    {order.items.map((item, i) => (
                      <tr key={i}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>₹ {item.price}</td>
                        <td>₹ {item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;