import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Thank you! Your message has been sent.");

    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    });
  };

  return (
    <div className="contact-page">
      <Navbar />

      {/* =================================================
          CONTACT HERO
      ================================================= */}

      <section className="contact-hero">
        <div className="contact-hero-image"></div>

        <div className="contact-hero-overlay"></div>

        <div className="contact-hero-content">
          <span className="contact-small-title">CONTACT BREWHUB</span>

          <h1>
            Let's Connect Over
            <br />
            <span>A Cup Of Coffee.</span>
          </h1>

          <p>
            Have a question, suggestion or simply want to say hello? We would
            love to hear from you.
          </p>

          <a href="#contact-form" className="contact-hero-btn">
            Get In Touch
            <span>→</span>
          </a>
        </div>
      </section>

      {/* =================================================
          CONTACT MAIN SECTION
      ================================================= */}

      <section className="contact-main">
        <div className="contact-wrapper">
          {/* ================= LEFT INFO ================= */}

          <div className="contact-info">
            <span className="section-label">GET IN TOUCH</span>

            <h2>
              We'd Love To
              <br />
              <span>Hear From You</span>
            </h2>

            <p className="contact-description">
              Whether you have a question about our menu, want to share your
              feedback, or just want to visit us, feel free to contact BrewHub.
            </p>

            {/* LOCATION */}

            <div className="contact-info-card">
              <div className="contact-icon">📍</div>

              <div>
                <h3>Visit Us</h3>

                <p>
                  BrewHub Cafe
                  <br />
                  Surat, Gujarat, India
                </p>
              </div>
            </div>

            {/* PHONE */}

            <div className="contact-info-card">
              <div className="contact-icon">☎</div>

              <div>
                <h3>Call Us</h3>

                <p>+91 98765 43210</p>
              </div>
            </div>

            {/* EMAIL */}

            <div className="contact-info-card">
              <div className="contact-icon">✉</div>

              <div>
                <h3>Email Us</h3>

                <p>info@brewhub.com</p>
              </div>
            </div>

            {/* HOURS */}

            <div className="contact-info-card">
              <div className="contact-icon">◷</div>

              <div>
                <h3>Opening Hours</h3>

                <p>
                  Monday - Sunday
                  <br />
                  9:00 AM - 10:00 PM
                </p>
              </div>
            </div>
          </div>

          {/* ================= FORM ================= */}

          <div className="contact-form-card" id="contact-form">
            <span className="form-label">SEND A MESSAGE</span>

            <h2>Get In Touch</h2>

            <p>Fill out the form and our team will get back to you.</p>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Your Name</label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
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
              </div>

              <div className="form-group">
                <label>Phone Number</label>

                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Your Message</label>

                <textarea
                  name="message"
                  rows="5"
                  placeholder="Write your message..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button type="submit" className="send-message-btn">
                Send Message
                <span>→</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* =================================================
          VISIT US
      ================================================= */}

      <section className="visit-section">
        <div className="visit-title">
          <span></span>

          <h3>FIND US HERE</h3>

          <span></span>
        </div>

        <div className="visit-box">
          <div className="visit-content">
            <span>BREWHUB CAFE</span>

            <h2>
              Your Favorite Coffee
              <br />
              <strong>Is Waiting For You.</strong>
            </h2>

            <p>
              Come visit us and enjoy freshly brewed coffee, delicious food and
              beautiful moments.
            </p>

            <button className="direction-btn">Get Directions →</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Contact;
