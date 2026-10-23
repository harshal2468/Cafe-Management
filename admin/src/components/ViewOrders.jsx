import React, { useEffect, useState } from "react";
import "./ViewOrders.css";

function ViewOrders() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH ALL ORDERS
  // =========================

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setOrders(data);
      } else {
        alert(data.message || "Unable to fetch orders");
      }
    } catch (error) {
      console.log("Fetch Orders Error:", error);
      alert("Server error while fetching orders");
    }
  };

  // =========================
  // FETCH ALL USERS
  // =========================

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setUsers(data);
      } else {
        alert(data.message || "Unable to fetch users");
      }
    } catch (error) {
      console.log("Fetch Users Error:", error);
    }
  };

  // =========================
  // GET USER NAME
  // =========================

  const getUserName = (userId) => {
    const user = users.find((u) => u._id?.toString() === userId?.toString());

    return user ? user.name : "Unknown User";
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchOrders(), fetchUsers()]);
      setLoading(false);
    };

    loadData();
  }, []);

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return <h2 className="orders-loading">Loading Orders...</h2>;
  }

  return (
    <div className="orders-page">
      <div className="orders-heading">
        <span>CAFE MANAGEMENT</span>
        <h1>View Orders</h1>
        <p>Manage all customer orders</p>
      </div>

      <div className="orders-card">
        {orders.length === 0 ? (
          <div className="no-orders">
            <h2>No Orders Found</h2>
            <p>There are no customer orders yet.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Name</th>
                  <th>Items</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Payment</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id.slice(-6)}</td>

                    <td>{getUserName(order.userId)}</td>

                    <td>
                      {order.items.map((item, index) => (
                        <div className="order-product" key={index}>
                          <span>{item.pname}</span>
                          <small>
                            ₹{item.rate} × {item.quantity}
                          </small>
                        </div>
                      ))}
                    </td>

                    <td>{order.phone}</td>

                    <td className="address-cell">{order.address}</td>

                    <td>{order.paymentMethod}</td>

                    <td className="total-cell">₹{order.totalAmount}</td>

                    <td>
                      <span
                        className={`status ${order.status
                          ?.toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewOrders;
