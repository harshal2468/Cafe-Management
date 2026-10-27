import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand Section */}
        <div className="footer-section footer-brand">
          <Link to="/" className="footer-logo">
            <div className="footer-cup">
              <svg
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 17H28V24C28 29 24 32 19 32H17C12 32 8 29 8 24V17Z"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M28 19H31C35 19 35 26 29 27"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M13 12C10 9 15 8 13 5M20 12C17 9 22 8 20 5"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="footer-logo-text">
              <h2>BREWHUB</h2>
              <small>CAFE MANAGEMENT</small>
            </div>
          </Link>

          <p>
            Fresh coffee, delicious food and beautiful moments — all under one
            roof.
          </p>

          <div className="social-links">
            <a href="#instagram">Instagram</a>
            <a href="#facebook">Facebook</a>
            <a href="#twitter">Twitter</a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>

          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/product">Product</Link>
            <Link to="/category">Categories</Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>

        {/* Services */}
        <div className="footer-section">
          <h3>Our Services</h3>

          <div className="footer-links">
            <Link to="/products">Fresh Coffee</Link>
            <Link to="/products">Food & Snacks</Link>
            <Link to="/products">Desserts</Link>
            <Link to="/products">Special Offers</Link>
            <Link to="/products">Online Orders</Link>
          </div>
        </div>

        {/* Contact */}
        <div className="footer-section contact-section">
          <h3>Get In Touch</h3>

          <div className="contact-item">
            <span>✉</span>
            <div>
              <small>Email</small>
              <p>info@brewhub.com</p>
            </div>
          </div>

          <div className="contact-item">
            <span>☎</span>
            <div>
              <small>Phone</small>
              <p>+91 98765 43210</p>
            </div>
          </div>

          <div className="contact-item">
            <span>⌖</span>
            <div>
              <small>Location</small>
              <p>Surat, Gujarat</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="footer-bottom">
        <p>
          © 2026 <strong>BrewHub</strong>. All Rights Reserved.
        </p>

        <p>
          Made with <span className="heart">♥</span> for Coffee Lovers
        </p>
      </div>
    </footer>
  );
}

export default Footer;
