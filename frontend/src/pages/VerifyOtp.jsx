import React, { useState, useEffect } from "react";
import "./VerifyOtp.css";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [pendingAuth, setPendingAuth] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAuth = JSON.parse(localStorage.getItem("pendingAuth"));
    if (!storedAuth) {
      navigate("/");
    } else {
      setPendingAuth(storedAuth);
    }
  }, [navigate]);

  const handleVerify = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/verify-otp", {
        email: pendingAuth?.email,
        otp
      });

      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.removeItem("pendingAuth");

      if (response.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response?.data?.requiresSignup) {
        localStorage.removeItem("pendingAuth");
        navigate("/signup");
        return;
      }

      alert(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-box">
        <h2>Verify OTP</h2>
        <p>Enter OTP sent to {pendingAuth?.email}</p>

        <form onSubmit={handleVerify}>
          <input
            type="text"
            value={otp}
            maxLength="6"
            onChange={(event) => setOtp(event.target.value)}
            className="otp-input"
          />
          <button type="submit" className="verify-btn" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="dev-otp-note">Check your inbox for the OTP email.</div>
      </div>
    </div>
  );
};

export default VerifyOtp;
