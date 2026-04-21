import React, { useState, useEffect } from "react";
import "./Navbar.css";

const Navbar = ({ onLogout, user }) => {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString());
      setDate(now.toLocaleDateString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="navbar">
      <div className="navbar-left">
        <div>
          <div className="navbar-kicker">Live Operations</div>
          <div className="navbar-title">Smart Agriculture Dashboard</div>
        </div>
      </div>

      <div className="navbar-center">
        <div className="navbar-date">{date}</div>
        <div className="navbar-time">{time}</div>
      </div>

      <div className="navbar-right">
        <div className="navbar-role">
          {user?.role === "admin" ? "Admin Control" : "User Workspace"}
        </div>
        <div className="navbar-user">
          {user?.name || "Guest"}
        </div>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
