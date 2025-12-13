import api from "./api.js";

export const experienceService = {
  // Get all experiences
  getAll: async () => {
    const response = await api.get("/api/experience");
    return response.data;
  },

  // Get experience by ID
  getById: async (id) => {
    const response = await api.get(`/api/experience/${id}`);
    return response.data;
  },

  // Create experience
  create: async (experienceData) => {
    const response = await api.post("/api/experience", experienceData);
    return response.data;
  },

  // Update experience
  update: async (id, experienceData) => {
    const response = await api.put(`/api/experience/${id}`, experienceData);
    return response.data;
  },

  // Delete experience
  delete: async (id) => {
    const response = await api.delete(`/api/experience/${id}`);
    return response.data;
  },
};



