// src/api.js
import axios from "axios";
import { trackApiError } from "./analytics";

const baseURL =
  process.env.REACT_APP_API_URL || "http://localhost:6001/api/tenant";

const API = axios.create({ baseURL });

/** Public routes (signup, invite) share the same host as tenant API */
export const getPublicApiBase = () =>
  baseURL.replace(/\/api\/tenant\/?$/, "/api/public");

/** Origin for static assets (PDFs, logos) */
export const getApiOrigin = () =>
  baseURL.replace(/\/api\/tenant\/?$/, "");

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("tenant_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    trackApiError(error, { surface: "tenant_api" });
    if (error.response?.status === 401) {
      localStorage.removeItem("tenant_token");
      localStorage.removeItem("tenant_user");
      localStorage.removeItem("tenant_info");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default API;
