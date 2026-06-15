import axios from 'axios';

const LOCAL_API_URL = 'http://localhost:4000/api';
const PRODUCTION_API_URL = '/api';
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? PRODUCTION_API_URL : LOCAL_API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vybe_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
