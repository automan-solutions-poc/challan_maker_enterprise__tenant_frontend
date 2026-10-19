// src/api.js
import axios from "axios";
import { trackApiError } from "./analytics";
import { setPostAuthRedirect } from "./utils/postAuthRedirect";

const baseURL =
  process.env.REACT_APP_API_URL || "http://localhost:6001/api/tenant";

const API = axios.create({ baseURL });

/** Public routes (signup, invite) share the same host as tenant API */
export const getPublicApiBase = () =>
  baseURL.replace(/\/api\/tenant\/?$/, "/api/public");

/** Origin for static assets (PDFs, logos) */
export const getApiOrigin = () =>
  baseURL.replace(/\/api\/tenant\/?$/, "");

/** Read-only support assistant (unauthenticated, lives outside /api/tenant) */
export const getSupportBotApiBase = () =>
  baseURL.replace(/\/api\/tenant\/?$/, "/api/support-bot");

/**
 * Support bot client. Uses a plain axios instance on purpose: the endpoint is
 * public, so we must not attach the tenant JWT or trigger the global 401
 * redirect/logout interceptor below.
 */
export const supportBot = {
  ask: (question, language) =>
    axios
      .post(
        `${getSupportBotApiBase()}/ask`,
        { question, language },
        { timeout: 30000 }
      )
      .then((res) => res.data),
  health: () =>
    axios.get(`${getSupportBotApiBase()}/health`, { timeout: 15000 }).then((res) => res.data),
  languages: () =>
    axios.get(`${getSupportBotApiBase()}/languages`, { timeout: 15000 }).then((res) => res.data),
};

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
        setPostAuthRedirect(window.location.pathname + window.location.search);
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default API;
