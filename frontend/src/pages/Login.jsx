import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { sendOtpEmail } from "../utils/sendOtpEmail";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (event) => {
    event.preventDefault();

    if (!email) {
      alert("Please enter your email");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/send-otp", {
        email,
        purpose: "login"
      });

      const emailResult = await sendOtpEmail({
        email,
        otp: response.data.otpCode
      });

      if (!emailResult.sent) {
        throw new Error(emailResult.reason || "OTP email was not sent");
      }

      localStorage.setItem(
        "pendingAuth",
        JSON.stringify({
          email,
          purpose: "login"
        })
      );

      alert("OTP sent to your email.");
      navigate("/verify");
    } catch (error) {
      alert(error.response?.data?.message || error.message || "Unable to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-panel auth-panel-rich">
        <div className="auth-copy">
          <span className="eyebrow">Returning user login</span>
          <h1>Step into live crop intelligence and mandi-ready buying.</h1>
          <p>
            Sign in with email OTP to view your district recommendations, order flow,
            and admin-ready analytics.
          </p>
        </div>

        <div className="login-box">
          <h1 className="login-title">Smart Agriculture Control</h1>
          <p className="login-subtitle">Email OTP login powered for quick access</p>

          <form onSubmit={handleSendOtp} className="login-form">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>

          <div className="auth-links">
            <span>First time here?</span>
            <Link to="/signup">Create account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
