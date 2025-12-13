import api from "./api.js";

export const activityService = {
  // Get recent activities
  getRecent: async (limit = 10) => {
    const response = await api.get(`/api/activities?limit=${limit}`);
    return response.data;
  },
};

