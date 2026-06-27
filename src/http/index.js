// src/http.js
import APIConfig from "@/config/setting";
import axios from "axios";
import router from "@/router/index.js";

const instance = axios.create(APIConfig);

// ── Requêtes : injecte le Bearer token ──────────────────────────────────────
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Réponses : refresh automatique sur 401 ──────────────────────────────────
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const is401          = error.response?.status === 401;
    const notRetried     = !originalRequest._retry;
    const notRefreshCall = !originalRequest.url?.includes("/auth/refresh");

    if (is401 && notRetried && notRefreshCall) {
      originalRequest._retry = true;

      const user    = JSON.parse(localStorage.getItem("user") || "null");
      const isAdmin = user?.role === "admin" || user?.is_admin === true;

      // ── Admin : token stateless, pas de refresh → on rejette sans logout
      if (isAdmin) {
        return Promise.reject(error);
      }

      const refresh = localStorage.getItem("refresh");

      // ── Citoyen sans refresh token → logout
      if (!refresh) {
        _clearAndRedirect();
        return Promise.reject(error);
      }

      // ── Citoyen avec refresh token → renouvellement
      try {
        const baseURL   = APIConfig.baseURL.replace(/\/$/, "");
        const { data }  = await axios.post(`${baseURL}/auth/refresh`, { refresh });
        const newAccess = data.access_token;

        localStorage.setItem("access", newAccess);
        originalRequest.headers               ??= {};
        originalRequest.headers.Authorization   = `Bearer ${newAccess}`;

        return instance(originalRequest);
      } catch {
        _clearAndRedirect();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

function _clearAndRedirect() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");
  router.push("/login");
}

export default instance;