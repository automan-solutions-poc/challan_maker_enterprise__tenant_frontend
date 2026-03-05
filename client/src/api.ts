import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.automan.solutions/api',
});

api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem('admin_token');
  const tenantToken = localStorage.getItem('tenant_token');
  const token = adminToken || tenantToken;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
