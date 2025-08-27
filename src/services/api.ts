import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL as string;


const api = axios.create({
  baseURL,
});

// ✅ Attach token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["x-access-token"] = token;
  }
  return config;
});

// ✅ Simple error handling (optional refresh logic)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

export default api;