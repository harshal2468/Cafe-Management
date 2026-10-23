const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const User = require("./model/User");
const session = require("express-session");
const Order = require("./model/Order");
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  }),
);
app.use(
  session({
    secret: "brewhub-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
      sameSite: "lax",
    },
  }),
);
app.use(express.json());

// ===============================
// MongoDB connection
// ===============================

mongoose
  .connect("mongodb://127.0.0.1:27017/myapp")
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

// ===============================
// Make uploads folder accessible
// ===============================

app.use("/uploads", express.static("uploads"));

// ===============================
// Multer configuration
// ===============================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
});

// ===============================
// Category Schema
// ===============================

const categorySchema = new mongoose.Schema({
  categoryid: {
    type: Number,
    required: true,
  },

  cname: {
    type: String,
    required: true,
  },

  photo: {
    type: String,
    required: true,
  },
});

// Collection name = category_master

const Category = mongoose.model("Category", categorySchema, "category_master");

// ===============================
// Product Schema
// ===============================

const productSchema = new mongoose.Schema({
  productid: {
    type: Number,
    required: true,
  },

  categoryid: {
    type: Number,
    required: true,
  },

  pname: {
    type: String,
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  rate: {
    type: Number,
    required: true,
  },

  photo: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    required: true,
  },
});

// Collection name = product_master

const Product = mongoose.model("Product", productSchema, "product_master");

// =====================================================
// CATEGORY INSERT
// =====================================================

app.post("/api/category", upload.single("photo"), async (req, res) => {
  try {
    const { categoryid, cname } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "Please select photo",
      });
    }

    const category = new Category({
      categoryid: categoryid,

      cname: cname,

      photo: req.file.filename,
    });

    await category.save();

    res.json({
      message: "Category inserted successfully",

      data: category,
    });
  } catch (error) {
    console.log("Category Error:", error);

    res.status(500).json({
      message: "Error inserting category",
    });
  }
});

// =====================================================
// GET CATEGORY
// =====================================================

app.get("/api/category", async (req, res) => {
  try {
    const categories = await Category.find();

    res.json(categories);
  } catch (error) {
    console.log("Category Fetch Error:", error);

    res.status(500).json({
      message: "Error fetching categories",
    });
  }
});

// =====================================================
// PRODUCT INSERT
// =====================================================

app.post("/api/product", upload.single("photo"), async (req, res) => {
  try {
    console.log("Product Body:", req.body);
    console.log("Product File:", req.file);

    const {
      productid,
      categoryid,
      pname,
      quantity,
      description,
      rate,
      status,
    } = req.body;

    // Check Product Photo

    if (!req.file) {
      return res.status(400).json({
        message: "Please select product photo",
      });
    }

    // Create Product

    const product = new Product({
      productid: productid,

      categoryid: categoryid,

      pname: pname,

      quantity: quantity,

      description: description,

      rate: rate,

      photo: req.file.filename,

      status: status,
    });

    // Save Product

    await product.save();

    res.json({
      message: "Product inserted successfully",

      data: product,
    });
  } catch (error) {
    console.log("Product Insert Error:", error);

    res.status(500).json({
      message: "Error inserting product",

      error: error.message,
    });
  }
});
// ==========================================
// 1. HOME PAGE - ONLY 3 PRODUCTS
// ==========================================

app.get("/api/product/home", async (req, res) => {
  try {
    const products = await Product.find().limit(3);

    res.json(products);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error fetching home products",
    });
  }
});

// ==========================================
// 2. PRODUCT PAGE - ALL PRODUCTS
// ==========================================

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();

    res.json(products);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error fetching products",
    });
  }
});

// ==========================================
// 3. CATEGORY WISE PRODUCTS
// ==========================================

app.get("/api/product/:categoryid", async (req, res) => {
  try {
    const categoryid = Number(req.params.categoryid);

    const products = await Product.find({
      categoryid: categoryid,
    });

    res.json(products);
  } catch (error) {
    console.log("Category Product Fetch Error:", error);

    res.status(500).json({
      message: "Error fetching category products",
    });
  }
});
// ===============================
// DELETE CATEGORY
// ===============================

app.delete("/api/category/:categoryid", async (req, res) => {
  try {
    const categoryid = Number(req.params.categoryid);

    const category = await Category.findOneAndDelete({
      categoryid: categoryid,
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error deleting category",
    });
  }
});
// ===============================
// UPDATE CATEGORY
// ===============================

app.put(
  "/api/category/:categoryid",
  upload.single("photo"),
  async (req, res) => {
    try {
      const categoryid = Number(req.params.categoryid);

      const updateData = {
        cname: req.body.cname,
      };

      // Agar new photo select ki hai
      if (req.file) {
        updateData.photo = req.file.filename;
      }

      const category = await Category.findOneAndUpdate(
        { categoryid: categoryid },
        updateData,
        { new: true },
      );

      if (!category) {
        return res.status(404).json({
          message: "Category not found",
        });
      }

      res.json({
        message: "Category updated successfully",
        category: category,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Error updating category",
      });
    }
  },
);
// ===============================
// GET SINGLE CATEGORY
// ===============================

