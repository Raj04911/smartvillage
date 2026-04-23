import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import "./Notifications.css";

const Notifications = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await api.get("/notifications", {
          params: {
            audience: "user",
            userId: user?._id || user?.email
          }
        });
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error(error);
      }
    };

    loadNotifications();
    const interval = setInterval(loadNotifications, 5000);
    return () => clearInterval(interval);
  }, [user?._id, user?.email]);

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
    <div className="notifications-page">
      <div className="notifications-header">
        <h2>Notifications</h2>
        <p>Live alerts for orders, tracking, and account activity</p>
      </div>

      <div className="notifications-list">
        {notifications.map((note) => (
          <button
            key={note._id}
            className={`notification-card ${note.read ? "read" : "unread"}`}
            onClick={() => markAsRead(note._id)}
          >
            <div>
              <div className="notification-message">{note.title}</div>
              <div className="notification-text">{note.message}</div>
            </div>
            <div className="notification-time">
              {new Date(note.createdAt).toLocaleString("en-IN")}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
