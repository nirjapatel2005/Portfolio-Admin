import api from "./api.js";

export const contactService = {
  getAll: async () => {
    const res = await api.get("/api/contact");
    return res.data;
  },
  markRead: async (id) => {
    const res = await api.patch(`/api/contact/${id}/read`);
    return res.data;
  },
};

