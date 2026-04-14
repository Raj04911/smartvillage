import React, { useState, useEffect } from "react";
import "./Settings.css";

const Settings = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [profile, setProfile] = useState({
    name: "",
    email: ""
  });

  const [password, setPassword] = useState({
    current: "",
    newPass: "",
    confirm: ""
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    darkMode: false
  });

  useEffect(() => {
    if (storedUser) {
      setProfile({
        name: storedUser.name,
        email: storedUser.email
      });
    }
  }, []);

  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPassword({
      ...password,
      [e.target.name]: e.target.value
    });
  };

  const handleToggle = (key) => {
    setPreferences({
      ...preferences,
      [key]: !preferences[key]
    });
  };

  const handleSaveProfile = () => {
    const updatedUser = {
      ...storedUser,
      name: profile.name,
      email: profile.email
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    alert("Profile updated successfully");
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
    alert("Preferences saved");
  };

  return (
    <div className="settings-page">

      <h2>Settings</h2>

      {/* PROFILE */}
      <div className="settings-card">
        <h3>Profile Settings</h3>

        <input
          type="text"
          name="name"
          value={profile.name}
          onChange={handleProfileChange}
          placeholder="Full Name"
        />

        <input
          type="email"
          name="email"
          value={profile.email}
          onChange={handleProfileChange}
          placeholder="Email"
        />

        <button onClick={handleSaveProfile}>
          Save Profile
        </button>
      </div>

      {/* PASSWORD */}
      <div className="settings-card">
        <h3>Security</h3>

        <input
          type="password"
          name="current"
          value={password.current}
          onChange={handlePasswordChange}
          placeholder="Current Password"
        />

        <input
          type="password"
          name="newPass"
          value={password.newPass}
          onChange={handlePasswordChange}
          placeholder="New Password"
        />

        <input
          type="password"
          name="confirm"
          value={password.confirm}
          onChange={handlePasswordChange}
          placeholder="Confirm Password"
        />

        <button onClick={handleChangePassword}>
          Change Password
        </button>
      </div>

      {/* PREFERENCES */}
      <div className="settings-card">
        <h3>Preferences</h3>

        <div className="toggle-row">
          <span>Email Notifications</span>
          <input
            type="checkbox"
            checked={preferences.emailNotifications}
            onChange={() => handleToggle("emailNotifications")}
          />
        </div>

        <div className="toggle-row">
          <span>SMS Notifications</span>
          <input
            type="checkbox"
            checked={preferences.smsNotifications}
            onChange={() => handleToggle("smsNotifications")}
          />
        </div>

        <div className="toggle-row">
          <span>Dark Mode</span>
          <input
            type="checkbox"
            checked={preferences.darkMode}
            onChange={() => handleToggle("darkMode")}
          />
        </div>

        <button onClick={handleSavePreferences}>
          Save Preferences
        </button>
      </div>

    </div>
  );
};

export default Settings;