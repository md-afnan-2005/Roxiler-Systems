import React, { Component } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Login from "./auths/Login";
import Register from "./auths/Register";
import ProtectedRoute from "./components/ProtectedRoute";

import AdminDashboard from "./components/admin/AdminDashboard";
import AdminUsers from "./components/admin/AdminUsers";
import AdminStores from "./components/admin/AdminStores";
import StoresList from "./components/User/StoresList";
import OwnerDashboard from "./components/Owner/OwnerDashboard";

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <main className="container">
          <Routes>
            <Route path="/" element={<Navigate to="/stores" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/stores" element={<StoresList />} />

            <Route
              path="/admin/*"
              element={
                <ProtectedRoute role="admin">
                  <Routes>
                    <Route path="" element={<AdminDashboard />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="stores" element={<AdminStores />} />
                  </Routes>
                </ProtectedRoute>
              }
            />

            <Route
              path="/owner"
              element={
                <ProtectedRoute role="owner">
                  <OwnerDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<div>404 Page Not Found</div>} />
          </Routes>
        </main>
      </div>
    );
  }
}

export default App;
