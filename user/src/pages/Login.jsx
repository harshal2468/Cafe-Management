import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

import cafeLogo from "../images/coffe.jpg";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  // ==============================
  // LOGIN
  // ==============================
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update Navbar
        window.dispatchEvent(new Event("authUpdated"));

        // Success popup
        setSuccessMessage("Login Successful! 🎉");

        // Redirect after popup animation
        setTimeout(() => {
          if (data.user.role === "admin") {
            window.location.href = "http://localhost:3001/admin/dashboard";
          } else {
            navigate("/");
          }
        }, 1500);
      } else {
        alert(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.log("Login Error:", error);

      alert("Server connection error");
    }
  };

  return (
    <div className="login-page">
      {successMessage && (
        <div className="login-success-popup">
          <div className="login-success-icon">✓</div>

          <div className="login-success-content">
            <h3>Success!</h3>

            <p>{successMessage}</p>
          </div>
        </div>
      )}
      {/* LEFT SIDE */}

      <div className="login-left">
        <div className="login-overlay">
          <div className="cafe-logo">BREWHUB</div>

          <h1>Welcome Back</h1>

          <p>
            Enjoy fresh coffee, delicious food and wonderful moments at BrewHub
            Cafe.
          </p>

          <div className="login-line"></div>
        </div>
      </div>

      {/* RIGHT SIDE */}

      <div className="login-right">
        <div className="login-box">
          <div className="login-logo">
            <img src={cafeLogo} alt="Cafe Logo" />
          </div>

          <div className="login-heading">
            <span>CAFE MANAGEMENT</span>

            <h2>Welcome Back!</h2>

            <p>Login to continue to your account</p>
          </div>

          <form onSubmit={handleLogin}>
            {/* EMAIL */}

            <div className="input-group">
              <label>Email ID</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* PASSWORD */}

            <div className="input-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* OPTIONS */}

            <div className="login-options">
              <label className="remember">
                <input type="checkbox" />

                <span>Remember me</span>
              </label>

              <Link to="/forgot-password">Forgot Password?</Link>
            </div>

            {/* LOGIN BUTTON */}

            <button type="submit" className="login-submit">
              Login
            </button>
          </form>

          {/* REGISTER */}

          <div className="register-text">
            Don't have an account?
            <Link to="/register"> Create Account</Link>
          </div>

          {/* HOME */}

          <Link to="/" className="back-home">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
