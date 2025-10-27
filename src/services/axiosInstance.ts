import axios from "axios";
import { API_BASE_URL } from "@/services/apiPath";

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // true if backend use cookie session
});


// REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use(
  (config) => {
    // fetch token form localStorage (next improvement if use auth)
    const token = localStorage.getItem("access_token");
    const adminKey = localStorage.getItem("x-admin-key");

    // if have header also added
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (adminKey) {
      config.headers["X-Admin-Key"] = adminKey;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      console.error("Network error:", error.message);
      return Promise.reject(error);
    }

    // 401 Unauthorized → refresh token
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
          // no auth system will be skip and logout
          console.warn("No refresh token found — skipping refresh flow.");
          return Promise.reject(error);
        }

        // (plan) if some day have endpoint refresh
        const res = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const newToken = res.data?.access_token;
        if (newToken) {
          localStorage.setItem("access_token", newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
    }

    console.error(
      `API Error [${error.response.status}]:`,
      error.response.data?.message || error.message
    );

    return Promise.reject(error);
  }
);

export default axiosInstance;
