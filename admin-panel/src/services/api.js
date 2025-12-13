import axios from "axios";

// Base URL for the backend API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect if we're already on the login page or if it's a login request
      const isLoginRequest = error.config?.url?.includes("/auth/login");
      const isOnLoginPage = window.location.pathname === "/login";
      
      // Check if token is expired
      const isExpired = error.response?.data?.expired === true;
      
      // Clear token if it exists (especially if expired)
      if (isExpired || error.response?.data?.error?.includes("expired")) {
        localStorage.removeItem("adminToken");
        console.log("Expired token cleared from localStorage");
      } else {
        localStorage.removeItem("adminToken");
      }
      
      // Only redirect if not already on login page and not a login request
      if (!isLoginRequest && !isOnLoginPage) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

