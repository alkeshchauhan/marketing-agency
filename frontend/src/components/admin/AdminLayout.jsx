import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "../../styles/admin/AdminLayout.css";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode");
  };

  return (
    <div
      className={`admin-layout ${darkMode ? "dark-mode" : ""} ${
        sidebarOpen ? "" : "sidebar-closed"
      }`}
    >
      <Sidebar isOpen={sidebarOpen} />
      <div className="admin-main">
        <Header
          onToggleSidebar={toggleSidebar}
          onToggleDarkMode={toggleDarkMode}
          isDarkMode={darkMode}
        />
        <div className="admin-content">
          <div className="content-wrapper">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
