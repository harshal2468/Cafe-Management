import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Product.css";

function Product() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [message, setMessage] = useState("");

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

  // CART SUCCESS MESSAGE
  const showCartMessage = (text) => {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 2000);
  };

  // ADD TO CART
  const addToCart = async (product, event) => {
    const clickedButton = event.currentTarget;

    try {
      const user = await checkLogin();

      if (!user) {
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
    } catch (error) {
      console.log("Add To Cart Error:", error);
      showCartMessage("Unable to add product to cart.");
    }
  };

  // INITIAL DATA
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  return (
    <>
      <Navbar />

      {/* CART SUCCESS MESSAGE */}
      {message && (
        <div className="cart-toast">
          <span>✓</span>
          {message}
        </div>
      )}

      {/* PRODUCTS SECTION */}
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

            <button type="button" className="retry-btn" onClick={fetchProducts}>
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
                {/* PRODUCT IMAGE */}
                <div className="product-image">
                  <img
                    src={`http://localhost:5000/uploads/${product.photo}`}
                    alt={product.pname}
                  />
                </div>

                {/* PRODUCT INFORMATION */}
                <div className="product-info">
                  <small>
                    {categoriesLoading
                      ? "Loading category..."
                      : getCategoryName(product.categoryid)}
                  </small>

                  <h3>{product.pname}</h3>

                  <p>{product.description}</p>

                  {/* PRICE AND ADD TO CART */}
                  <div className="product-bottom">
                    <strong>₹{Number(product.rate) || 0}</strong>

                    <button
                      type="button"
                      className="add-cart-btn"
                      onClick={(event) => addToCart(product, event)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}

export default Product;
