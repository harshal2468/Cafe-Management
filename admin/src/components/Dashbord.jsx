import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashbord.css";

function Dashbord() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [salesPeriod, setSalesPeriod] = useState("week");

  // ============================
  // FETCH DASHBOARD DATA
  // ============================

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [categoryResponse, productResponse, userResponse, orderResponse] =
        await Promise.all([
          fetch("http://localhost:5000/api/category", {
            credentials: "include",
          }),

          fetch("http://localhost:5000/api/products", {
            credentials: "include",
          }),

          fetch("http://localhost:5000/api/users", {
            credentials: "include",
          }),

          fetch("http://localhost:5000/api/orders", {
            credentials: "include",
          }),
        ]);

      // ============================
      // CATEGORY
      // ============================

      if (categoryResponse.ok) {
        const categoryData = await categoryResponse.json();
        setCategories(categoryData);
      }

      // ============================
      // PRODUCT
      // ============================

      if (productResponse.ok) {
        const productData = await productResponse.json();
        setProducts(productData);
      }

      // ============================
      // USERS
      // ============================

      if (userResponse.ok) {
        const userData = await userResponse.json();

        const customers = userData.filter((user) => user.role !== "admin");

        setUsers(customers);
      }

      // ============================
      // ORDERS
      // ============================

      if (orderResponse.ok) {
        const orderData = await orderResponse.json();
        setOrders(orderData);
      }
    } catch (error) {
      console.log("Dashboard Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // CURRENT DATE
  // ============================

  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // ============================
  // DASHBOARD COUNTS
  // ============================

  const totalCategories = categories.length;
  const totalProducts = products.length;
  const totalCustomers = users.length;
  const totalOrders = orders.length;

  // ============================
  // RECENT ORDERS
  // ============================

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // ============================
  // SALES DATA
  // ============================

  const getSalesData = () => {
    const now = new Date();

    // ----------------------------
    // THIS WEEK
    // ----------------------------

    if (salesPeriod === "week") {
      const data = [];

      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setHours(0, 0, 0, 0);
        date.setDate(now.getDate() - i);

        const nextDate = new Date(date);
        nextDate.setDate(date.getDate() + 1);

        const total = orders
          .filter((order) => {
            const orderDate = new Date(order.createdAt);

            return orderDate >= date && orderDate < nextDate;
          })
          .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

        data.push({
          label: date.toLocaleDateString("en-IN", {
            weekday: "short",
          }),
          total,
        });
      }

      return data;
    }

    // ----------------------------
    // THIS MONTH
    // ----------------------------

    if (salesPeriod === "month") {
      const year = now.getFullYear();
      const month = now.getMonth();

      const daysInMonth = new Date(year, month + 1, 0).getDate();

      const data = [];

      for (let day = 1; day <= daysInMonth; day++) {
        const startDate = new Date(year, month, day);

        const endDate = new Date(year, month, day + 1);

        const total = orders
          .filter((order) => {
            const orderDate = new Date(order.createdAt);

            return orderDate >= startDate && orderDate < endDate;
          })
          .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

        data.push({
          label: day.toString(),
          total,
        });
      }

      return data;
    }

    // ----------------------------
    // THIS YEAR
    // ----------------------------

    const year = now.getFullYear();

    return Array.from({ length: 12 }, (_, month) => {
      const total = orders
        .filter((order) => {
          const orderDate = new Date(order.createdAt);

          return (
            orderDate.getFullYear() === year && orderDate.getMonth() === month
          );
        })
        .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

      return {
        label: new Date(year, month, 1).toLocaleDateString("en-IN", {
          month: "short",
        }),
        total,
      };
    });
  };

  const salesData = getSalesData();

  const maxSale = Math.max(...salesData.map((item) => item.total), 1);

  const totalSales = orders.reduce(
    (sum, order) => sum + Number(order.totalAmount || 0),
    0,
  );

  return (
    <div className="dashboard-page">
      {/* ================= HEADER ================= */}

      <div className="dashboard-header">
        <div>
          <h1>
            Good Morning, Admin <span>👋</span>
          </h1>

          <p>Here's what's happening in your cafe today.</p>
        </div>

        <div className="dashboard-date">📅 {currentDate}</div>
      </div>

      {/* ================= STAT CARDS ================= */}

      <div className="dashboard-cards">
        {/* CATEGORY */}

        <div className="stat-card">
          <div className="stat-icon">☕</div>

          <div className="stat-content">
            <span>Total Categories</span>

            <strong>{loading ? "..." : totalCategories}</strong>

            <small>Active categories</small>
          </div>
        </div>

        {/* PRODUCT */}

        <div className="stat-card">
          <div className="stat-icon">🍔</div>

          <div className="stat-content">
            <span>Total Products</span>

            <strong>{loading ? "..." : totalProducts}</strong>

            <small>Available products</small>
          </div>
        </div>

        {/* ORDER */}

        <div className="stat-card">
          <div className="stat-icon">📦</div>

          <div className="stat-content">
            <span>Total Orders</span>

            <strong>{loading ? "..." : totalOrders}</strong>

            <small>Orders received</small>
          </div>
        </div>

        {/* CUSTOMER */}

        <div className="stat-card">
          <div className="stat-icon">👥</div>

          <div className="stat-content">
            <span>Total Customers</span>

            <strong>{loading ? "..." : totalCustomers}</strong>

            <small>Registered customers</small>
          </div>
        </div>
      </div>

      {/* ================= MIDDLE SECTION ================= */}

      <div className="dashboard-middle">
        {/* SALES */}

        <div className="dashboard-box sales-box">
          <div className="box-header">
            <div>
              <h2>Sales Overview</h2>

              <p>Total Sales: ₹{totalSales.toLocaleString("en-IN")}</p>
            </div>

            <select
              value={salesPeriod}
              onChange={(e) => setSalesPeriod(e.target.value)}
            >
              <option value="week">This Week</option>

              <option value="month">This Month</option>

              <option value="year">This Year</option>
            </select>
          </div>

          {orders.length === 0 ? (
            <div className="sales-empty">
              <div className="empty-chart-icon">📊</div>

              <h3>No sales data yet</h3>

              <p>
                Sales information will appear here when customers place orders.
              </p>
            </div>
          ) : (
            <div className="sales-chart">
              <div className="chart-bars">
                {salesData.map((item, index) => {
                  const height =
                    item.total > 0 ? (item.total / maxSale) * 100 : 5;

                  return (
                    <div className="chart-column" key={index}>
                      <span className="chart-value">₹{item.total}</span>

                      <div className="bar-area">
                        <div
                          className="sales-bar"
                          style={{
                            height: `${height}%`,
                          }}
                        ></div>
                      </div>

                      <small>{item.label}</small>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* QUICK ACTIONS */}

        <div className="dashboard-box quick-box">
          <div className="box-header">
            <div>
              <h2>Quick Actions</h2>
              <p>Manage your cafe quickly</p>
            </div>
          </div>

          <div className="quick-actions">
            <Link to="/admin/category/add" className="quick-action">
              <span>＋</span>

              <div>
                <strong>Add Category</strong>
                <small>Create new category</small>
              </div>
            </Link>

            <Link to="/admin/product/add" className="quick-action">
              <span>🍔</span>

              <div>
                <strong>Add Product</strong>
                <small>Add new menu item</small>
              </div>
            </Link>

            <Link to="/admin/orders" className="quick-action">
              <span>📋</span>

              <div>
                <strong>View Orders</strong>
                <small>Manage customer orders</small>
              </div>
            </Link>

            <Link to="/admin/users" className="quick-action">
              <span>👥</span>

              <div>
                <strong>Customers</strong>
                <small>{totalCustomers} registered users</small>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM SECTION ================= */}

      <div className="dashboard-bottom">
        {/* RECENT ORDERS */}

        <div className="dashboard-box recent-box">
          <div className="box-header">
            <div>
              <h2>Recent Orders</h2>
              <p>Latest customer orders</p>
            </div>

            {orders.length > 0 && (
              <Link to="/admin/orders" className="view-all">
                View All
              </Link>
            )}
          </div>

          {loading ? (
            <div className="orders-empty">
              <div>⏳</div>
              <h3>Loading orders...</h3>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="orders-empty">
              <div>📦</div>

              <h3>No orders yet</h3>

              <p>Recent customer orders will appear here.</p>
            </div>
          ) : (
            <div className="recent-orders-list">
              {recentOrders.map((order) => {
                const itemNames = order.items
                  ?.map((item) => item.pname)
                  .join(", ");

                return (
                  <div className="recent-order" key={order._id}>
                    <div className="order-icon">📦</div>

                    <div className="recent-order-info">
                      <strong>Order #{order._id.slice(-6)}</strong>

                      <small>{itemNames || "Cafe items"}</small>

                      <span>
                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </span>
                    </div>

                    <div className="recent-order-right">
                      <b>
                        ₹
                        {Number(order.totalAmount || 0).toLocaleString("en-IN")}
                      </b>

                      <span
                        className={`recent-status ${
                          order.status?.toLowerCase().replace(" ", "-") ||
                          "pending"
                        }`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* PRODUCTS */}

        <div className="dashboard-box popular-box">
          <div className="box-header">
            <div>
              <h2>Products</h2>
              <p>Available menu items</p>
            </div>
          </div>

          <div className="popular-products">
            {loading ? (
              <p className="loading-text">Loading products...</p>
            ) : products.length === 0 ? (
              <p className="loading-text">No products available.</p>
            ) : (
              products.slice(0, 4).map((product) => (
                <div className="popular-product" key={product._id}>
                  <div className="product-image">
                    {product.photo ? (
                      <img
                        src={`http://localhost:5000/uploads/${product.photo}`}
                        alt={product.pname}
                      />
                    ) : (
                      "☕"
                    )}
                  </div>

                  <div className="product-info">
                    <strong>{product.pname}</strong>

                    <small>Available</small>
                  </div>

                  <b>₹{product.rate}</b>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashbord;
