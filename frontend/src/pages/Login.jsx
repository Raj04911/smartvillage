import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = (e) => {
    e.preventDefault();

    if (!email || !name) {
      alert("Please fill all fields");
      return;
    }
    localStorage.setItem(
      "tempUser",
      JSON.stringify({ email, name })
    );

    alert("Mock OTP Sent. Use 123456 to login.");
    navigate("/verify");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Smart Village Marketplace</h1>
        <p className="login-subtitle">
          Login using your email to continue
        </p>

        <form onSubmit={handleSendOtp} className="login-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button type="submit" className="login-btn">
            Send OTP
          </button>
        </form>

        <div className="login-footer">
          <p>© 2026 Smart Village System</p>
        </div>
      </div>
    </div>
  );
};

export default Login;