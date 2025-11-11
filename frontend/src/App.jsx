import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login.jsx";
import Product from "./components/Product.jsx";
import UsersDetails from "./components/UsersDetails.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/index.css";
import "./styles/App.css";
import Register from "./components/Register.jsx";
import AdminLayout from "./components/admin/AdminLayout.jsx";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  // Support token stored in localStorage (remember) or sessionStorage (temporary)
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  const userStr =
    localStorage.getItem("user") || sessionStorage.getItem("user") || "{}";
  let user = {};
  try {
    user = JSON.parse(userStr);
  } catch (e) {
    user = {};
  }

  if (!token || user.role !== "admin") {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Routes>
                  <Route path="users" element={<UsersDetails />} />
                  <Route path="products" element={<Product />} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
