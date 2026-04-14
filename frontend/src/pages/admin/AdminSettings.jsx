import React, { useState } from "react";
import "./AdminSettings.css";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    maintenance: false,
    emailNotifications: true,
    autoApproveOrders: false,
    enableRegistration: true
  });

  const handleChange = (key) => {
    setSettings({
      ...settings,
      [key]: !settings[key]
    });
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>System Settings</h2>
      </div>

      <div className="settings-card">
        {Object.keys(settings).map((key) => (
          <div key={key} className="setting-row">
            <span>{key}</span>
            <input
              type="checkbox"
              checked={settings[key]}
              onChange={() => handleChange(key)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSettings;