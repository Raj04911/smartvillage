import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";

import Dashboard from "../pages/user/Dashboard";
import Crops from "../pages/user/Crops";
import Cart from "../pages/user/Cart";
import Orders from "../pages/user/Orders";
import Profile from "../pages/user/Profile";
import MarketPrices from "../pages/user/Market-Prices";
import Notifications from "../pages/user/Notifications";
import Schemes from "../pages/user/Schemes";
import Settings from "../pages/user/Settings";
import Support from "../pages/user/Support";

import "./UserLayout.css";

const UserLayout = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.role !== "user") {
      navigate("/");
      return;
    }

    setUser(storedUser);
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
        role="user"
      />

      <div className="main-section">
        <Navbar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onLogout={handleLogout}
          user={user}
        />

        <div className="content-area">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/crops" element={<Crops />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<Profile />} />

            <Route path="/market-prices" element={<MarketPrices />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/schemes" element={<Schemes />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/support" element={<Support />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
