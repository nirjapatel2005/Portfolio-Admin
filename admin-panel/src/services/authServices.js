import api from "./api.js";

export const authService = {
  // Login
  login: async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      return response.data;
    } catch (error) {
      // Re-throw with more context
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || "Login failed";
      const errorToThrow = new Error(errorMessage);
      errorToThrow.response = error.response;
      throw errorToThrow;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get("/admin/me");
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || "Failed to send reset email";
      const errorToThrow = new Error(errorMessage);
      errorToThrow.response = error.response;
      throw errorToThrow;
    }
  },

  // Reset password
  resetPassword: async (token, password) => {
    try {
      const response = await api.post("/auth/reset-password", { token, password });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || "Failed to reset password";
      const errorToThrow = new Error(errorMessage);
      errorToThrow.response = error.response;
      throw errorToThrow;
    }
  },

  // Update profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put("/admin/me", profileData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || "Failed to update profile";
      const errorToThrow = new Error(errorMessage);
      errorToThrow.response = error.response;
      throw errorToThrow;
    }
  },
};

