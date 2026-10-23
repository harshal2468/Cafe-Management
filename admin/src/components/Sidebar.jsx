import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import logo from "./image/logo.png";
function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const [category, setCategory] = useState(false);
  const [product, setProduct] = useState(false);

  return (
    <>
      <aside
        className={`sidebar ${sidebarOpen ? "sidebar-open" : "sidebar-hide"}`}
      >
        {/* ================= LOGO ================= */}
        <div className="sidebar-brand">
          <div className="brand-logo">
            <img src={logo} alt="Cafe Logo" />
          </div>

          <div className="brand-text">
            <h2>BrewHub</h2>
            <span>ADMIN PANEL</span>
          </div>
        </div>

        {/* ================= MENU TITLE ================= */}
        <div className="menu-title">MAIN MENU</div>

        {/* ================= DASHBOARD ================= */}
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) => `menu ${isActive ? "active-menu" : ""}`}
        >
          <span className="menu-icon">▦</span>
          <span>Dashboard</span>
        </NavLink>

        {/* ================= CATEGORY ================= */}
        <div
          className={`menu ${category ? "menu-open" : ""}`}
          onClick={() => setCategory(!category)}
        >
          <div className="menu-left">
            <span className="menu-icon">▱</span>
            <span>Category</span>
          </div>

          <span className="arrow">{category ? "⌄" : "›"}</span>
        </div>

        {/* CATEGORY SUBMENU */}
        <div className={`submenu ${category ? "submenu-show" : ""}`}>
          <NavLink to="/admin/category/add" className="submenu-item">
            <span className="submenu-dot"></span>
            Add Category
          </NavLink>

          <NavLink to="/admin/category/view" className="submenu-item">
            <span className="submenu-dot"></span>
            View Category
          </NavLink>
        </div>

        {/* ================= PRODUCT ================= */}
        <div
          className={`menu ${product ? "menu-open" : ""}`}
          onClick={() => setProduct(!product)}
        >
          <div className="menu-left">
            <span className="menu-icon">▣</span>
            <span>Product</span>
          </div>

          <span className="arrow">{product ? "⌄" : "›"}</span>
        </div>

        {/* PRODUCT SUBMENU */}
        <div className={`submenu ${product ? "submenu-show" : ""}`}>
          <NavLink to="/admin/product/add" className="submenu-item">
            <span className="submenu-dot"></span>
            Add Product
          </NavLink>

          <NavLink to="/admin/product/view" className="submenu-item">
            <span className="submenu-dot"></span>
            View Product
          </NavLink>
        </div>

        {/* ================= USERS ================= */}
        <NavLink
          to="/admin/users"
          className={({ isActive }) => `menu ${isActive ? "active-menu" : ""}`}
        >
          <span className="menu-icon">♙</span>
          <span>Users</span>
        </NavLink>
        {/* ================= ORDERS ================= */}
        <NavLink
          to="/admin/orders"
          className={({ isActive }) => `menu ${isActive ? "active-menu" : ""}`}
        >
          <span className="menu-icon">📦</span>
          <span>Orders</span>
        </NavLink>
        {/* ================= BOTTOM ================= */}
        <div className="sidebar-bottom">
          <div className="coffee-line"></div>

          <p>Manage your cafe</p>

          <span>☕ BrewHub Management</span>
        </div>
      </aside>

      {/* ================= TOGGLE ================= */}
      <button
        className={`sidebar-toggle ${
          sidebarOpen ? "toggle-open" : "toggle-close"
        }`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? "‹" : "›"}
      </button>
    </>
  );
}

export default Sidebar;
