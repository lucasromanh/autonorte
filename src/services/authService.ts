import api from './api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  nombre: string; // backend expects 'nombre'
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  success?: boolean;
  token?: string;
  api_token?: string;
  user?: any;
}

const normalizeToken = (data: any) => data?.token || data?.api_token || data?.apiToken || null;

export const authService = {
  login: async (payload: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/login', payload);
    const data = response.data || {};
    const token = normalizeToken(data) || normalizeToken(data.user) || data.token;

    // prefer user object if returned by backend, otherwise return response data
    const user = data.user || data;

    // Save merged user + token in localStorage so interceptor can read it
    try {
      const toStore = { ...user, token };
      localStorage.setItem('user', JSON.stringify(toStore));
    } catch {}

    return { ...data, token, user };
  },

  register: async (payload: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/register', payload);
    const data = response.data || {};
    const token = normalizeToken(data) || normalizeToken(data.user) || data.token;
    const user = data.user || data;

    try {
      const toStore = { ...user, token, phone: payload.phone || user.phone };
      localStorage.setItem('user', JSON.stringify(toStore));
    } catch {}

    return { ...data, token, user };
  },

  me: async (): Promise<any> => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  logout: async (): Promise<void> => {
    // If backend had a logout endpoint, call it here. For now just clear localStorage.
    try {
      localStorage.removeItem('user');
    } catch {}
  },

  updateProfile: async (userId: number, data: any) => {
    const response = await api.put(`/api/users/${userId}`, data);
    return response.data;
  }
};