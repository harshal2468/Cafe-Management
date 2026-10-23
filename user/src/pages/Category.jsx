import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import coffeeImg from "../images/coffe.jpg";
import coldDrinkImg from "../images/cold-drink.jpg";
import burgerImg from "../images/burger.jpg";
import dessertImg from "../images/dessert.webp";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

function Category() {
  const [categories, setCategories] = useState([]);

  // ===============================
  // FETCH ALL CATEGORIES
  // ===============================

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/category");

      const data = await response.json();

      if (response.ok) {
        console.log("All Categories:", data);
        setCategories(data);
      } else {
        alert("Unable to fetch categories");
      }
    } catch (error) {
      console.log("Error:", error);
      alert("Server error");
    }
  };

  // ===============================
  // USE EFFECT
  // ===============================

  useEffect(() => {
    fetchCategories();
  }, []);

  // ===============================
  // CATEGORY IMAGES
  // ===============================

  const categoryImages = [coffeeImg, coldDrinkImg, burgerImg, dessertImg];

  return (
    <>
      <section className="categories-section">
        {/* ===============================
            CATEGORY HEADING
        =============================== */}

        <div className="section-heading">
          <span>EXPLORE OUR MENU</span>

          <h2>What Would You Like?</h2>

          <p>
            Discover our delicious selection prepared specially for coffee and
            food lovers.
          </p>
        </div>

        {/* ===============================
            CATEGORY GRID
        =============================== */}

        <div className="category-grid">
          {categories.map((category, index) => (
            <Link
              to={`/productbycategory/${category.categoryid}`}
              className={`category-card ${
                index % 2 === 0 ? "category-card-left" : "category-card-right"
              }`}
              key={category._id}
            >
              {/* CATEGORY IMAGE */}

              <img
                className="category-photo"
                src={`http://localhost:5000/uploads/${category.photo}`}
                alt={category.cname}
              />

              {/* CATEGORY OVERLAY */}

              <div className="category-overlay">
                <h3>{category.cname}</h3>

                <p>Fresh and delicious</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

export default Category;
