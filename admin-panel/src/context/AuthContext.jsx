import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authServices";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("adminToken");
      if (token) {
        try {
          const response = await authService.getCurrentUser();
          setUser(response.user);
          setIsAuthenticated(true);
        } catch (error) {
          // Token is invalid or expired, clear it
          console.log("Token validation failed, clearing token:", error.response?.data?.error || error.message);
          localStorage.removeItem("adminToken");
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        // No token, ensure we're not authenticated
        setIsAuthenticated(false);
        setUser(null);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async ({ email, password }) => {
    try {
      // Clear any existing token before attempting login
      localStorage.removeItem("adminToken");
      
      const response = await authService.login(email, password);
      
      // Validate response structure
      if (!response || !response.token) {
        console.error("Login error: Invalid response structure", response);
        return false;
      }
      
      localStorage.setItem("adminToken", response.token);
      setUser(response.user);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
      });
      
      // Clear token on any login error
      localStorage.removeItem("adminToken");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
