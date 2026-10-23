import React, { useEffect, useState } from "react";
import "./ViewCategory.css";
import { useNavigate } from "react-router-dom";

function ViewCategory() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/category");
      const data = await response.json();

      if (response.ok) {
        setCategories(data);
        console.log("Fetched categories:", data);
      } else {
        alert("Unable to fetch categories");
        console.log("Fetched categories:", data);
      }
    } catch (error) {
      console.log(error);
      alert("Server error");
    }
  };
  const deleteCategory = async (categoryid) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/category/${categoryid}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (response.ok) {
        alert("Category deleted successfully");

        // list refresh
        fetchCategories();
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (error) {
      console.log(error);
      alert("Server error");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="view-category-page">
      {/* HEADER */}
      <div className="view-category-heading">
        <div>
          <div className="view-small-line"></div>

          <p className="view-badge">☕ CAFE MANAGEMENT</p>

          <h1>View Categories</h1>

          <p className="view-subtitle">Manage all your cafe menu categories</p>
        </div>

        <div className="view-header-icon">☕</div>
      </div>

      {/* CARD */}
      <div className="category-card">
        <div className="category-card-header">
          <div className="category-list-icon">☷</div>

          <div>
            <h2>Category List</h2>
            <p>All categories available in your cafe</p>
          </div>
        </div>

        <div className="category-divider"></div>

        {/* TABLE */}
        <div className="table-container">
          <table className="category-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Category Name</th>
                <th>Photo</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category._id}>
                    <td>{category.categoryid}</td>

                    <td>
                      <span className="category-name">{category.cname}</span>
                    </td>

                    <td>
                      <img
                        className="category-photo"
                        src={`http://localhost:5000/uploads/${category.photo}`}
                        alt={category.cname}
                      />
                    </td>

                    <td>
                      <button
                        className="edit-btn"
                        onClick={() =>
                          navigate(
                            `/admin/edit-category/${category.categoryid}`,
                          )
                        }
                      >
                        ✏ Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => deleteCategory(category.categoryid)}
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-data">
                    No categories found ☕
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

export default ViewCategory;
