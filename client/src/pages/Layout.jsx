// src/pages/Layout.jsx
import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";

const Layout = () => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <Loader />;
  }

  // If not logged in, redirect to /login (changes URL)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col ">
      <Navbar />
      <div className="flex-grow pt-20">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
