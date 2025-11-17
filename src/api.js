// src/api/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:6001/api/tenant", // tenant backend prefix
  // baseURL: "http://192.168.1.12:6001/api/tenant", // tenant backend prefix
});

// Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("tenant_token"); // ✅ Correct key
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
