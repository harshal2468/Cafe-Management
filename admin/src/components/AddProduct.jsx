import React, { useEffect, useState } from "react";
import "./AddProduct.css";

function AddProduct() {
  const [categories, setCategories] = useState([]);
  const [categoryid, setCategoryid] = useState("");

  const [productid, setProductid] = useState("");
  const [pname, setPname] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [rate, setRate] = useState("");
  const [photo, setPhoto] = useState(null);
  const [status, setStatus] = useState("");

  // =========================
  // POPUP MESSAGE
  // =========================

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // =========================
  // CATEGORY MASTER SE DATA FETCH
  // =========================

  useEffect(() => {
    fetch("http://localhost:5000/api/category")
      .then((response) => {
        console.log("Status:", response.status);
        return response.json();
      })
      .then((data) => {
        console.log("Category Data:", data);
        setCategories(data);
      })
      .catch((error) => {
        console.log("Category Error:", error);

        setMessage("Unable to load categories.");
        setMessageType("error");

        setTimeout(() => {
          setMessage("");
          setMessageType("");
        }, 3000);
      });
  }, []);

  // =========================
  // INSERT PRODUCT
  // =========================

  const insertProduct = async (e) => {
    e.preventDefault();

    // Clear old message
    setMessage("");
    setMessageType("");

    // =========================
    // FORM DATA
    // =========================

    const formData = new FormData();

    formData.append("productid", productid);
    formData.append("categoryid", categoryid);
    formData.append("pname", pname);
    formData.append("quantity", quantity);
    formData.append("description", description);
    formData.append("rate", rate);

    if (photo) {
      formData.append("photo", photo);
    }

    formData.append("status", status);

    try {
      const response = await fetch("http://localhost:5000/api/product", {
        method: "POST",
        body: formData,
      });

      // =========================
      // READ SERVER RESPONSE
      // =========================

      const responseText = await response.text();

      let data;

      try {
        data = JSON.parse(responseText);
      } catch (error) {
        data = {
          message: responseText || "Product operation completed successfully.",
        };
      }

      console.log("Server Response:", data);

      // =========================
      // SUCCESS
      // =========================

      if (response.ok) {
        setMessage(data.message || "Product added successfully!");
        setMessageType("success");

        // =========================
        // RESET FORM
        // =========================

        setProductid("");
        setCategoryid("");
        setPname("");
        setQuantity("");
        setDescription("");
        setRate("");
        setPhoto(null);
        setStatus("");

        // Reset file input
        const photoInput = document.getElementById("photo");

        if (photoInput) {
          photoInput.value = "";
        }

        // =========================
        // HIDE SUCCESS POPUP
        // =========================

        setTimeout(() => {
          setMessage("");
          setMessageType("");
        }, 2500);
      }

      // =========================
      // ERROR FROM SERVER
      // =========================
      else {
        setMessage(data.message || "Unable to add product.");
        setMessageType("error");

        setTimeout(() => {
          setMessage("");
          setMessageType("");
        }, 3000);
      }
    } catch (error) {
      console.log("Add Product Error:", error);

      setMessage("Server error while adding product.");
      setMessageType("error");

      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
    }
  };

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setProductid("");
    setCategoryid("");
    setPname("");
    setQuantity("");
    setDescription("");
    setRate("");
    setPhoto(null);
    setStatus("");

    const photoInput = document.getElementById("photo");

    if (photoInput) {
      photoInput.value = "";
    }

    // Clear popup
    setMessage("");
    setMessageType("");
  };

  // =========================
  // UI
  // =========================

  return (
    <>
      <div className="product-page">
        {/* =========================
            POPUP MESSAGE
        ========================= */}

        {message && (
          <div className={`product-toast ${messageType}`}>
            {/* ICON */}

            <div className="toast-icon">
              {messageType === "success" ? "✓" : "!"}
            </div>

            {/* MESSAGE */}

            <div className="toast-content">
              <strong>{messageType === "success" ? "Success" : "Error"}</strong>

              <p>{message}</p>
            </div>

            {/* CLOSE */}

            <button
              type="button"
              className="toast-close"
              onClick={() => {
                setMessage("");
                setMessageType("");
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* =========================
            PAGE HEADER
        ========================= */}

        <div className="product-header">
          <div>
            <h1>Add Product</h1>
            <p>Create a new product</p>
          </div>
        </div>

        {/* =========================
            FORM CARD
        ========================= */}

        <div className="product-card">
          {/* CARD HEADER */}

          <div className="card-header">
            <div>
              <h2>Product Information</h2>
              <p>Enter product details below</p>
            </div>
          </div>

          {/* =========================
              FORM
          ========================= */}

          <form onSubmit={insertProduct}>
            <div className="product-form-grid">
              {/* =========================
                  PRODUCT ID
              ========================= */}

              <div className="form-group">
                <label>Product ID</label>

                <div className="input-box">
                  <input
                    type="text"
                    placeholder="Enter product ID"
                    value={productid}
                    onChange={(e) => setProductid(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* =========================
                  CATEGORY
              ========================= */}

              <div className="form-group">
                <label>Category</label>

                <div className="input-box select-box">
                  <select
                    value={categoryid}
                    onChange={(e) => setCategoryid(e.target.value)}
                    required
                  >
                    <option value="">Select Category</option>

                    {categories.map((category) => (
                      <option key={category._id} value={category.categoryid}>
                        {category.cname}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* =========================
                  PRODUCT NAME
              ========================= */}

              <div className="form-group">
                <label>Product Name</label>

                <div className="input-box">
                  <input
                    type="text"
                    placeholder="Enter product name"
                    value={pname}
                    onChange={(e) => setPname(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* =========================
                  QUANTITY
              ========================= */}

              <div className="form-group">
                <label>Quantity</label>

                <div className="input-box">
                  <input
                    type="number"
                    placeholder="Enter quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* =========================
                  DESCRIPTION
              ========================= */}

              <div className="form-group full-width">
                <label>Product Description</label>

                <div className="textarea-box">
                  <textarea
                    placeholder="Enter product description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>

              {/* =========================
                  RATE
              ========================= */}

              <div className="form-group">
                <label>Product Rate</label>

                <div className="input-box">
                  <input
                    type="number"
                    placeholder="Enter product rate"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* =========================
                  PHOTO
              ========================= */}

              <div className="form-group">
                <label>Product Photo</label>

                <div className="file-box">
                  <input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    required
                  />
                </div>
              </div>

              {/* =========================
                  STATUS
              ========================= */}

              <div className="form-group">
                <label>Status</label>

                <div className="input-box select-box">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                  >
                    <option value="">Select Status</option>

                    <option value="active">Active</option>

                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* =========================
                BUTTONS
            ========================= */}

            <div className="form-buttons">
              {/* RESET */}

              <button type="button" className="reset-btn" onClick={resetForm}>
                Reset
              </button>

              {/* SAVE */}

              <button type="submit" className="submit-btn">
                Save Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddProduct;
