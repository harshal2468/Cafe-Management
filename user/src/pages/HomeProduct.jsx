import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function HomeProduct() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // =========================
  // FETCH ONLY 3 PRODUCTS
  // =========================

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/product/home");

      const data = await response.json();

      if (response.ok) {
        setProducts(data);
      } else {
        alert(data.message || "Unable to fetch products");
      }
    } catch (error) {
      console.log("Home Product Fetch Error:", error);
    }
  };

  // =========================
  // FETCH CATEGORIES
  // =========================

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/category");

      const data = await response.json();

      if (response.ok) {
        setCategories(data);
      }
    } catch (error) {
      console.log("Category Fetch Error:", error);
    }
  };

  // =========================
  // CATEGORY NAME
  // =========================

  const getCategoryName = (categoryid) => {
    const category = categories.find(
      (item) => Number(item.categoryid) === Number(categoryid),
    );

    return category ? category.cname : "Unknown";
  };

  // =========================
  // FLYING CART ANIMATION
  // =========================

  const cartAnimation = (product) => {
    const cartButton = document.querySelector(".cart-side-button");

    if (!cartButton) {
      console.log("Cart button not found");
      return;
    }

    const productImages = document.querySelectorAll(".product-image img");

    let clickedImage = null;

    productImages.forEach((img) => {
      if (img.alt === product.pname && !clickedImage) {
        clickedImage = img;
      }
    });

    if (!clickedImage) {
      console.log("Product image not found");
      return;
    }

    const start = clickedImage.getBoundingClientRect();

    const end = cartButton.getBoundingClientRect();

    const flyingItem = document.createElement("div");

    flyingItem.className = "flying-cart-item";

    flyingItem.innerHTML = `
      <img
        src="http://localhost:5000/uploads/${product.photo}"
        alt="${product.pname}"
      />
    `;

    const startX = start.left + start.width / 2;

    const startY = start.top + start.height / 2;

    const endX = end.left + end.width / 2;

    const endY = end.top + end.height / 2;

    flyingItem.style.left = `${startX - 27.5}px`;
    flyingItem.style.top = `${startY - 27.5}px`;

    flyingItem.style.setProperty("--end-x", `${endX - startX}px`);

    flyingItem.style.setProperty("--end-y", `${endY - startY}px`);

    document.body.appendChild(flyingItem);

    setTimeout(() => {
      flyingItem.remove();
    }, 750);
  };

  // =========================
  // CHECK SESSION + ADD CART
  // =========================

  const handleAddToCart = async (product) => {
    try {
      // =========================
      // CHECK LOGIN SESSION
      // =========================

      const sessionResponse = await fetch("http://localhost:5000/api/session", {
        method: "GET",
        credentials: "include",
      });

      const sessionData = await sessionResponse.json();

      // =========================
      // NOT LOGGED IN
      // =========================

      if (!sessionResponse.ok || !sessionData.loggedIn || !sessionData.user) {
        setMessage("Please login first");

        setTimeout(() => {
          setMessage("");
          navigate("/login");
        }, 1500);

        return;
      }

      // =========================
      // GET LOGGED-IN USER
      // =========================

      const user = sessionData.user;

      // =========================
      // USER-SPECIFIC CART KEY
      // =========================

      const cartKey = `cart_${user.id}`;

      console.log("Logged in user:", user);
      console.log("Cart Key:", cartKey);

      // =========================
      // GET OLD CART
      // =========================

      const oldCart = JSON.parse(localStorage.getItem(cartKey)) || [];

      // =========================
      // CHECK EXISTING PRODUCT
      // =========================

      const existingProduct = oldCart.find((item) => item._id === product._id);

      let updatedCart;

      // =========================
      // INCREASE QUANTITY
      // =========================

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
      }

      // =========================
      // ADD NEW PRODUCT
      // =========================
      else {
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

      // =========================
      // SAVE CART
      // =========================

      localStorage.setItem(cartKey, JSON.stringify(updatedCart));

      console.log("Cart Saved:", updatedCart);

      // =========================
      // UPDATE NAVBAR CART COUNT
      // =========================

      window.dispatchEvent(new Event("cartUpdated"));

      // =========================
      // FLYING CART
      // =========================

      cartAnimation(product);

      // =========================
      // SUCCESS MESSAGE
      // =========================
      setMessage(`${product.pname} added to cart`);

      setTimeout(() => {
        setMessage("");
      }, 2000);
    } catch (error) {
      console.log("Add To Cart Error:", error);

      setMessage("Unable to add product to cart");

      setTimeout(() => {
        setMessage("");
      }, 2000);
    }
  };

  // =========================
  // USE EFFECT
  // =========================

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // =========================
  // UI
  // =========================

  return (
    <>
      {message && (
        <div className="cart-toast">
          <span>✓</span>
          {message}
        </div>
      )}
      <section className="products-section">
        {/* =========================
          HEADING
      ========================= */}

        <div className="section-heading">
          <span>OUR SPECIALS</span>

          <h2>Popular Products</h2>

          <p>Taste the most loved items from our cafe.</p>
        </div>

        {/* =========================
          PRODUCT GRID
      ========================= */}

        <div className="product-grid">
          {products.map((product) => (
            <div className="product-card" key={product._id}>
              {/* =========================
                PRODUCT IMAGE
            ========================= */}

              <div className="product-image">
                <img
                  src={`http://localhost:5000/uploads/${product.photo}`}
                  alt={product.pname}
                />
              </div>

              {/* =========================
                PRODUCT INFO
            ========================= */}

              <div className="product-info">
                <small>{getCategoryName(product.categoryid)}</small>

                <h3>{product.pname}</h3>

                <p>{product.description}</p>

                {/* =========================
                  PRODUCT BOTTOM
              ========================= */}

                <div className="product-bottom">
                  <strong>₹{Number(product.rate) || 0}</strong>

                  {/* =========================
                    ADD TO CART
                ========================= */}

                  <button
                    type="button"
                    className="add-cart-btn"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default HomeProduct;
