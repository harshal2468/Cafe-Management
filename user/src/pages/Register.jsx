import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  // ==============================
  // HANDLE INPUT CHANGE
  // ==============================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==============================
  // REGISTER USER
  // ==============================
  const handleRegister = async (e) => {
    e.preventDefault();

    // Password check
    if (formData.password !== formData.confirmPassword) {
      alert("Password and Confirm Password do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Registration Successful! 🎉");

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
        setSuccessMessage(data.message || "Registration failed");
      }
    } catch (error) {
      console.log("Registration Error:", error);

      alert("Server connection error");
    }
  };

  return (
    <div className="register-page">
      {successMessage && (
        <div className="register-success-popup">
          <div className="success-icon">✓</div>

          <div className="success-content">
            <h3>Success!</h3>
            <p>{successMessage}</p>
          </div>
        </div>
      )}
      {/* ================= LEFT SIDE ================= */}

      <div className="register-left">
        <div className="register-overlay"></div>

        <div className="register-brand">
          <h1>Cafe Management</h1>

          <p>Manage your cafe smarter, faster and easier.</p>
        </div>
      </div>

      {/* ================= RIGHT SIDE ================= */}

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
            {/* FULL NAME */}

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

            {/* EMAIL */}

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

            {/* MOBILE */}

            <div className="input-group">
              <label>Mobile Number</label>

              <input
                type="tel"
                name="mobile"
                placeholder="Enter mobile number"
                value={formData.mobile}
                onChange={handleChange}
                required
              />
            </div>

            {/* PASSWORD ROW */}

            <div className="password-row">
              {/* PASSWORD */}

              <div className="input-group">
                <label>Password</label>

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* CONFIRM PASSWORD */}

              <div className="input-group">
                <label>Confirm Password</label>

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* REGISTER BUTTON */}

            <button type="submit" className="register-btn">
              Create Account
            </button>
          </form>

          {/* LOGIN */}

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
