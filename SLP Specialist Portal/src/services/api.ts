import axios from "axios";
import { logger } from "../utils/logger";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    logger.error("API Error", { error: error.message, url: error.config?.url });
    return Promise.reject(error);
  }
);

export const libraryService = {
  uploadPdf: async (file: File) => {
    const formData = new FormData();
    formData.append("pdf", file);
    const response = await api.post("/library/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  search: async (query: string) => {
    const response = await api.get("/library/search", { params: { q: query } });
    return response.data;
  },
  getDocuments: async () => {
    const response = await api.get("/library/documents");
    return response.data;
  },
};
