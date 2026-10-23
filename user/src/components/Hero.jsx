import React from "react";
import { Link } from "react-router-dom";
import "./Hero.css";

import heroImage from "../images/cafee.png";

function Hero() {
  return (
    <section className="cafe-hero">
      {/* Decorative Background */}
      <div className="hero-decor hero-decor-one"></div>
      <div className="hero-decor hero-decor-two"></div>

      {/* LEFT CONTENT */}
      <div className="cafe-hero-content">
        <span className="cafe-hero-tag">☕ WELCOME TO OUR CAFE</span>

        <h1>
          Fresh Coffee,
          <br />
          <span>Fresh Moments.</span>
        </h1>

        <p>
          Discover delicious coffee, tasty meals and
          <br />
          everything you love under one roof.
        </p>

        <div className="cafe-hero-buttons">
          <Link to="/product" className="cafe-shop-btn">
            Explore Menu
            <span>→</span>
          </Link>

          <Link to="/about" className="cafe-about-btn">
            Discover More
          </Link>
        </div>

        {/* FEATURES */}
        <div className="cafe-hero-features">
          <div className="cafe-feature">
            <div className="cafe-feature-icon">☕</div>

            <div>
              <strong>Fresh Coffee</strong>
              <small>Every Morning</small>
            </div>
          </div>

          <div className="cafe-feature">
            <div className="cafe-feature-icon">🍰</div>

            <div>
              <strong>Fresh Food</strong>
              <small>Made With Love</small>
            </div>
          </div>

          <div className="cafe-feature">
            <div className="cafe-feature-icon">★</div>

            <div>
              <strong>Best Quality</strong>
              <small>Always Fresh</small>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT IMAGE */}
      <div className="cafe-hero-image">
        <div className="hero-image-bg"></div>

        <img src={heroImage} alt="Fresh Coffee" />
      </div>
    </section>
  );
}

export default Hero;
