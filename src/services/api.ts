import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '', // Configure your Hostinger domain in .env
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem('user');
    if (raw) {
      const parsed = JSON.parse(raw);
      // Support several token property names (token, api_token)
      const token = parsed?.token || parsed?.api_token || parsed?.apiToken || parsed?.auth?.token;
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    // ignore JSON parse errors
  }
  return config;
});

export default api;