import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import "./ManageUsers.css";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await api.get("/auth/users");
        setUsers(response.data.users);
      } catch (error) {
        console.error(error);
      }
    };

    loadUsers();
  }, []);

  return (
    <div className="manage-users">
      <div className="page-header">
        <h2>Manage Users</h2>
        <p>Live verified users and their district profiles</p>
      </div>

      <div className="users-table-section">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Location</th>
              <th>Status</th>
              <th>Role</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>#{user._id.slice(-5)}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.district}, {user.state}</td>
                <td>
                  <span
                    className={`status-badge ${
                      user.status === "Active" ? "active" : "blocked"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
