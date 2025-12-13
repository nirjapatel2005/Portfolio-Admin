import api from "./api.js";

export const blogService = {
  // Get all blogs
  getAll: async () => {
    const response = await api.get("/api/blogs");
    return response.data;
  },

  // Get blog by ID
  getById: async (id) => {
    const response = await api.get(`/api/blogs/${id}`);
    return response.data;
  },

  // Create blog
  create: async (blogData) => {
    const response = await api.post("/api/blogs", blogData);
    return response.data;
  },

  // Update blog
  update: async (id, blogData) => {
    const response = await api.put(`/api/blogs/${id}`, blogData);
    return response.data;
  },

  // Delete blog
  delete: async (id) => {
    const response = await api.delete(`/api/blogs/${id}`);
    return response.data;
  },
};



