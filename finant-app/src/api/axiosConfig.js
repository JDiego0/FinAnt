import axios from 'axios';
import { STORAGE_KEYS } from '../context/AuthContext';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;