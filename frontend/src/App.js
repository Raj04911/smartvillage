import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import VerifyOtp from "./pages/VerifyOtp";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<VerifyOtp />} />

        <Route path="/dashboard/*" element={<UserLayout />} />
        <Route path="/admin/*" element={<AdminLayout />} />

        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}

export default App;