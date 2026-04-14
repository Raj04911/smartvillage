import React, { useState } from "react";
import "./Notifications.css";

const Notifications = () => {
  const [notifications] = useState([
    { id: 1, message: "Order #2 confirmed", time: "2 hours ago" },
    { id: 2, message: "New scheme added", time: "1 day ago" },
    { id: 3, message: "Tomato price increased", time: "3 days ago" }
  ]);

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h2>Notifications</h2>
        <p>Stay updated with system alerts</p>
      </div>

      <div className="notifications-list">
        {notifications.map((note) => (
          <div key={note.id} className="notification-card">
            <div className="notification-message">
              {note.message}
            </div>
            <div className="notification-time">
              {note.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;