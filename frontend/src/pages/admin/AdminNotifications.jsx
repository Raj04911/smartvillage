import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import "./AdminNotifications.css";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await api.get("/notifications", {
          params: {
            audience: "admin"
          }
        });
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error(error);
      }
    };

    loadNotifications();
    const interval = setInterval(loadNotifications, 4000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((note) => (note._id === notificationId ? { ...note, read: true } : note))
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>Notifications</h2>
        <p>Live operational events for new users, orders, reviews, and stock movement.</p>
      </div>

      <div className="notification-list">
        {notifications.map((note) => (
          <button
            key={note._id}
            className={`notification-card ${note.read ? "read" : "unread"}`}
            onClick={() => markAsRead(note._id)}
          >
            <div>
              <strong>{note.title}</strong>
              <p>{note.message}</p>
            </div>
            <span className="status">{note.read ? "Read" : "Unread"}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminNotifications;
