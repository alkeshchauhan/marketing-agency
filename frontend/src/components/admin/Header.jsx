import React, { useEffect, useState } from "react";
import "../../styles/admin/Header.css";

const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const Header = ({ onToggleSidebar, onToggleDarkMode, isDarkMode }) => {
  const [themeSettings, setThemeSettings] = useState({
    headerColor: "#ffffff",
    headerTextColor: "#000000",
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

  const headerStyle = {
    backgroundColor: themeSettings.headerColor,
    color: themeSettings.headerTextColor,
  };

  return (
    <header className="admin-header" style={headerStyle}>
      <div className="header-left">
        <button
          className="menu-toggle"
          onClick={onToggleSidebar}
          style={{ color: themeSettings.headerTextColor }}
        >
          <i className="fas fa-bars"></i>
        </button>
        <h1>Admin Dashboard</h1>
      </div>
      <div className="header-right">
        <button className="theme-toggle" onClick={onToggleDarkMode}>
          <i className={`fas ${isDarkMode ? "fa-sun" : "fa-moon"}`}></i>
        </button>
        <div className="admin-profile">
          <span className="admin-name">Admin User</span>
          <button className="logout-btn">Logout</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
