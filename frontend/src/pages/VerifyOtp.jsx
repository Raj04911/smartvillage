import React, { useState, useEffect } from "react";
import "./VerifyOtp.css";
import { useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [tempUser, setTempUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("tempUser"));
    if (!storedUser) {
      navigate("/");
    } else {
      setTempUser(storedUser);
    }
  }, [navigate]);

  const handleVerify = (e) => {
    e.preventDefault();

    if (otp !== "123456") {
      alert("Use 123456");
      return;
    }

    let role = "user";

    if (tempUser.email === "admin@gmail.com") {
      role = "admin";
    }

    const fakeUser = {
      id: tempUser.email,
      name: tempUser.name,
      email: tempUser.email,
      role: role
    };

    localStorage.setItem("user", JSON.stringify(fakeUser));
    localStorage.removeItem("tempUser");

    if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-box">
        <h2>Verify OTP</h2>
        <p>Enter OTP sent to {tempUser?.email}</p>

        <form onSubmit={handleVerify}>
          <input
            type="text"
            value={otp}
            maxLength="6"
            onChange={(e) => setOtp(e.target.value)}
            className="otp-input"
          />
          <button type="submit" className="verify-btn">
            Verify OTP
          </button>
        </form>

        <div style={{ marginTop: "10px", fontSize: "12px" }}>
          Demo OTP: 123456
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;