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

  // View Details Modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(0);

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

      if (!response.ok || !data.loggedIn) {
        setMessage("Please login first to add products to cart.");

        setTimeout(() => {
          setMessage("");
          navigate("/login");
        }, 1500);

        return;
      }

      const userId = data.user.id;
      const cartKey = `cart_${userId}`;

      const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

      const existingProduct = cart.find((item) => item._id === product._id);

      let updatedCart;

      if (existingProduct) {
        updatedCart = cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item,
        );
      } else {
        updatedCart = [...cart, { ...product, quantity: 1 }];
      }

      localStorage.setItem(cartKey, JSON.stringify(updatedCart));

      window.dispatchEvent(new Event("cartUpdated"));

      setMessage(`${product.pname} added to cart`);

      setTimeout(() => setMessage(""), 2000);

      setSelectedProduct(null);
    } catch (error) {
      console.log("Add Cart Error:", error);
      setMessage("Unable to add product to cart.");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  // Open product details
  const openDetails = (product) => {
    setSelectedProduct(product);
    setRating(0);
  };

  // Close modal with Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setSelectedProduct(null);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

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

      {message && (
        <div className="cart-toast">
          <span>✓</span> {message}
        </div>
      )}

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
                <div className="product-image">
                  <img
                    src={`http://localhost:5000/uploads/${product.photo}`}
                    alt={product.pname}
                  />
                </div>

                <div className="product-info">
                  <small>{categoryName}</small>
                  <h3>{product.pname}</h3>
                  <p>{product.description}</p>

                  <button
                    type="button"
                    className="view-details-btn"
                    onClick={() => openDetails(product)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-products">No products found in this category.</p>
          )}
        </div>
      </section>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div
          className="product-modal-overlay"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="product-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Product details"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setSelectedProduct(null)}
              aria-label="Close details"
            >
              ×
            </button>

            <div className="modal-product-image">
              <img
                src={`http://localhost:5000/uploads/${selectedProduct.photo}`}
                alt={selectedProduct.pname}
              />
            </div>

            <div className="modal-product-info">
              <span className="modal-category">{categoryName}</span>

              <h2>{selectedProduct.pname}</h2>

              <h3 className="modal-product-price">₹{selectedProduct.rate}</h3>

              <p className="modal-product-description">
                {selectedProduct.description || "No description available."}
              </p>

              <p className="modal-product-quantity">
                <strong>Available Quantity:</strong>{" "}
                {selectedProduct.quantity ?? "Not specified"}
              </p>

              {/* Star Rating */}
              <div className="product-rating">
                <h4>Rate This Product</h4>

                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      className="rating-star"
                      onClick={() => setRating(star)}
                      aria-label={`Rate ${star} out of 5`}
                      style={{
                        color: star <= rating ? "#F5A623" : "#D8C9DF",
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>

                <p>
                  {rating === 0
                    ? "Select your rating"
                    : `You rated ${rating} out of 5 stars`}
                </p>
              </div>

              <button
                type="button"
                className="modal-add-cart-btn"
                onClick={() => addToCart(selectedProduct)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Productbycategory;
