import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,

  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const savedAuth = localStorage.getItem("busflow_auth");

    if (savedAuth) {
      try {
        const authState = JSON.parse(savedAuth);

        const token = authState?.token;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Failed to read authentication data:", error);
      }
    }

    return config;
  },

  (error) => Promise.reject(error),
);

export default api;
