import api from "./api.js";

export const userService = {
  // Get all users
  getAll: async () => {
    const response = await api.get("/admin/users");
    return response.data;
  },

  // Get user by ID
  getById: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  // Create user
  create: async (userData) => {
    const response = await api.post("/admin/users", userData);
    return response.data;
  },

  // Update user
  update: async (id, userData) => {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  delete: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },
};

