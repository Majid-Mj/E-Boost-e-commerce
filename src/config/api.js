

import axios from "axios";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://eboost-api-ebcwbtapfpc8ced5.centralindia-01.azurewebsites.net/api",
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

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

      try {
        const refreshToken = localStorage.getItem("refreshToken") || sessionStorage.getItem("refreshToken");
        const res = await api.post("/auth/refresh", null, {
          headers: refreshToken ? { "X-Refresh-Token": refreshToken } : {}
        });

        const responseData = res.data?.data || res.data;
        const newToken = responseData?.accessToken;
        const newRefreshToken = responseData?.refreshToken;
        if (newToken) {
          sessionStorage.setItem("token", newToken);
          localStorage.setItem("token", newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        if (newRefreshToken) {
          sessionStorage.setItem("refreshToken", newRefreshToken);
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        return api(originalRequest);
      } catch (refreshError) {

        // For /auth/me failures, do NOT hard redirect — let AuthContext's catch block
        // handle it with the local JWT fallback. Only redirect to login for other
        // sensitive endpoints (e.g. cart, orders) where the session is truly gone.
        const isAuthMeRequest = originalRequest.url?.includes("/auth/me");
        if (!isAuthMeRequest) {
          sessionStorage.removeItem("token");
          localStorage.removeItem("token");
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;