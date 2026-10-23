  import React, { useState } from "react";
  import "./AddCategory.css";

  function AddCategory() {
    const [categoryid, setCategoryid] = useState("");
    const [cname, setCname] = useState("");
    const [photo, setPhoto] = useState(null);

    const insertCategory = async (e) => {
      e.preventDefault();

      const formData = new FormData();

      formData.append("categoryid", categoryid);
      formData.append("cname", cname);
      formData.append("photo", photo);

      try {
        const response = await fetch("http://localhost:5000/api/category", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        alert(data.message);

        if (response.ok) {
          setCategoryid("");
          setCname("");
          setPhoto(null);

          document.getElementById("photo").value = "";
        }
      } catch (error) {
        console.log(error);
        alert("An error occurred while adding the category.");
      }
    };

    const resetForm = () => {
      setCategoryid("");
      setCname("");
      setPhoto(null);

      document.getElementById("photo").value = "";
    };

    return (
      <>
        <div className="cafe-category-page">
          {/* PAGE HEADER */}
          <div className="cafe-category-heading">
            <div className="cafe-title-section">
              <div className="cafe-small-line"></div>

              <p className="cafe-badge">☕ CAFE MANAGEMENT</p>

              <h1>Add Category</h1>

              <p className="cafe-subtitle">
                Create and manage your cafe categories
              </p>
            </div>

            <div className="cafe-header-icon">☕</div>
          </div>

          {/* FORM CARD */}
          <div className="cafe-category-card">
            {/* CARD HEADER */}
            <div className="cafe-category-card-header">
              <div className="cafe-plus-icon">+</div>

              <div>
                <h2>Category Information</h2>

                <p>Add a new category to your cafe menu</p>
              </div>
            </div>

            <div className="cafe-category-divider"></div>

            {/* FORM */}
            <form onSubmit={insertCategory}>
              <div className="cafe-category-row">
                {/* CATEGORY ID */}
                <div className="cafe-input-group">
                  <label>Category ID</label>

                  <div className="cafe-input-wrapper">
                    <input
                      type="number"
                      value={categoryid}
                      placeholder="Enter category ID"
                      onChange={(e) => setCategoryid(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* CATEGORY NAME */}
                <div className="cafe-input-group">
                  <label>Category Name</label>

                  <div className="cafe-input-wrapper">
                    <input
                      type="text"
                      value={cname}
                      placeholder="Enter category name"
                      onChange={(e) => setCname(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* PHOTO */}
              <div className="cafe-photo-group">
                <label>Category Photo</label>

                <div className="cafe-file-drop">
                  <input
                    type="file"
                    id="photo"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    required
                  />
                </div>

                <p>Upload JPG, PNG or WEBP image</p>
              </div>

              <div className="cafe-category-divider"></div>

              {/* BUTTONS */}
              <div className="cafe-category-buttons">
                <button
                  type="button"
                  className="cafe-reset-button"
                  onClick={resetForm}
                >
                  Reset
                </button>

                <button type="submit" className="cafe-save-button">
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  }

  export default AddCategory;
