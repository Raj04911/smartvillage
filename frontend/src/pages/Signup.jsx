import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { fallbackLocationFilters } from "../utils/locationOptions";
import { sendOtpEmail } from "../utils/sendOtpEmail";
import "./Login.css";

const Signup = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    states: [],
    districts: [],
    stateDistrictMap: {}
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    state: "",
    district: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await api.get("/crops/filters");
        const apiFilters = response.data.filters;
        setFilters({
          ...fallbackLocationFilters,
          ...apiFilters,
          states: apiFilters?.states?.length ? apiFilters.states : fallbackLocationFilters.states,
          districts: apiFilters?.districts?.length ? apiFilters.districts : fallbackLocationFilters.districts,
          stateDistrictMap: Object.keys(apiFilters?.stateDistrictMap || {}).length
            ? apiFilters.stateDistrictMap
            : fallbackLocationFilters.stateDistrictMap
        });
      } catch (error) {
        console.error(error);
        setFilters(fallbackLocationFilters);
      }
    };

    fetchFilters();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "state" ? { district: "" } : {})
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/send-otp", {
        ...formData,
        purpose: "signup"
      });

      await sendOtpEmail({
        email: formData.email,
        name: formData.name,
        otp: response.data.otpCode
      });

      localStorage.setItem(
        "pendingAuth",
        JSON.stringify({
          ...formData,
          purpose: "signup",
          devOtp: response.data.devOtp || response.data.otpCode
        })
      );

      navigate("/verify");
    } catch (error) {
      alert(error.response?.data?.message || "Unable to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const availableDistricts = formData.state
    ? filters.stateDistrictMap[formData.state] || []
    : filters.districts;

  return (
    <div className="auth-shell">
      <div className="auth-panel auth-panel-rich">
        <div className="auth-copy">
          <span className="eyebrow">First-time user signup</span>
          <h1>Join the smart crop network with district-level access.</h1>
          <p>
            Create your profile once and unlock tailored crop discovery, district demand
            insights, and AI-based price guidance.
          </p>
        </div>

        <div className="login-box">
          <h2 className="login-title">Create your account</h2>
          <p className="login-subtitle">We will send a one-time password to your email.</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Full Name</label>
              <input name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input name="phone" value={formData.phone} onChange={handleChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>State</label>
                <select name="state" value={formData.state} onChange={handleChange} required>
                  <option value="">Select state</option>
                  {filters.states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>District</label>
                <select name="district" value={formData.district} onChange={handleChange} required>
                  <option value="">Select district</option>
                  {availableDistricts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Sending OTP..." : "Create Account"}
            </button>
          </form>

          <div className="auth-links">
            <span>Already have an account?</span>
            <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
