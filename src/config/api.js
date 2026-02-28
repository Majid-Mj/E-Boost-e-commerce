// import axios from "axios";

// const api = axios.create({
//   baseURL: "https://localhost:7023/api",
//   withCredentials: true
// });

// // THEN add interceptor
// api.interceptors.response.use(
//   response => response,
//   async error => {
//     const originalRequest = error.config;

//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry &&
//       !originalRequest.url.includes("/auth/refresh")
//     ) {
//       originalRequest._retry = true;
//       await api.post("/auth/refresh");
//       return api(originalRequest);
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;



import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7023/api",
  withCredentials: true
});

// 🔥 REQUEST INTERCEPTOR (ADD THIS)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔥 RESPONSE INTERCEPTOR (YOUR REFRESH LOGIC)
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh") &&
      !originalRequest.url.includes("/auth/me")
    ) {
      originalRequest._retry = true;

      try {
        const res = await api.post("/auth/refresh");

        const newToken = res.data?.accessToken;
        if (newToken) {
          localStorage.setItem("token", newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;