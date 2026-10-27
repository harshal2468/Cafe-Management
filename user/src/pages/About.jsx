import React from "react";
import { Link } from "react-router-dom";

import "./About.css";

import aboutHero from "../images/cafe-hero.png";
import cafeImage from "../images/cafe-interior.png";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
function About() {
  return (
    <>
      <div className="about-page">
        <Navbar />
        {/* =========================================
          HERO SECTION
      ========================================= */}

        <section className="about-hero">
          {/* RIGHT SIDE IMAGE */}

          <div
            className="hero-image"
            style={{
              backgroundImage: `url(${aboutHero})`,
            }}
          ></div>

          {/* LEFT SIDE LIGHT OVERLAY */}

          <div className="hero-overlay"></div>

          {/* HERO TEXT */}

          <div className="hero-content">
            <span className="small-title">ABOUT BREWHUB</span>

            <h1>
              More Than Just
              <br />
              <span>A Cup Of Coffee.</span>
            </h1>

            <p>
              At BrewHub, we believe in creating experiences through great
              coffee, delicious food and warm hospitality.
            </p>

            <Link to="/product" className="explore-btn">
              Explore Our Menu
              <span>→</span>
            </Link>
          </div>
        </section>

        {/* =========================================
          OUR STORY
      ========================================= */}

        <section className="our-story">
          {/* IMAGE */}

          <div className="story-image">
            <img src={cafeImage} alt="BrewHub Cafe Interior" />
          </div>

          {/* CONTENT */}

          <div className="story-content">
            <span className="section-label">OUR STORY</span>

            <h2>
              Welcome to <span>BrewHub</span>
            </h2>

            <p>
              BrewHub started with a simple idea – to bring people together over
              exceptional coffee and good food. Every cup we serve is crafted
              with care, quality ingredients and passion.
            </p>

            <p>
              Whether you are here to relax, work, study or just enjoy your
              favorite beverage, we want BrewHub to feel like your second home.
            </p>

            {/* STORY FEATURES */}

            <div className="story-features">
              {/* QUALITY */}

              <div className="story-feature">
                <div className="feature-icon">☕</div>

                <div>
                  <h4>Quality Ingredients</h4>

                  <p>Only the best for you</p>
                </div>
              </div>

              {/* LOVE */}

              <div className="story-feature">
                <div className="feature-icon">♥</div>

                <div>
                  <h4>Made With Love</h4>

                  <p>Prepared with care</p>
                </div>
              </div>

              {/* CUSTOMERS */}

              <div className="story-feature">
                <div className="feature-icon">★</div>

                <div>
                  <h4>Happy Customers</h4>

                  <p>Your satisfaction matters</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
          WHY CHOOSE US
      ========================================= */}

        <section className="why-section">
          {/* HEADING */}

          <div className="section-heading">
            <span></span>

            <h3>WHY CHOOSE US?</h3>

            <span></span>
          </div>

          {/* CARDS */}

          <div className="why-cards">
            {/* PREMIUM COFFEE */}

            <div className="why-card">
              <div className="why-icon">☕</div>

              <div>
                <h3>Premium Coffee</h3>

                <p>
                  Carefully selected beans
                  <br />
                  for perfect taste
                </p>
              </div>
            </div>

            {/* FOOD */}

            <div className="why-card">
              <div className="why-icon">🍴</div>

              <div>
                <h3>Delicious Food</h3>

                <p>
                  Wide variety of tasty
                  <br />
                  food and snacks
                </p>
              </div>
            </div>

            {/* AMBIENCE */}

            <div className="why-card">
              <div className="why-icon">🛋</div>

              <div>
                <h3>Cozy Ambience</h3>

                <p>
                  Comfortable place to
                  <br />
                  relax and unwind
                </p>
              </div>
            </div>

            {/* SERVICE */}

            <div className="why-card">
              <div className="why-icon">🛵</div>

              <div>
                <h3>Quick Service</h3>

                <p>
                  Fast, friendly and
                  <br />
                  reliable service
                </p>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
}

export default About;
