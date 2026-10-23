import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Order.css";

function Order() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");

  const navigate = useNavigate();

  // =========================
  // CHECK SESSION + LOAD CART
  // =========================

  useEffect(() => {
    const loadOrderData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/session", {
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok || !data.loggedIn || !data.user) {
          navigate("/login");
          return;
        }

        setUser(data.user);

        // User-specific cart
        const cartKey = `cart_${data.user.id}`;

        const savedCart = JSON.parse(localStorage.getItem(cartKey)) || [];

        if (savedCart.length === 0) {
          navigate("/cart");
          return;
        }

        setCart(savedCart);
        setLoading(false);
      } catch (error) {
        console.log("Order Session Error:", error);
        navigate("/login");
      }
    };

    loadOrderData();
  }, [navigate]);

  // =========================
  // TOTAL PRICE
  // =========================

  const totalPrice = cart.reduce(
    (total, item) =>
      total + Number(item.rate || 0) * Number(item.quantity || 0),
    0,
  );

  // =========================
  // PLACE ORDER
  // =========================

  const placeOrder = async (e) => {
    e.preventDefault();

    if (!address.trim()) {
      setOrderMessage("Please enter delivery address.");
      return;
    }

    if (!phone.trim()) {
      setOrderMessage("Please enter mobile number.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/order", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify({
          items: cart,
          address: address,
          phone: phone,
          paymentMethod: paymentMethod,
          totalAmount: totalPrice,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Clear user cart
        const cartKey = `cart_${user.id}`;
        localStorage.removeItem(cartKey);

        // Update navbar cart count
        window.dispatchEvent(new Event("cartUpdated"));

        // Show success popup
        setOrderSuccess(true);
        setOrderMessage("Order placed successfully!");
      } else {
        setOrderMessage(data.message || "Unable to place order");
      }
    } catch (error) {
      console.log("Order Error:", error);

      setOrderMessage("Server error while placing order.");
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <>
        <Navbar />

        <section className="order-section">
          <h1>Loading Order...</h1>
        </section>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <section className="order-section">
        {/* HEADING */}

        <div className="order-heading">
          <span>CHECKOUT</span>

          <h1>Place Your Order</h1>

          <p>Enter your delivery details and confirm your order.</p>
        </div>

        <div className="order-container">
          {/* =========================
              CUSTOMER DETAILS
          ========================= */}

          <div className="customer-details">
            <h2>Delivery Details</h2>

            <form onSubmit={placeOrder}>
              <div className="form-group">
                <label>Name</label>

                <input type="text" value={user?.name || ""} disabled />
              </div>

              <div className="form-group">
                <label>Email</label>

                <input type="email" value={user?.email || ""} disabled />
              </div>

              <div className="form-group">
                <label>Mobile Number</label>

                <input
                  type="tel"
                  placeholder="Enter mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Delivery Address</label>

                <textarea
                  placeholder="Enter your complete delivery address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                ></textarea>
              </div>

              {/* PAYMENT */}

              <div className="form-group">
                <label>Payment Method</label>

                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="Cash on Delivery">Cash on Delivery</option>

                  <option value="Online Payment">Online Payment</option>
                </select>
              </div>

              <button type="submit" className="place-order-btn">
                Place Order
              </button>
            </form>
          </div>

          {/* =========================
              ORDER SUMMARY
          ========================= */}

          <div className="order-summary">
            <h2>Order Summary</h2>

            {cart.map((item) => (
              <div className="order-item" key={item._id}>
                <img
                  src={`http://localhost:5000/uploads/${item.photo}`}
                  alt={item.pname}
                />

                <div>
                  <h4>{item.pname}</h4>

                  <p>
                    ₹{item.rate} × {item.quantity}
                  </p>
                </div>

                <strong>₹{Number(item.rate) * Number(item.quantity)}</strong>
              </div>
            ))}

            <div className="order-divider"></div>

            <div className="order-total">
              <span>Total</span>

              <strong>₹{totalPrice}</strong>
            </div>

            <Link to="/cart" className="back-cart">
              ← Back to Cart
            </Link>
          </div>
        </div>
      </section>
      {orderSuccess && (
        <div className="success-overlay">
          <div className="success-popup">
            <div className="success-icon">✓</div>

            <h2>Order Placed Successfully!</h2>

            <p>Thank you for ordering from our cafe.</p>

            <p>Your order has been received.</p>

            <div className="success-line"></div>

            <button
              className="continue-shopping-btn"
              onClick={() => navigate("/myorders")}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Order;
