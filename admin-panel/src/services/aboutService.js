import api from "./api.js";

export const aboutService = {
  // Get about data
  get: async () => {
    const response = await api.get("/api/about");
    return response.data;
  },

  // Update about data
  update: async (aboutData) => {
    const response = await api.put("/api/about", aboutData);
    return response.data;
  },
};



