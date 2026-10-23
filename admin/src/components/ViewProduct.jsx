import React, { useEffect, useState } from "react";
import "./ViewProduct.css";

function ViewProduct() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // =========================
  // FETCH PRODUCTS
  // =========================

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products");

      const data = await response.json();

      if (response.ok) {
        setProducts(data);
      } else {
        alert(data.message || "Unable to fetch products");
      }
    } catch (error) {
      console.log("Product Fetch Error:", error);
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
  // USE EFFECT
  // =========================

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  return (
    <div className="view-product-page">
      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="view-product-header">
        <div className="view-product-title">
          <div className="product-small-line"></div>

          <p className="product-badge">☕ CAFE MANAGEMENT</p>

          <h1>View Products</h1>

          <p className="product-subtitle">
            View and manage all your cafe products
          </p>
        </div>

        <div className="product-header-icon">🍽️</div>
      </div>

      {/* =========================
          PRODUCT CARD
      ========================= */}

      <div className="product-list-card">
        {/* CARD HEADER */}

        <div className="product-card-header">
          <div className="product-list-icon">☷</div>

          <div>
            <h2>Product List</h2>

            <p>All products available in your cafe</p>
          </div>
        </div>

        <div className="product-divider"></div>

        {/* =========================
            TABLE
        ========================= */}

        <div className="product-table-container">
          <table className="product-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Photo</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Description</th>
                <th>Rate</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product._id}>
                    {/* ID */}

                    <td>
                      <span className="product-id">{product.productid}</span>
                    </td>

                    {/* PHOTO */}

                    <td>
                      <img
                        src={`http://localhost:5000/uploads/${product.photo}`}
                        alt={product.pname}
                        className="product-photo"
                      />
                    </td>

                    {/* PRODUCT NAME */}

                    <td>
                      <span className="product-name">{product.pname}</span>
                    </td>

                    {/* CATEGORY */}

                    <td>
                      <span className="product-category">
                        {getCategoryName(product.categoryid)}
                      </span>
                    </td>

                    {/* QUANTITY */}

                    <td>{product.quantity}</td>

                    {/* DESCRIPTION */}

                    <td className="product-description">
                      {product.description}
                    </td>

                    {/* RATE */}

                    <td>
                      <span className="product-rate">₹{product.rate}</span>
                    </td>

                    {/* STATUS */}

                    <td>
                      <span
                        className={
                          product.status === "active"
                            ? "status-active"
                            : "status-inactive"
                        }
                      >
                        {product.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="product-no-data">
                    No products found ☕
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ViewProduct;
