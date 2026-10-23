import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const login = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "123") {
      // Login successful
      localStorage.setItem("adminLogin", "true");

      navigate("/admin/dashboard");
    } else {
      alert("Invalid Username or Password");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        {/* Logo / Brand */}
        <div className="admin-login-brand">
          <div className="admin-coffee-icon">☕</div>

          <h1>BREWHUB</h1>

          <p>CAFE MANAGEMENT</p>
        </div>

        {/* Heading */}
        <div className="admin-login-heading">
          <h2>Admin Login</h2>

          <p>Login to access your admin panel</p>
        </div>

        {/* Login Form */}
        <form onSubmit={login}>
          {/* Username */}
          <div className="admin-input-group">
            <label>Username</label>

            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="admin-input-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Login Button */}
          <button type="submit" className="admin-login-button">
            Login
          </button>
        </form>

        <div className="admin-login-footer">
          <span>BREWHUB CAFE</span>
          <small>Admin Panel</small>
        </div>
      </div>
    </div>
  );
}

export default Login;
