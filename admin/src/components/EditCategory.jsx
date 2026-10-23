import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditCategory.css";

function EditCategory() {
  const { categoryid } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState({
    categoryid: "",
    cname: "",
    photo: "",
  });

  const [newPhoto, setNewPhoto] = useState(null);

  // ===============================
  // FETCH CATEGORY
  // ===============================

  useEffect(() => {
    fetch(`http://localhost:5000/api/category/${categoryid}`)
      .then((res) => res.json())
      .then((data) => {
        setCategory(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [categoryid]);

  // ===============================
  // UPDATE CATEGORY
  // ===============================

  const updateCategory = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("cname", category.cname);

    if (newPhoto) {
      formData.append("photo", newPhoto);
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/category/${categoryid}`,
        {
          method: "PUT",
          body: formData,
        },
      );

      const data = await response.json();

      if (response.ok) {
        alert("Category updated successfully");

        navigate("/admin/view-category");
      } else {
        alert(data.message || "Update failed");
      }
    } catch (error) {
      console.log(error);
      alert("Server error");
    }
  };

  return (
    <div className="edit-category-page">
      <div className="edit-category-card">
        <h2>Edit Category</h2>

        <p>Update your cafe category details</p>

        <form onSubmit={updateCategory}>
          {/* Category ID */}

          <div className="form-group">
            <label>Category ID</label>

            <input type="text" value={category.categoryid} disabled />
          </div>

          {/* Category Name */}

          <div className="form-group">
            <label>Category Name</label>

            <input
              type="text"
              value={category.cname}
              onChange={(e) =>
                setCategory({
                  ...category,
                  cname: e.target.value,
                })
              }
              required
            />
          </div>

          {/* Current Photo */}

          <div className="form-group">
            <label>Current Photo</label>

            {category.photo && (
              <img
                src={`http://localhost:5000/uploads/${category.photo}`}
                alt="category"
                className="current-category-image"
              />
            )}
          </div>

          {/* New Photo */}

          <div className="form-group">
            <label>Change Photo</label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewPhoto(e.target.files[0])}
            />
          </div>

          {/* Buttons */}

          <div className="edit-buttons">
            <button type="submit" className="update-btn">
              Update Category
            </button>

            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/admin/category/view")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditCategory;
