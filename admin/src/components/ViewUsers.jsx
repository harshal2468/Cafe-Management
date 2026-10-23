import React, { useEffect, useState } from "react";
import "./ViewUsers.css";

function ViewUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletePopup, setDeletePopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [successPopup, setSuccessPopup] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  // =========================
  // FETCH USERS
  // =========================

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load users");
      }

      setUsers(data);
    } catch (error) {
      console.log("Users Fetch Error:", error);
      alert("Unable to load users");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DELETE USER
  // =========================

  const confirmDeleteUser = (user) => {
    setSelectedUser(user);
    setDeletePopup(true);
  };

  const deleteUser = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${selectedUser._id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete user");
      }

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== selectedUser._id),
      );

      setDeletePopup(false);
      setSelectedUser(null);

      setSuccessPopup(true);

      setTimeout(() => {
        setSuccessPopup(false);
      }, 2500);
    } catch (error) {
      console.log("Delete User Error:", error);
      setDeletePopup(false);
      alert(error.message || "Unable to delete user");
    }
  };

  // =========================
  // SEARCH USERS
  // =========================

  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase();

    return (
      user.name?.toLowerCase().includes(searchText) ||
      user.email?.toLowerCase().includes(searchText) ||
      user.mobile?.toString().includes(searchText) ||
      user.role?.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="users-page">
      {/* ================= HEADER ================= */}

      <div className="users-header">
        <div>
          <span className="users-small-title">USER MANAGEMENT</span>

          <h1>Registered Users</h1>

          <p>Manage and view all registered users</p>
        </div>

        <div className="total-users">
          <span>Total Users</span>
          <strong>{users.length}</strong>
        </div>
      </div>

      {/* ================= TABLE CARD ================= */}

      <div className="users-card">
        {/* TABLE HEADING */}

        <div className="table-heading">
          <div>
            <h2>User Details</h2>

            <p>List of all registered customers</p>
          </div>

          {/* SEARCH */}

          <div className="user-search">
            <span className="search-icon">⌕</span>

            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button className="clear-search" onClick={() => setSearch("")}>
                ×
              </button>
            )}
          </div>
        </div>

        {/* ================= CONTENT ================= */}

        {loading ? (
          <div className="users-loading">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="no-users">
            <h3>{search ? "No Users Found" : "No Users Found"}</h3>

            <p>
              {search
                ? "Try searching with another name, email or mobile number."
                : "There are currently no registered users."}
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user._id}>
                    {/* NUMBER */}

                    <td className="serial-number">{index + 1}</td>

                    {/* USER */}

                    <td>
                      <div className="user-info">
                        <div className="user-avatar">
                          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>

                        <div>
                          <strong>{user.name}</strong>

                          <small>User Account</small>
                        </div>
                      </div>
                    </td>

                    {/* EMAIL */}

                    <td>
                      <span className="email-text">{user.email}</span>
                    </td>

                    {/* MOBILE */}

                    <td>
                      <span className="mobile-text">
                        {user.mobile || "N/A"}
                      </span>
                    </td>

                    {/* ROLE */}

                    <td>
                      <span
                        className={`role-badge ${
                          user.role === "admin" ? "admin-role" : "user-role"
                        }`}
                      >
                        {user.role || "user"}
                      </span>
                    </td>

                    {/* DELETE */}

                    <td>
                      <button
                        className="delete-user-btn"
                        onClick={() => confirmDeleteUser(user)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* DELETE CONFIRMATION POPUP */}

            {deletePopup && (
              <div className="popup-overlay">
                <div className="delete-popup">
                  <div className="popup-icon delete-icon">!</div>

                  <h3>Delete User?</h3>

                  <p>
                    Are you sure you want to delete{" "}
                    <strong>{selectedUser?.name}</strong>?
                  </p>

                  <div className="popup-buttons">
                    <button
                      className="cancel-btn"
                      onClick={() => {
                        setDeletePopup(false);
                        setSelectedUser(null);
                      }}
                    >
                      Cancel
                    </button>

                    <button className="confirm-delete-btn" onClick={deleteUser}>
                      Yes, Delete
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SUCCESS POPUP */}

            {successPopup && (
              <div className="success-popup">
                <div className="success-check">✓</div>

                <div>
                  <strong>User Deleted</strong>
                  <span>User has been deleted successfully.</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewUsers;
