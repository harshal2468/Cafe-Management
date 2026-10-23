import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import "./AdminLayout.css";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div
      className={`admin-layout ${
        sidebarOpen ? "sidebar-is-open" : "sidebar-is-closed"
      }`}
    >
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
