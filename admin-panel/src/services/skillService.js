import api from "./api.js";

export const skillService = {
  // Get all skills
  getAll: async () => {
    const response = await api.get("/api/skills");
    return response.data;
  },

  // Get skill by ID
  getById: async (id) => {
    const response = await api.get(`/api/skills/${id}`);
    return response.data;
  },

  // Create skill
  create: async (skillData) => {
    const response = await api.post("/api/skills", skillData);
    return response.data;
  },

  // Update skill
  update: async (id, skillData) => {
    const response = await api.put(`/api/skills/${id}`, skillData);
    return response.data;
  },

  // Delete skill
  delete: async (id) => {
    const response = await api.delete(`/api/skills/${id}`);
    return response.data;
  },
};



