import api from "./api.js";

export const projectService = {
  // Get all projects
  getAll: async () => {
    const response = await api.get("/api/projects");
    return response.data;
  },

  // Get project by ID
  getById: async (id) => {
    const response = await api.get(`/api/projects/${id}`);
    return response.data;
  },

  // Create project
  create: async (projectData) => {
    const response = await api.post("/api/projects", projectData);
    return response.data;
  },

  // Update project
  update: async (id, projectData) => {
    const response = await api.put(`/api/projects/${id}`, projectData);
    return response.data;
  },

  // Delete project
  delete: async (id) => {
    const response = await api.delete(`/api/projects/${id}`);
    return response.data;
  },
};



