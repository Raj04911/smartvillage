import React, { useState } from "react";
import "./ManageUsers.css";

const ManageUsers = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "Ravi Kumar", email: "ravi@gmail.com", status: "Active" },
    { id: 2, name: "Anita Sharma", email: "anita@gmail.com", status: "Blocked" },
    { id: 3, name: "Mohit Singh", email: "mohit@gmail.com", status: "Active" },
    { id: 4, name: "Suresh Yadav", email: "suresh@gmail.com", status: "Active" }
  ]);

  const toggleStatus = (id) => {
    const updatedUsers = users.map((user) =>
      user.id === id
        ? {
            ...user,
            status: user.status === "Active" ? "Blocked" : "Active"
          }
        : user
    );
    setUsers(updatedUsers);
  };

  return (
    <div className="manage-users">
      <div className="page-header">
        <h2>Manage Users</h2>
        <p>View and control user accounts</p>
      </div>

      <div className="users-table-section">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>#{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span
                    className={`status-badge ${
                      user.status === "Active" ? "active" : "blocked"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td>
                  <button
                    className={`action-btn ${
                      user.status === "Active" ? "block" : "unblock"
                    }`}
                    onClick={() => toggleStatus(user.id)}
                  >
                    {user.status === "Active" ? "Block" : "Unblock"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;