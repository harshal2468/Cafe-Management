import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Product.css";

function Product() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [productsLoading, setProductsLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [rating, setRating] = useState(0);

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      setProductsError("");

      const response = await fetch("http://localhost:5000/api/products");

      const data = await response.json();

      if (response.ok) {
        setProducts(data);
      } else {
        setProductsError(data.message || "Unable to fetch products");
      }
    } catch (error) {
      console.log("Product Fetch Error:", error);
      setProductsError("Unable to load products. Please try again.");
    } finally {
      setProductsLoading(false);
    }
  };

  // FETCH CATEGORIES
  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);

      const response = await fetch("http://localhost:5000/api/category");

      const data = await response.json();

      if (response.ok) {
        setCategories(data);
      }
    } catch (error) {
      console.log("Category Fetch Error:", error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // GET CATEGORY NAME
  const getCategoryName = (categoryid) => {
    const category = categories.find(
      (item) => Number(item.categoryid) === Number(categoryid),
    );

    return category ? category.cname : "Unknown";
  };

  // CHECK LOGIN
  const checkLogin = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/session", {
        credentials: "include",
      });

      if (!response.ok) return null;

      const data = await response.json();

      if (data.loggedIn && data.user) {
        return data.user;
      }

      return null;
    } catch (error) {
      console.log("Session Check Error:", error);
      return null;
    }
  };

  // FLYING CART ANIMATION
  const startCartAnimation = (product, button) => {
    const cartButton = document.querySelector(".nav-cart");

    if (!cartButton || !button) return;

    const start = button.getBoundingClientRect();
    const end = cartButton.getBoundingClientRect();

    const flyingItem = document.createElement("div");
    flyingItem.className = "flying-cart-item";

    const image = document.createElement("img");
    image.src = `http://localhost:5000/uploads/${product.photo}`;
    image.alt = product.pname;

    flyingItem.appendChild(image);

    const startX = start.left + start.width / 2;
    const startY = start.top + start.height / 2;
    const endX = end.left + end.width / 2;
    const endY = end.top + end.height / 2;

    flyingItem.style.left = `${startX - 27}px`;
    flyingItem.style.top = `${startY - 27}px`;

    flyingItem.style.setProperty("--end-x", `${endX - startX}px`);

    flyingItem.style.setProperty("--end-y", `${endY - startY}px`);

    document.body.appendChild(flyingItem);

    setTimeout(() => flyingItem.remove(), 750);
  };

  // ADD TO CART
  const addToCart = async (product, event) => {
    const clickedButton = event?.currentTarget;

    try {
      const user = await checkLogin();

      if (!user) {
        setSelectedProduct(null);
        navigate("/login");
        return;
      }

      const cartKey = `cart_${user.id}`;

      const oldCart = JSON.parse(localStorage.getItem(cartKey)) || [];

      const existingProduct = oldCart.find((item) => item._id === product._id);

      let updatedCart;

      if (existingProduct) {
        updatedCart = oldCart.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity: Number(item.quantity || 1) + 1,
                rate: Number(item.rate || product.rate || 0),
              }
            : item,
        );
      } else {
        updatedCart = [
          ...oldCart,
          {
            _id: product._id,
            productid: product.productid,
            categoryid: product.categoryid,
            pname: product.pname,
            description: product.description,
            rate: Number(product.rate || 0),
            photo: product.photo,
            quantity: 1,
          },
        ];
      }

      localStorage.setItem(cartKey, JSON.stringify(updatedCart));

      startCartAnimation(product, clickedButton);

      window.dispatchEvent(new Event("cartUpdated"));

      showCartMessage(`${product.pname} added to cart`);

      // Close modal after successful add
      setSelectedProduct(null);
    } catch (error) {
      console.log("Add To Cart Error:", error);
    }
  };

  // CART SUCCESS MESSAGE
  const showCartMessage = (message) => {
    const oldMessage = document.querySelector(".cart-success-message");

    if (oldMessage) oldMessage.remove();

    const messageBox = document.createElement("div");
    messageBox.className = "cart-success-message";
    messageBox.innerText = message;

    document.body.appendChild(messageBox);

    setTimeout(() => {
      messageBox.classList.add("show");
    }, 10);

    setTimeout(() => {
      messageBox.classList.remove("show");

      setTimeout(() => {
        messageBox.remove();
      }, 300);
    }, 1800);
  };

  // CLOSE MODAL WITH ESCAPE KEY
  useEffect(() => {
    if (!selectedProduct) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setSelectedProduct(null);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [selectedProduct]);

  // INITIAL DATA
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  return (
    <>
      <Navbar />

      <section className="products-section">
        <div className="section-heading">
          <span>OUR SPECIALS</span>
          <h2>Popular Products</h2>
          <p>Taste the most loved items from our cafe.</p>
        </div>

        {productsLoading ? (
          <div className="products-loading">
            <div className="loading-spinner"></div>
            <h3>Loading Products...</h3>
            <p>Please wait while we fetch our delicious products.</p>
          </div>
        ) : productsError ? (
          <div className="products-empty">
            <h3>Something went wrong</h3>
            <p>{productsError}</p>
            <button className="retry-btn" onClick={fetchProducts}>
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="products-empty">
            <h3>No Products Available</h3>
            <p>
              We don't have any products available right now. Please check again
              later.
            </p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <div className="product-card" key={product._id}>
                <div className="product-image">
                  <img
                    src={`http://localhost:5000/uploads/${product.photo}`}
                    alt={product.pname}
                  />
                </div>

                <div className="product-info">
                  <small>
                    {categoriesLoading
                      ? "Loading category..."
                      : getCategoryName(product.categoryid)}
                  </small>

                  <h3>{product.pname}</h3>
                  <p>{product.description}</p>

                  <div className="product-bottom">
                    <strong>₹{Number(product.rate) || 0}</strong>
                  </div>

                  <button
                    type="button"
                    className="view-details-btn"
                    onClick={() => setSelectedProduct(product)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />

      {/* VIEW DETAILS MODAL */}
      {selectedProduct && (
        <div
          className="product-modal-overlay"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="product-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setSelectedProduct(null)}
              aria-label="Close product details"
            >
              &times;
            </button>

            <div className="modal-product-image-wrap">
              <img
                src={`http://localhost:5000/uploads/${selectedProduct.photo}`}
                alt={selectedProduct.pname}
                className="modal-product-image"
              />
            </div>

            <div className="modal-product-info">
              <span className="modal-product-category">
                {getCategoryName(selectedProduct.categoryid)}
              </span>

              <h2 id="product-modal-title">{selectedProduct.pname}</h2>

              <p className="modal-product-price">
                ₹{Number(selectedProduct.rate) || 0}
              </p>

              <p className="modal-product-description">
                {selectedProduct.description || "No description available."}
              </p>

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
                onClick={(e) => addToCart(selectedProduct, e)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Product;
