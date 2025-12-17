import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import DashboardLayout from "../layout/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";

import Dashboard from "../pages/Dashboard";
import About from "../pages/About";
import Users from "../pages/Users";
import Experience from "../pages/Experience";
import Skills from "../pages/Skills";
import Projects from "../pages/Projects";
import Blog from "../pages/Blog";
import Testimonial from "../pages/Testimonial";
import Services from "../pages/Services";
import Media from "../pages/Media";
import HomeSettings from "../pages/HomeSettings";
import Notifications from "../pages/Notifications";
import AccountSettings from "../pages/AccountSettings";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Default dashboard page */}
        <Route index element={<Dashboard />} />

        <Route path="about" element={<About />} />
        <Route path="users" element={<Users />} />
        <Route path="experience" element={<Experience />} />
        <Route path="skills" element={<Skills />} />
        <Route path="projects" element={<Projects />} />
        <Route path="blog" element={<Blog />} />
        <Route path="testimonial" element={<Testimonial />} />
        <Route path="services" element={<Services />} />
        <Route path="media" element={<Media />} />
        <Route path="home" element={<HomeSettings />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="account-settings" element={<AccountSettings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
