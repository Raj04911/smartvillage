import React, { useState } from "react";
import "./AdminNotifications.css";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New order placed", read: false },
    { id: 2, message: "New user registered", read: false },
    { id: 3, message: "Low stock alert", read: true }
  ]);

  const toggleRead = (id) => {
    const updated = notifications.map((note) =>
      note.id === id
        ? { ...note, read: !note.read }
        : note
    );
    setNotifications(updated);
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>Notifications</h2>
      </div>

      <div className="notification-list">
        {notifications.map((note) => (
          <div
            key={note.id}
            className={`notification-card ${
              note.read ? "read" : "unread"
            }`}
            onClick={() => toggleRead(note.id)}
          >
            {note.message}
            <span className="status">
              {note.read ? "Read" : "Unread"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminNotifications;