import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./MyOrders.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ==========================================
  // FETCH MY ORDERS
  // ==========================================

  const fetchMyOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/my-orders", {
        credentials: "include",
      });

      if (response.status === 401) {
        navigate("/login");
        return;
      }

      const data = await response.json();

      if (response.ok) {
        setOrders(data);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log("My Orders Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Navbar />

      <div className="my-orders-page">
        {/* PAGE HEADER */}

        <div className="my-orders-header">
          <h1>My Orders</h1>

          <p>View your previous cafe orders and order details</p>
        </div>

        {/* LOADING */}

        {loading && (
          <div className="orders-loading">
            <div className="orders-spinner"></div>
            <p>Loading your orders...</p>
          </div>
        )}

        {/* NO ORDERS */}

        {!loading && orders.length === 0 && (
          <div className="no-orders">
            <div className="no-orders-icon">🛒</div>

            <h2>No Orders Yet</h2>

            <p>You haven't placed any orders yet.</p>

            <Link to="/product" className="order-now-btn">
              Start Shopping
            </Link>
          </div>
        )}

        {/* ORDERS */}

        {!loading && orders.length > 0 && (
          <div className="orders-container">
            {orders.map((order) => (
              <div className="my-order-card" key={order._id}>
                {/* ORDER HEADER */}

                <div className="order-card-header">
                  <div>
                    <span className="order-label">Order ID</span>

                    <strong>#{order._id.slice(-8).toUpperCase()}</strong>
                  </div>

                  <span
                    className={`order-status ${order.status
                      ?.toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* ORDER DATE */}

                <div className="order-date">
                  Ordered on: {formatDate(order.createdAt)}
                </div>

                {/* ITEMS */}

                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div className="my-order-item" key={index}>
                      <img
                        src={`http://localhost:5000/uploads/${item.photo}`}
                        alt={item.pname}
                      />

                      <div className="order-item-info">
                        <h3>{item.pname}</h3>

                        <p>
                          ₹{Number(item.rate || 0)} ×{" "}
                          {Number(item.quantity || 0)}
                        </p>
                      </div>

                      <strong className="item-total">
                        ₹
                        {(
                          Number(item.rate || 0) * Number(item.quantity || 0)
                        ).toFixed(2)}
                      </strong>
                    </div>
                  ))}
                </div>

                {/* ORDER FOOTER */}

                <div className="order-card-footer">
                  <div>
                    <span>Payment</span>
                    <strong>{order.paymentMethod}</strong>
                  </div>

                  <div>
                    <span>Total Amount</span>

                    <strong className="order-total">
                      ₹{Number(order.totalAmount || 0).toFixed(2)}
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default MyOrders;
