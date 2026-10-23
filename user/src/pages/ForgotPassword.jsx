import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!email || !newPassword || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/forgot-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email,
            newPassword,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Password reset successfully!");

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        alert(data.message || "Unable to reset password");
      }
    } catch (error) {
      console.log("Forgot Password Error:", error);
      alert("Server connection error");
    }
  };

  return (
    <div className="forgot-page">
      {successMessage && (
        <div className="forgot-success-popup">
          <div className="forgot-success-icon">✓</div>

          <div>
            <h3>Success!</h3>
            <p>{successMessage}</p>
          </div>
        </div>
      )}

      <div className="forgot-card">
        <div className="forgot-logo">BREWHUB</div>

        <div className="forgot-heading">
          <span>CAFE MANAGEMENT</span>

          <h2>Forgot Password?</h2>

          <p>Reset your password and get back to your account</p>
        </div>

        <form onSubmit={handleResetPassword}>
          <div className="forgot-input-group">
            <label>Email ID</label>

            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="forgot-input-group">
            <label>New Password</label>

            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="forgot-input-group">
            <label>Confirm Password</label>

            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="forgot-submit">
            Reset Password
          </button>
        </form>

        <div className="forgot-login">
          Remember your password?
          <Link to="/login"> Login</Link>
        </div>

        <Link to="/" className="forgot-home">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

export default ForgotPassword;
