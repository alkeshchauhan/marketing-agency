import React, { useEffect, useState } from "react";
import "../../styles/admin/Sidebar.css";

const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const Sidebar = ({ isOpen }) => {
  const [themeSettings, setThemeSettings] = useState({
    sidebarColor: "#343a40",
    sidebarTextColor: "#ffffff",
  });

  useEffect(() => {
    // Fetch settings when component mounts
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${apiBase}/api/settings`);
      const data = await response.json();
      if (data.theme) {
        setThemeSettings(data.theme);
      }
    } catch (error) {
      console.error("Failed to fetch theme settings:", error);
    }
  };

  const sidebarStyle = {
    backgroundColor: themeSettings.sidebarColor,
    color: themeSettings.sidebarTextColor,
  };

  const linkStyle = {
    color: themeSettings.sidebarTextColor,
  };

  return (
    <div
      className={`admin-sidebar ${isOpen ? "" : "collapsed"}`}
      style={sidebarStyle}
    >
      <nav className="sidebar-nav">
        <ul>
          <li>
            <a href="/admin/dashboard" className="nav-link" style={linkStyle}>
              <i className="fas fa-home"></i>
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a href="/admin/users" className="nav-link">
              <i className="fas fa-users"></i>
              <span>Users</span>
            </a>
          </li>
          <li>
            <a href="/admin/products" className="nav-link">
              <i className="fas fa-box"></i>
              <span>Products</span>
            </a>
          </li>
          <li>
            <a href="/admin/orders" className="nav-link">
              <i className="fas fa-shopping-cart"></i>
              <span>Orders</span>
            </a>
          </li>
          <li>
            <a href="/admin/reports" className="nav-link">
              <i className="fas fa-chart-bar"></i>
              <span>Reports</span>
            </a>
          </li>
          <li>
            <a href="/admin/settings" className="nav-link">
              <i className="fas fa-cog"></i>
              <span>Settings</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
