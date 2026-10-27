import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

import cafeLogo from "../images/coffe.jpg";

function Login() {
  const navigate = useNavigate();

  // REMEMBER ME: save email only, never save password
  const [rememberMe, setRememberMe] = useState(
    localStorage.getItem("brewhub_remember_me") === "true",
  );

  const [email, setEmail] = useState(
    () => localStorage.getItem("brewhub_saved_email") || "",
  );

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // REMEMBER ME
        if (rememberMe) {
          localStorage.setItem("brewhub_saved_email", email.trim());
          localStorage.setItem("brewhub_remember_me", "true");
        } else {
          localStorage.removeItem("brewhub_saved_email");
          localStorage.removeItem("brewhub_remember_me");
        }

        // UPDATE NAVBAR
        window.dispatchEvent(new Event("authUpdated"));

        // SUCCESS POPUP
        setSuccessMessage("Login Successful! 🎉");

        // REDIRECT
        setTimeout(() => {
          if (data.user?.role === "admin") {
            window.location.href = "http://localhost:3001/admin/dashboard";
          } else {
            navigate("/");
          }
        }, 1500);
      } else {
        setErrorMessage(
          data.message || "Invalid email or password. Please try again.",
        );
      }
    } catch (error) {
      console.error("Login Error:", error);
      setErrorMessage("Server connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* SUCCESS POPUP */}
      {successMessage && (
        <div className="login-success-popup">
          <div className="login-success-icon">✓</div>

          <div className="login-success-content">
            <h3>Success!</h3>
            <p>{successMessage}</p>
          </div>
        </div>
      )}

      {/* ERROR POPUP */}
      {errorMessage && (
        <div className="login-error-popup" role="alert">
          <button
            type="button"
            className="login-error-close"
            onClick={() => setErrorMessage("")}
            aria-label="Close error message"
          >
            ×
          </button>

          <div className="login-error-icon">✕</div>

          <div className="login-error-content">
            <h3>Login Failed!</h3>
            <p>{errorMessage}</p>
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

          {/* LOGIN FORM */}
          <form onSubmit={handleLogin}>
            {/* EMAIL */}
            <div className="input-group">
              <label>Email ID</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
              />
            </div>

            {/* PASSWORD WITH SHOW/HIDE */}
            <div className="input-group">
              <label>Password</label>

              <div className="login-password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M3 3L21 21" />
                      <path d="M10.6 10.6a2 2 0 002.8 2.8" />
                      <path d="M9.9 5.2A11 11 0 0121 12a12 12 0 01-3.1 4.2" />
                      <path d="M6.2 6.2A12 12 0 003 12a11 11 0 006.4 6.5 10 10 0 005.2.3" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* REMEMBER ME + FORGOT PASSWORD */}
            <div className="login-options">
              <label className="remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />

                <span>Remember me</span>
              </label>

              <Link to="/forgot-password">Forgot Password?</Link>
            </div>

            {/* LOGIN BUTTON */}
            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
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
