import axios from 'axios';

// Normalize base URL safely: remove trailing slashes and collapse duplicate slashes
// but preserve the protocol part (https://)
const rawBase = import.meta.env.VITE_API_BASE_URL || '';
let normalizedBase = rawBase.replace(/\/+$|\s+/g, ''); // trim trailing slashes and whitespace
// Collapse repeated slashes except after the protocol (keep 'https://')
normalizedBase = normalizedBase.replace(/(^https?:\/\/)\/+/i, (m) => m); // preserve protocol slashes
normalizedBase = normalizedBase.replace(/([^:]\/)\/+/g, '$1');

const api = axios.create({
  baseURL: normalizedBase,
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
  // Normalize URL to avoid duplicated segments like /api/api when baseURL already includes /api
  try {
    const base = api.defaults.baseURL || '';
    if (config.url && typeof config.url === 'string') {
      // remove double /api if present: if base endsWith '/api' and url startsWith '/api'
      if (base.endsWith('/api') && config.url.startsWith('/api')) {
        config.url = config.url.replace(/^\/api/, '');
      }
      // collapse double slashes between base and url
      if (config.url.startsWith('//')) {
        config.url = config.url.replace(/^\/+/, '/');
      }
    }
  } catch {}
  return config;
});

export default api;