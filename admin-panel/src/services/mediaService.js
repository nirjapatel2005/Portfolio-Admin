import api from "./api.js";

export const mediaService = {
  // Upload media file
  upload: async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    
    const response = await api.post("/api/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

