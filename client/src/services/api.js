import axios from 'axios';

const rawURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const baseURL = rawURL.endsWith('/api') ? rawURL : `${rawURL}/api`;

const API = axios.create({
  baseURL,
});

// Attach JWT token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
