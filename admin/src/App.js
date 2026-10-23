import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Login";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./components/Dashbord";
import AddCategory from "./components/AddCategory";
import ViewCategory from "./components/ViewCategory";
import AddProduct from "./components/AddProduct";
import ViewProduct from "./components/ViewProduct";
import EditCategory from "./components/EditCategory";
import ViewUsers from "./components/ViewUsers";
import ViewOrders from "./components/ViewOrders";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Login */}
        <Route path="/" element={<Login />} />

        {/* Admin Panel */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<Dashboard />} />

          {/* Category */}
          <Route path="category/add" element={<AddCategory />} />
          <Route path="category/view" element={<ViewCategory />} />

          {/* Product */}
          <Route path="product/add" element={<AddProduct />} />
          <Route path="product/view" element={<ViewProduct />} />

          <Route
            path="/admin/edit-category/:categoryid"
            element={<EditCategory />}
          />
          <Route path="users" element={<ViewUsers />} />
          <Route path="orders" element={<ViewOrders />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
