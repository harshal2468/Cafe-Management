import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./OrderSuccess.css";

function OrderSuccess() {
  return (
    <>
      <Navbar />

      <div className="order-success">
        <div className="success-card">
          <div className="success-icon">✓</div>

          <h1>Order Placed Successfully!</h1>

          <p>
            Thank you for ordering from our cafe.
            <br />
            Your order has been received.
          </p>

          <div className="success-line"></div>

          <Link to="/product" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default OrderSuccess;
