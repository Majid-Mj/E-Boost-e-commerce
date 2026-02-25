import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7023/api",
  withCredentials: true
});

// THEN add interceptor
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;
      await api.post("/auth/refresh");
      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default api;