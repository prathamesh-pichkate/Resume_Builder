import React, { useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import ResumeBuilder from "./pages/ResumeBuilder";
import Preview from "./pages/Preview";
import { useDispatch } from "react-redux";
import { login, setLoading } from "./app/features/authSlice";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Register from "./pages/Register";
import api from "./config/api";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const getUsersData = async () => {
    const token = localStorage.getItem("token");
    try {
      if (token) {
        const { data } = await api.get("/api/user/data", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.user) {
          dispatch(login({ token, user: data.user }));

          // Only navigate to /home if the user is currently at a route
          // where redirecting to home makes sense (root or auth pages).
          const safeToRedirect =
            location.pathname === "/" ||
            location.pathname === "/login" ||
            location.pathname === "/register" ||
            location.pathname === "";

          if (safeToRedirect) {
            navigate("/home");
          }
        }
        dispatch(setLoading(false));
      } else {
        dispatch(setLoading(false));
      }
    } catch (error) {
      dispatch(setLoading(false));
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    getUsersData();
    // we intentionally include location.pathname so redirect decision uses current url
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/home" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="builder/:resumeId" element={<ResumeBuilder />} />
        </Route>

        <Route path="view/:resumeId" element={<Preview />} />
      </Routes>
    </>
  );
};

export default App;
