import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // REGISTER USER
  const handleRegister = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Password and Confirm Password do not match!");
      return;
    }

    if (
      formData.mobile.trim().length !== 10 ||
      !/^\d{10}$/.test(formData.mobile.trim())
    ) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          mobile: formData.mobile.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Registration Successful!");

        setFormData({
          name: "",
          email: "",
          mobile: "",
          password: "",
          confirmPassword: "",
        });

        setTimeout(() => {
          navigate("/login");
        }, 1800);
      } else {
        const message = data.message || "";

        if (
          response.status === 409 ||
          /already|exist|duplicate|registered/i.test(message)
        ) {
          setErrorMessage(
            message ||
              "This email or mobile number is already registered. Please login.",
          );
        } else {
          setErrorMessage(message || "Registration failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Registration Error:", error);
      setErrorMessage("Server connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      {/* SUCCESS POPUP */}
      {successMessage && (
        <div className="register-success-popup">
          <button
            type="button"
            className="popup-close-btn"
            onClick={() => setSuccessMessage("")}
            aria-label="Close"
          >
            ×
          </button>

          <div className="success-icon">✓</div>

          <div className="success-content">
            <h3>Success!</h3>
            <p>{successMessage}</p>
          </div>
        </div>
      )}

      {/* ERROR POPUP */}
      {errorMessage && (
        <div className="register-error-popup" role="alert">
          <button
            type="button"
            className="popup-close-btn"
            onClick={() => setErrorMessage("")}
            aria-label="Close"
          >
            ×
          </button>

          <div className="error-icon">✕</div>

          <div className="error-content">
            <h3>Registration Failed!</h3>
            <p>{errorMessage}</p>

            {/already|exist|duplicate|registered/i.test(errorMessage) && (
              <button
                type="button"
                className="error-login-btn"
                onClick={() => navigate("/login")}
              >
                Go to Login
              </button>
            )}
          </div>
        </div>
      )}

      {/* LEFT SIDE */}
      <div className="register-left">
        <div className="register-overlay"></div>

        <div className="register-brand">
          <h1>Cafe Management</h1>
          <p>Manage your cafe smarter, faster and easier.</p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="register-right">
        <div className="register-card">
          {/* HEADER */}
          <div className="register-header">
            <div className="small-title">WELCOME TO CAFE</div>
            <h2>Create Account</h2>
            <p>Register your account to continue</p>
          </div>

          {/* FORM */}
          <form onSubmit={handleRegister}>
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Mobile Number</label>
              <input
                type="tel"
                name="mobile"
                placeholder="Enter 10-digit mobile number"
                value={formData.mobile}
                onChange={handleChange}
                maxLength={10}
                required
              />
            </div>

            <div className="password-row">
              {/* PASSWORD */}
              <div className="input-group">
                <label>Password</label>

                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
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

              {/* CONFIRM PASSWORD */}
              <div className="input-group">
                <label>Confirm Password</label>

                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    title={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
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
            </div>

            <button type="submit" className="register-btn" disabled={loading}>
              {loading ? "Registering..." : "Create Account"}
            </button>
          </form>

          {/* LOGIN LINK */}
          <div className="login-link">
            Already have an account?
            <Link to="/login"> Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
