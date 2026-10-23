import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

import "./Home.css";

import coffeeImg from "../images/coffe.jpg";
import coldDrinkImg from "../images/cold-drink.jpg";
import burgerImg from "../images/burger.jpg";
import dessertImg from "../images/dessert.webp";
import aboutCafeImg from "../images/about-cafe.jpg";
import offerCoffeeImg from "../images/offer-coffe.jpg";
import Category from "./Category";

import HomeProduct from "./HomeProduct";

function Home() {
  useEffect(() => {
    const elements = document.querySelectorAll(".scroll-reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
      },
    );

    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, []);
  return (
    <div className="home-page">
      <Navbar />
      <Hero />
      {/* =========================
          POPULAR Category
      ========================= */}
      <div className="scroll-reveal category-section-reveal">
        <Category />
      </div>
      {/* =========================
          POPULAR PRODUCTS
      ========================= */}
      <div className="scroll-reveal products-section-reveal">
        <HomeProduct />
      </div>
      {/* =========================
          ABOUT
      ========================= */}
      <div className="scroll-reveal">
        <section className="about-section">
          <div className="about-image">
            <img src={aboutCafeImg} alt="Our Cafe" />
          </div>

          <div className="about-content">
            <span>OUR STORY</span>

            <h2>
              More Than Just
              <br />
              <strong>A Cup Of Coffee</strong>
            </h2>

            <p>
              At BrewHub, we believe that a cafe is more than just a place to
              drink coffee. It is a place where people meet, conversations
              happen and memories are created.
            </p>

            <p>
              We serve freshly prepared coffee, delicious food and refreshing
              beverages using quality ingredients.
            </p>

            <Link to="/about" className="about-btn-home">
              Discover Our Story →
            </Link>
          </div>
        </section>
      </div>
      {/* =========================
          SPECIAL OFFER
      ========================= */}
      <div className="scroll-reveal">
        <section className="offer-section">
          <div className="offer-content">
            <span>SPECIAL OFFER</span>

            <h2>
              Coffee + Dessert
              <br />
              <strong>Perfect Combination</strong>
            </h2>

            <p>
              Enjoy your favorite coffee with our delicious dessert at a special
              price.
            </p>

            <Link to="/products" className="offer-btn">
              Order Now →
            </Link>
          </div>

          <div className="offer-image">
            <img src={offerCoffeeImg} alt="Coffee Special Offer" />
          </div>
        </section>
      </div>
      {/* =========================
    WHY CHOOSE US
========================= */}
      <section className="why-section">
        <div className="section-heading">
          <span>WHY BREWHUB?</span>

          <h2>Why Choose Us</h2>

          <p>We care about every cup, every dish and every customer.</p>
        </div>

        <div className="why-grid">
          <div className="why-card">
            <div className="why-image">
              <img src={coffeeImg} alt="Fresh Coffee" />
            </div>

            <div className="why-content">
              <h3>Fresh Coffee</h3>
              <p>Freshly brewed coffee prepared with quality beans.</p>
            </div>
          </div>

          <div className="why-card">
            <div className="why-image">
              <img src={burgerImg} alt="Quality Food" />
            </div>

            <div className="why-content">
              <h3>Quality Food</h3>
              <p>Delicious food made with fresh ingredients.</p>
            </div>
          </div>

          <div className="why-card">
            <div className="why-image">
              <img src={coldDrinkImg} alt="Fast Service" />
            </div>

            <div className="why-content">
              <h3>Fast Service</h3>
              <p>Quick and friendly service for every customer.</p>
            </div>
          </div>

          <div className="why-card">
            <div className="why-image">
              <img src={dessertImg} alt="Made With Love" />
            </div>

            <div className="why-content">
              <h3>Made With Love</h3>
              <p>Every order is prepared with care and passion.</p>
            </div>
          </div>
        </div>
      </section>{" "}
      {/* CTA */}
      <section className="home-cta">
        <div>
          <span>READY TO TASTE?</span>

          <h2>
            Your Perfect Coffee
            <br />
            Is Waiting For You.
          </h2>
        </div>

        <Link to="/product" className="cta-btn">
          Explore Menu →
        </Link>
      </section>
      <Footer />
    </div>
  );
}

export default Home;
