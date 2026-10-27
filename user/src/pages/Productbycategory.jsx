import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Productbycategory.css";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Productbycategory() {
  const { categoryid } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [message, setMessage] = useState("");

  // Fetch products by category
  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/product/${categoryid}`,
      );

      const data = await response.json();

      if (response.ok) {
        setProducts(data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.log("Product Fetch Error:", error);
      setProducts([]);
    }
  };

  // Fetch category name
  const fetchCategoryName = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/category");

      const data = await response.json();

      if (response.ok) {
        const category = data.find(
          (item) => Number(item.categoryid) === Number(categoryid),
        );

        setCategoryName(category ? category.cname : "");
      }
    } catch (error) {
      console.log("Category Fetch Error:", error);
    }
  };

  // Add to Cart
  const addToCart = async (product) => {
    try {
      const response = await fetch("http://localhost:5000/api/session", {
        credentials: "include",
      });

      const data = await response.json();

      // Check login
      if (!response.ok || !data.loggedIn) {
        setMessage("Please login first to add products to cart.");

        setTimeout(() => {
          setMessage("");
          navigate("/login");
        }, 1500);

        return;
      }

      // Separate cart for each user
      const userId = data.user.id;
      const cartKey = `cart_${userId}`;

      const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

      const existingProduct = cart.find((item) => item._id === product._id);

      let updatedCart;

      if (existingProduct) {
        updatedCart = cart.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity: (item.quantity || 1) + 1,
              }
            : item,
        );
      } else {
        updatedCart = [
          ...cart,
          {
            ...product,
            quantity: 1,
          },
        ];
      }

      localStorage.setItem(cartKey, JSON.stringify(updatedCart));

      // Update navbar cart count
      window.dispatchEvent(new Event("cartUpdated"));

      setMessage(`${product.pname} added to cart`);

      setTimeout(() => {
        setMessage("");
      }, 2000);
    } catch (error) {
      console.log("Add Cart Error:", error);

      setMessage("Unable to add product to cart.");

      setTimeout(() => {
        setMessage("");
      }, 2000);
    }
  };

  // Load category products
  useEffect(() => {
    if (categoryid) {
      fetchProducts();
      fetchCategoryName();
    }
  }, [categoryid]);

  return (
    <>
      <Navbar />

      {/* Cart Message */}
      {message && (
        <div className="cart-toast">
          <span>✓</span> {message}
        </div>
      )}

      {/* Products Section */}
      <section className="products-section">
        <div className="section-heading">
          <span>OUR MENU</span>

          <h2>{categoryName || "Menu"}</h2>

          <p>Delicious items from this category.</p>
        </div>

        <div className="product-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <div className="product-card" key={product._id}>
                {/* Product Image */}
                <div className="product-image">
                  <img
                    src={`http://localhost:5000/uploads/${product.photo}`}
                    alt={product.pname}
                  />
                </div>

                {/* Product Information */}
                <div className="product-info">
                  <small>{categoryName}</small>

                  <h3>{product.pname}</h3>

                  <p>{product.description}</p>

                  {/* Price and Add to Cart */}
                  <div className="product-bottom">
                    <strong>₹{product.rate}</strong>

                    <button
                      type="button"
                      className="add-cart-btn"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-products">No products found in this category.</p>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Productbycategory;
