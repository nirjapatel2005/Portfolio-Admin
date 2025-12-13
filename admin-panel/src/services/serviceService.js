import api from "./api.js";

export const serviceService = {
  // Get all services
  getAll: async () => {
    const response = await api.get("/api/services");
    return response.data;
  },

  // Get service by ID
  getById: async (id) => {
    const response = await api.get(`/api/services/${id}`);
    return response.data;
  },

  // Create service
  create: async (serviceData) => {
    const response = await api.post("/api/services", serviceData);
    return response.data;
  },

  // Update service
  update: async (id, serviceData) => {
    const response = await api.put(`/api/services/${id}`, serviceData);
    return response.data;
  },

  // Delete service
  delete: async (id) => {
    const response = await api.delete(`/api/services/${id}`);
    return response.data;
  },
};



