import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";


function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">MyShop</Link>
        </div>

        <div className="search-box">
          <input
            type="text"
            id="search"
            name="search"
            placeholder="Search products..."
          />
          <button>Search</button>
        </div>

        <div className="header-links">
          <Link to="/login">Login</Link>
          <Link to="/cart">🛒 Cart</Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
