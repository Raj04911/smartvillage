import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ collapsed, setCollapsed, role }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isPartialActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      
      <div className="sidebar-header">
        <h2>{collapsed ? "SV" : "Smart Village"}</h2>
      </div>

      <ul className="sidebar-links">

        {/* ================= ADMIN ================= */}
        {role === "admin" && (
          <>
            <li className={isActive("/admin") ? "active" : ""}>
              <Link to="/admin">Dashboard</Link>
            </li>

            <li className={isPartialActive("/admin/crops") ? "active" : ""}>
              <Link to="/admin/crops">Manage Crops</Link>
            </li>

            <li className={isActive("/admin/add-crop") ? "active" : ""}>
              <Link to="/admin/add-crop">Add Crop</Link>
            </li>

            <li className={isPartialActive("/admin/orders") ? "active" : ""}>
              <Link to="/admin/orders">Manage Orders</Link>
            </li>

            <li className={isPartialActive("/admin/users") ? "active" : ""}>
              <Link to="/admin/users">Manage Users</Link>
            </li>

            <li className={isPartialActive("/admin/reports") ? "active" : ""}>
              <Link to="/admin/reports">Reports</Link>
            </li>

            <li className={isPartialActive("/admin/analytics") ? "active" : ""}>
              <Link to="/admin/analytics">Analytics</Link>
            </li>

            <li className={isPartialActive("/admin/notifications") ? "active" : ""}>
              <Link to="/admin/notifications">Notifications</Link>
            </li>

            <li className={isPartialActive("/admin/settings") ? "active" : ""}>
              <Link to="/admin/settings">Settings</Link>
            </li>
          </>
        )}

        {/* ================= USER ================= */}
        {role === "user" && (
          <>
            <li className={isActive("/dashboard") ? "active" : ""}>
              <Link to="/dashboard">Dashboard</Link>
            </li>

            <li className={isPartialActive("/dashboard/crops") ? "active" : ""}>
              <Link to="/dashboard/crops">Crops</Link>
            </li>

            <li className={isPartialActive("/dashboard/cart") ? "active" : ""}>
              <Link to="/dashboard/cart">Cart</Link>
            </li>

            <li className={isPartialActive("/dashboard/orders") ? "active" : ""}>
              <Link to="/dashboard/orders">Orders</Link>
            </li>

            <li className={isPartialActive("/dashboard/profile") ? "active" : ""}>
              <Link to="/dashboard/profile">Profile</Link>
            </li>

            <li className={isPartialActive("/dashboard/notifications") ? "active" : ""}>
              <Link to="/dashboard/notifications">Notifications</Link>
            </li>

            <li className={isPartialActive("/dashboard/market-prices") ? "active" : ""}>
              <Link to="/dashboard/market-prices">Market Prices</Link>
            </li>

            <li className={isPartialActive("/dashboard/schemes") ? "active" : ""}>
              <Link to="/dashboard/schemes">Government Schemes</Link>
            </li>

            <li className={isPartialActive("/dashboard/support") ? "active" : ""}>
              <Link to="/dashboard/support">Support</Link>
            </li>

            <li className={isPartialActive("/dashboard/settings") ? "active" : ""}>
              <Link to="/dashboard/settings">Settings</Link>
            </li>
          </>
        )}

      </ul>

      <button
        className="collapse-btn"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? "→" : "←"}
      </button>
    </div>
  );
};

export default Sidebar;