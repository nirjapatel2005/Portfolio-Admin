import api from "./api.js";

export const homeService = {
  get: async () => {
    const res = await api.get("/api/home");
    return res.data;
  },
  update: async (data) => {
    const res = await api.put("/api/home", data);
    return res.data;
  },
};

