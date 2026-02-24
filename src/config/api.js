import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7023/api",
  withCredentials: true
});

// 🔁 Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh endpoint
        await api.post("/auth/refresh");

        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails → logout
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;