import api from "./api.js";

export const testimonialService = {
  // Get all testimonials
  getAll: async () => {
    const response = await api.get("/api/testimonials");
    return response.data;
  },

  // Get testimonial by ID
  getById: async (id) => {
    const response = await api.get(`/api/testimonials/${id}`);
    return response.data;
  },

  // Create testimonial
  create: async (testimonialData) => {
    const response = await api.post("/api/testimonials", testimonialData);
    return response.data;
  },

  // Update testimonial
  update: async (id, testimonialData) => {
    const response = await api.put(`/api/testimonials/${id}`, testimonialData);
    return response.data;
  },

  // Delete testimonial
  delete: async (id) => {
    const response = await api.delete(`/api/testimonials/${id}`);
    return response.data;
  },
};



