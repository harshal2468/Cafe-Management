import React, { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState("");

  // =========================
  // CHECK LOGIN SESSION
  // =========================
  const checkLogin = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/session", {
        credentials: "include",
      });

      const data = await response.json();

      console.log("SESSION DATA:", data);

      if (response.ok && data.loggedIn) {
        setIsLoggedIn(true);
        setUser(data.user);
        updateCartCount();
      } else {
        setIsLoggedIn(false);
        setUser(null);
        setCartCount(0);
      }
    } catch (error) {
      console.log("Session Check Error:", error);
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  // =========================
  // UPDATE CART COUNT
  // =========================

  const updateCartCount = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/session", {
        credentials: "include",
      });

      if (!response.ok) {
        setCartCount(0);
        return;
      }

      const data = await response.json();

      if (!data.loggedIn || !data.user) {
        setCartCount(0);
        return;
      }

      const cartKey = `cart_${data.user.id}`;

      const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

      const totalItems = cart.reduce(
        (total, item) => total + Number(item.quantity || 0),
        0,
      );

      setCartCount(totalItems);
    } catch (error) {
      console.log("Cart Count Error:", error);
      setCartCount(0);
    }
  };
  // =========================
  // LOGOUT
  // =========================

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/logout", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        // Frontend state clear
        setIsLoggedIn(false);
        setUser(null);
        setProfileOpen(false);
        setCartCount(0);

        // Other components ko inform
        window.dispatchEvent(new Event("authUpdated"));

        // Logout popup
        setLogoutMessage("Logout Successful! 👋");

        // Popup dikhne ke baad home page
        setTimeout(() => {
          setLogoutMessage("");
          navigate("/");
        }, 1800);
      } else {
        alert(data.message || "Logout failed");
      }
    } catch (error) {
      console.log("Logout Error:", error);
      alert("Server connection error");
    }
  };

  // =========================
  // USE EFFECT
  // =========================

  useEffect(() => {
    checkLogin();

    updateCartCount();

    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("authUpdated", checkLogin);
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);

      window.removeEventListener("authUpdated", checkLogin);

      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  return (
    <nav className="navbar">
      {/* LOGOUT SUCCESS POPUP */}
      {logoutMessage && (
        <div className="logout-success-popup">
          <div className="logout-success-icon">✓</div>

          <div className="logout-success-content">
            <h3>Success!</h3>
            <p>{logoutMessage}</p>
          </div>
        </div>
      )}
      <div className="nav-container">
        {/* =========================
            LOGO
        ========================= */}

        <NavLink to="/" className="cafe-logo">
          <div className="coffee-logo">
            <div className="cup"></div>
            <div className="handle"></div>
            <div className="coffee-steam steam-one"></div>
            <div className="coffee-steam steam-two"></div>
          </div>

          <div className="brand-name">
            <h2>
              BREW<span>HUB</span>
            </h2>

            <p>CAFE MANAGEMENT</p>
          </div>
        </NavLink>

        {/* =========================
            MENU
        ========================= */}

        <div className="nav-menu">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/product"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Products
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            About
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Contact
          </NavLink>
        </div>

        {/* =========================
            RIGHT SIDE
        ========================= */}

        <div className="auth-buttons">
          {/* =========================
              VIEW CART
              ONLY LOGIN USER
          ========================= */}

          {isLoggedIn && (
            <Link to="/cart" className="nav-cart">
              <span className="cart-icon">🛒</span>

              <span className="cart-text">View Cart</span>

              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
          )}

          {/* =========================
              LOGGED IN USER
          ========================= */}

          {isLoggedIn ? (
            <div className="profile-wrapper">
              {/* PROFILE BUTTON */}

              <button
                className="profile-btn"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <span className="profile-icon">👤</span>

                <span className="profile-name">{user?.name || "User"}</span>

                <span className="profile-arrow">{profileOpen ? "▲" : "▼"}</span>
              </button>

              {/* PROFILE DROPDOWN */}

              {profileOpen && (
                <div className="profile-dropdown">
                  <div className="profile-header">
                    <div className="profile-big-icon">👤</div>

                    <div>
                      <h3>{user?.name || "User"}</h3>

                      <p>{user?.role || "user"}</p>
                    </div>
                  </div>

                  <div className="profile-divider"></div>

                  <div className="profile-detail">
                    <span>Name</span>
                    <strong>{user?.name || "-"}</strong>
                  </div>

                  <div className="profile-detail">
                    <span>Email</span>
                    <strong>{user?.email || "-"}</strong>
                  </div>

                  <div className="profile-detail">
                    <span>Role</span>
                    <strong>{user?.role || "user"}</strong>
                  </div>
                  <Link
                    to="/myorders"
                    className="my-orders-btn"
                    onClick={() => setProfileOpen(false)}
                  >
                    My Orders
                  </Link>

                  <button className="logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* LOGIN */}

              <NavLink to="/login" className="login-btn">
                Login
              </NavLink>

              {/* REGISTER */}

              <NavLink to="/register" className="register-btn">
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