app.get("/api/category/:categoryid", async (req, res) => {
  try {
    const categoryid = Number(req.params.categoryid);

    const category = await Category.findOne({
      categoryid: categoryid,
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.json(category);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error fetching category",
    });
  }
});
// ==========================================
// REGISTER USER
// ==========================================

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    // Check email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    // Create user
    const user = new User({
      name,
      email,
      mobile,
      password,
      role: "user",
    });

    await user.save();

    res.status(201).json({
      message: "Registration successful",
    });
  } catch (error) {
    console.log("Registration Error:", error);

    res.status(500).json({
      message: "Registration failed",
    });
  }
});
// ==========================================
// GET ALL USERS - ADMIN
// ==========================================

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json(users);
  } catch (error) {
    console.log("Fetch Users Error:", error);

    res.status(500).json({
      message: "Unable to fetch users",
    });
  }
});
// ===============================
// DELETE USER
// ===============================

app.delete("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Admin ko delete nahi karne dena
    if (user.role === "admin") {
      return res.status(403).json({
        message: "Admin user cannot be deleted",
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log("Delete User Error:", error);

    res.status(500).json({
      message: "Unable to delete user",
    });
  }
});
// ==========================================
// LOGIN USER + CREATE SESSION
// ==========================================

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email,
      password: password,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    // ==========================================
    // FORGOT PASSWORD - RESET PASSWORD
    // ==========================================

    app.put("/api/forgot-password", async (req, res) => {
      try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
          return res.status(400).json({
            message: "Email and new password are required",
          });
        }

        if (newPassword.length < 6) {
          return res.status(400).json({
            message: "Password must be at least 6 characters",
          });
        }

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
          return res.status(404).json({
            message: "Email not registered",
          });
        }

        // Update password
        user.password = newPassword;

        await user.save();

        res.status(200).json({
          success: true,
          message: "Password reset successfully",
        });
      } catch (error) {
        console.log("Forgot Password Error:", error);

        res.status(500).json({
          success: false,
          message: "Unable to reset password",
        });
      }
    });
    // ============================
    // CREATE SESSION
    // ============================

    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    console.log("Session Created:", req.session.user);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
});
// ==========================================
// CHECK LOGIN SESSION
// ==========================================

app.get("/api/session", (req, res) => {
  if (req.session.user) {
    return res.status(200).json({
      loggedIn: true,
      user: req.session.user,
    });
  }

  res.status(401).json({
    loggedIn: false,
    message: "User not logged in",
  });
});
// ==========================================
// LOGOUT USER
// ==========================================

app.post("/api/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.log("Logout Error:", error);

      return res.status(500).json({
        success: false,
        message: "Logout failed",
      });
    }

    res.clearCookie("connect.sid");

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  });
});
// ===============================
// PLACE ORDER
// ===============================

app.post("/api/order", async (req, res) => {
  try {
    // Check login session
    if (!req.session.user) {
      return res.status(401).json({
        message: "Please login first",
      });
    }

    const { items, phone, address, paymentMethod, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    const orderItems = items.map((item) => ({
      productId: item._id,
      pname: item.pname,
      rate: Number(item.rate),
      quantity: Number(item.quantity),
      photo: item.photo,
    }));

    const order = new Order({
      userId: req.session.user.id,

      items: orderItems,

      phone: phone,

      address: address,

      paymentMethod: paymentMethod,

      totalAmount: Number(totalAmount),

      status: "Pending",
    });

    await order.save();

    res.status(201).json({
      message: "Order placed successfully",
      order: order,
    });
  } catch (error) {
    console.log("Order Error:", error);

    res.status(500).json({
      message: "Unable to place order",
    });
  }
});
// ==========================================
// GET ALL ORDERS - ADMIN
// ==========================================

app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.log("Fetch Orders Error:", error);

    res.status(500).json({
      message: "Unable to fetch orders",
      error: error.message,
    });
  }
});
// ==========================================
// GET MY ORDERS - LOGGED IN USER
// ==========================================

app.get("/api/my-orders", async (req, res) => {
  try {
    // Check login session
    if (!req.session.user) {
      return res.status(401).json({
        message: "Please login first",
      });
    }

    // Logged in user ki ID
    const userId = req.session.user.id;

    // Sirf current user ke orders
    const orders = await Order.find({
      userId: userId,
    }).sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.log("My Orders Error:", error);

    res.status(500).json({
      message: "Unable to fetch your orders",
    });
  }
});
// ===============================
// SERVER
// ===============================

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
