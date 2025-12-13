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
};

