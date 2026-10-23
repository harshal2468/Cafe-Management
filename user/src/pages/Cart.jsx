import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Cart.css";

function Cart() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // =========================
  // CHECK SESSION + LOAD CART
  // =========================

  useEffect(() => {
    const loadUserCart = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/session", {
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok || !data.loggedIn || !data.user) {
          setUser(null);
          setCart([]);
          setLoading(false);

          navigate("/login");
          return;
        }

        // Logged-in user
        setUser(data.user);

        // User-specific cart key
        const cartKey = `cart_${data.user.id}`;

        const savedCart = JSON.parse(localStorage.getItem(cartKey)) || [];

        setCart(savedCart);
        setLoading(false);
      } catch (error) {
        console.log("Cart Session Error:", error);

        setUser(null);
        setCart([]);
        setLoading(false);

        navigate("/login");
      }
    };

    loadUserCart();
  }, [navigate]);

  // =========================
  // UPDATE CART
  // =========================

  const updateCart = (updatedCart) => {
    setCart(updatedCart);

    if (!user) {
      return;
    }

    // User-specific cart
    const cartKey = `cart_${user.id}`;

    localStorage.setItem(cartKey, JSON.stringify(updatedCart));

    // Update Navbar cart count
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // =========================
  // PLUS
  // =========================

  const increaseQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      item._id === id
        ? {
            ...item,
            quantity: item.quantity + 1,
          }
        : item,
    );

    updateCart(updatedCart);
  };

  // =========================
  // MINUS
  // =========================

  const decreaseQuantity = (id) => {
    const updatedCart = cart
      .map((item) =>
        item._id === id
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item,
      )
      .filter((item) => item.quantity > 0);

    updateCart(updatedCart);
  };

  // =========================
  // REMOVE
  // =========================

  const removeProduct = (id) => {
    const updatedCart = cart.filter((item) => item._id !== id);

    updateCart(updatedCart);
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <>
        <Navbar />

        <section className="cart-section">
          <div className="cart-heading">
            <h1>Loading Cart...</h1>
          </div>
        </section>

        <Footer />
      </>
    );
  }

  // =========================
  // TOTAL ITEMS
  // =========================

  const totalItems = cart.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0,
  );

  // =========================
  // TOTAL PRICE
  // =========================

  const totalPrice = cart.reduce(
    (total, item) =>
      total + Number(item.rate || 0) * Number(item.quantity || 0),
    0,
  );

  return (
    <>
      <Navbar />

      <section className="cart-section">
        {/* =========================
            HEADING
        ========================= */}

        <div className="cart-heading">
          <span>YOUR ORDER</span>

          <h1>Shopping Cart</h1>

          <p>Review your selected cafe items.</p>
        </div>

        {/* =========================
            EMPTY CART
        ========================= */}

        {cart.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>

            <h2>Your Cart is Empty</h2>

            <p>Looks like you haven't added anything to your cart yet.</p>

            <Link to="/product" className="continue-shopping">
              Continue Shopping
            </Link>
          </div>
        ) : (
          /* =========================
             CART CONTAINER
          ========================= */

          <div className="cart-container">
            {/* =========================
                PRODUCTS
            ========================= */}

            <div className="cart-products">
              <div className="cart-products-header">
                <h2>Your Items</h2>

                <span>{totalItems} Items</span>
              </div>

              {cart.map((item) => (
                <div className="cart-item" key={item._id}>
                  {/* IMAGE */}

                  <div className="cart-item-image">
                    <img
                      src={`http://localhost:5000/uploads/${item.photo}`}
                      alt={item.pname}
                    />
                  </div>

                  {/* INFO */}

                  <div className="cart-item-info">
                    <h3>{item.pname}</h3>

                    <p>{item.description}</p>

                    <strong>₹{item.rate}</strong>
                  </div>

                  {/* QUANTITY */}

                  <div className="quantity-box">
                    <span className="quantity-label">Quantity</span>

                    <div className="quantity">
                      <button onClick={() => decreaseQuantity(item._id)}>
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button onClick={() => increaseQuantity(item._id)}>
                        +
                      </button>
                    </div>
                  </div>

                  {/* ITEM TOTAL */}

                  <div className="item-total">
                    <span>Total</span>

                    <strong>
                      ₹{Number(item.rate) * Number(item.quantity)}
                    </strong>
                  </div>

                  {/* REMOVE */}

                  <button
                    className="remove-btn"
                    onClick={() => removeProduct(item._id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* =========================
                SUMMARY
            ========================= */}

            <div className="cart-summary">
              <h2>Order Summary</h2>

              <div className="summary-row">
                <span>Items</span>

                <span>{totalItems}</span>
              </div>

              <div className="summary-row">
                <span>Subtotal</span>

                <span>₹{totalPrice}</span>
              </div>

              <div className="summary-row">
                <span>Delivery</span>

                <span className="free">FREE</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span>Total</span>

                <strong>₹{totalPrice}</strong>
              </div>

              <button
                className="checkout-btn"
                onClick={() => navigate("/order")}
              >
                Proceed to Order
              </button>

              <Link to="/product" className="back-products">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}

export default Cart;
