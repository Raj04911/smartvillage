import React, { useState, useEffect } from "react";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setFormData({
        name: storedUser.name || "",
        email: storedUser.email || "",
        phone: storedUser.phone || "",
        address: storedUser.address || ""
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = (e) => {
    e.preventDefault();

    const updatedUser = {
      ...user,
      ...formData
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);

    alert("Profile updated successfully");
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h2>Your Profile</h2>
        <p>Manage your personal information</p>
      </div>

      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-avatar">
            {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
          </div>

          <div className="profile-info">
            <h3>{formData.name}</h3>
            <p>{formData.email}</p>
            <span className="role-badge">{user?.role}</span>
          </div>
        </div>

        <div className="profile-form">
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
              ></textarea>
            </div>

            <button type="submit" className="save-btn">
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;