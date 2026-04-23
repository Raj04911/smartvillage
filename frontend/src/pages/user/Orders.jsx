import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import TrackingMap from "../../components/orders/TrackingMap";
import { formatCurrency } from "../../utils/formatCurrency";
import "./Orders.css";

const trackingLabels = ["Ordered", "Shipped", "Delivered"];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [reviewDrafts, setReviewDrafts] = useState({});
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

  const handleDraftChange = (orderId, field, value) => {
    setReviewDrafts((prev) => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [field]: value
      }
    }));
  };

  const handleDownloadInvoice = (order) => {
    const invoiceWindow = window.open("", "_blank", "width=900,height=900");
    if (!invoiceWindow) {
      return;
    }

    const rows = order.items
      .map(
        (item) => `
          <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${formatCurrency(item.price)}</td>
            <td>${formatCurrency(item.total)}</td>
          </tr>
        `
      )
      .join("");

    invoiceWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${order._id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #1f2937; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #d1d5db; padding: 12px; text-align: left; }
            .top { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .total { margin-top: 20px; font-weight: 700; text-align: right; }
          </style>
        </head>
        <body>
          <div class="top">
            <div>
              <h1>Smart Crop Grid Invoice</h1>
              <p>Order ID: ${order._id}</p>
              <p>Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p>${order.userName}</p>
              <p>${order.userEmail}</p>
              <p>${order.district}, ${order.state}</p>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Crop</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          <div class="total">Grand Total: ${formatCurrency(order.totalAmount)}</div>
        </body>
      </html>
    `);
    invoiceWindow.document.close();
    invoiceWindow.print();
  };

  const handleSubmitReview = async (orderId) => {
    const draft = reviewDrafts[orderId];

    if (!draft?.rating || !draft?.comment) {
      alert("Please add rating and comment");
      return;
    }

    try {
      const response = await api.put(`/orders/review/${orderId}`, draft);
      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? response.data.order : order))
      );
      alert("Review submitted");
    } catch (error) {
      console.error(error);
      alert("Unable to submit review");
    }
  };

  return (
    <div className="orders-page">
      <div className="page-header">
        <h2>Your Orders</h2>
        <p>Track your purchases, download invoices, and leave crop quality reviews.</p>
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
                  <div className="order-total">{formatCurrency(order.totalAmount)}</div>
                </div>
              </div>

              <div className="tracking-strip">
                {trackingLabels.map((label, index) => (
                  <div
                    key={label}
                    className={`tracking-step ${index <= (order.trackingStage ?? 0) ? "active" : ""}`}
                  >
                    <div className="tracking-dot" />
                    <span>{label}</span>
                  </div>
                ))}
              </div>

              <div className="order-actions-row">
                <button className="action-btn-secondary" onClick={() => handleDownloadInvoice(order)}>
                  Download Invoice
                </button>
                <span className="order-location">
                  Delivery region: {order.district}, {order.state}
                </span>
              </div>

              <TrackingMap routeMap={order.routeMap} />

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
                    {order.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{formatCurrency(item.price)}</td>
                        <td>{formatCurrency(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {order.status === "Delivered" ? (
                <div className="review-panel">
                  <h4>Order Review</h4>
                  {order.review?.rating ? (
                    <p>
                      {order.review.rating}/5 - {order.review.comment}
                    </p>
                  ) : (
                    <>
                      <div className="review-grid">
                        <select
                          value={reviewDrafts[order._id]?.rating || ""}
                          onChange={(event) =>
                            handleDraftChange(order._id, "rating", Number(event.target.value))
                          }
                        >
                          <option value="">Rating</option>
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <option key={rating} value={rating}>
                              {rating} Star
                            </option>
                          ))}
                        </select>
                        <input
                          placeholder="Write a quick review"
                          value={reviewDrafts[order._id]?.comment || ""}
                          onChange={(event) =>
                            handleDraftChange(order._id, "comment", event.target.value)
                          }
                        />
                      </div>
                      <button
                        className="action-btn-secondary"
                        onClick={() => handleSubmitReview(order._id)}
                      >
                        Submit Review
                      </button>
                    </>
                  )}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
