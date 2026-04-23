import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { fallbackLocationFilters } from "../../utils/locationOptions";
import "./Settings.css";

const Settings = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    state: "",
    district: "",
    address: "",
    pincode: "",
    preferredCategory: "",
    preferredSeason: "",
    language: "English"
  });

  const [password, setPassword] = useState({
    current: "",
    newPass: "",
    confirm: ""
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    darkMode: false,
    seasonalAlerts: true,
    priceDropAlerts: true
  });

  useEffect(() => {
    if (storedUser) {
      setProfile((prev) => ({
        ...prev,
        name: storedUser.name || "",
        email: storedUser.email || "",
        phone: storedUser.phone || "",
        state: storedUser.state || "",
        district: storedUser.district || "",
        address: storedUser.addressLine || "",
        pincode: storedUser.pincode || "",
        preferredCategory: storedUser.preferredCategory || "",
        preferredSeason: storedUser.preferredSeason || "",
        language: storedUser.language || "English"
      }));
    }
  }, [storedUser]);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "state" ? { district: "" } : {})
    }));
  };

  const handlePasswordChange = (event) => {
    setPassword((prev) => ({
      ...prev,
      [event.target.name]: event.target.value
    }));
  };

  const handleToggle = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const response = await api.put(`/auth/users/${storedUser._id}`, {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        state: profile.state,
        district: profile.district,
        addressLine: profile.address,
        pincode: profile.pincode,
        preferredCategory: profile.preferredCategory,
        preferredSeason: profile.preferredSeason,
        language: profile.language
      });

      localStorage.setItem("user", JSON.stringify(response.data.user));
      alert("Profile updated successfully");
    } catch (error) {
      alert("Unable to update profile");
    }
  };

  const handleChangePassword = () => {
    if (password.newPass !== password.confirm) {
      alert("Passwords do not match");
      return;
    }

    alert("Password updated (demo only)");
    setPassword({ current: "", newPass: "", confirm: "" });
  };

  const handleSavePreferences = () => {
    localStorage.setItem("userPreferences", JSON.stringify(preferences));
    alert("Preferences saved");
  };

  const availableDistricts = profile.state
    ? fallbackLocationFilters.stateDistrictMap[profile.state] || []
    : fallbackLocationFilters.districts;

  return (
    <div className="settings-page">
      <h2>Settings</h2>

      <div className="settings-card">
        <h3>Profile Settings</h3>
        <div className="settings-grid">
          <input type="text" name="name" value={profile.name} onChange={handleProfileChange} placeholder="Full Name" />
          <input type="email" name="email" value={profile.email} onChange={handleProfileChange} placeholder="Email" />
          <input type="text" name="phone" value={profile.phone} onChange={handleProfileChange} placeholder="Phone" />
          <select name="state" value={profile.state} onChange={handleProfileChange}>
            <option value="">Select State</option>
            {fallbackLocationFilters.states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          <select name="district" value={profile.district} onChange={handleProfileChange}>
            <option value="">Select District</option>
            {availableDistricts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
          <input type="text" name="pincode" value={profile.pincode} onChange={handleProfileChange} placeholder="Pincode" />
          <input type="text" name="preferredCategory" value={profile.preferredCategory} onChange={handleProfileChange} placeholder="Preferred Crop Category" />
          <select name="preferredSeason" value={profile.preferredSeason} onChange={handleProfileChange}>
            <option value="">Preferred Season</option>
            {fallbackLocationFilters.seasons.map((season) => (
              <option key={season} value={season}>
                {season}
              </option>
            ))}
          </select>
          <select name="language" value={profile.language} onChange={handleProfileChange}>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Kannada">Kannada</option>
            <option value="Marathi">Marathi</option>
          </select>
        </div>
        <textarea name="address" value={profile.address} onChange={handleProfileChange} placeholder="Delivery Address" />
        <button onClick={handleSaveProfile}>Save Profile</button>
      </div>

      <div className="settings-card">
        <h3>Security</h3>
        <div className="settings-grid">
          <input type="password" name="current" value={password.current} onChange={handlePasswordChange} placeholder="Current Password" />
          <input type="password" name="newPass" value={password.newPass} onChange={handlePasswordChange} placeholder="New Password" />
          <input type="password" name="confirm" value={password.confirm} onChange={handlePasswordChange} placeholder="Confirm Password" />
        </div>
        <button onClick={handleChangePassword}>Change Password</button>
      </div>

      <div className="settings-card">
        <h3>Preferences</h3>
        {Object.entries(preferences).map(([key, value]) => (
          <div key={key} className="toggle-row">
            <span>{key.replace(/([A-Z])/g, " $1")}</span>
            <input type="checkbox" checked={value} onChange={() => handleToggle(key)} />
          </div>
        ))}
        <button onClick={handleSavePreferences}>Save Preferences</button>
      </div>
    </div>
  );
};

export default Settings;
