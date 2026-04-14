import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";

import AdminDashboard from "../pages/admin/Dashboard";
import ManageCrops from "../pages/admin/ManageCrops";
import AddCrop from "../pages/admin/AddCrop";
import ManageUsers from "../pages/admin/ManageUsers";
import Reports from "../pages/admin/Reports";
import Analytics from "../pages/admin/Analytics";
import AdminNotifications from "../pages/admin/AdminNotifications";
import AdminSettings from "../pages/admin/AdminSettings";
import AdminOrders from "../pages/admin/Orders";

import "./AdminLayout.css";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="layout-container">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        role="admin"
      />

      <div className="main-section">
        <Navbar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onLogout={handleLogout}
        />

        <div className="content-area">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/crops" element={<ManageCrops />} />
            <Route path="/add-crop" element={<AddCrop />} />
            <Route path="/users" element={<ManageUsers />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/notifications" element={<AdminNotifications />} />
            <Route path="/settings" element={<AdminSettings />} />
            <Route path="orders" element={<AdminOrders />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;