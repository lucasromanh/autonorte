// import api from './api'; // TODO: Uncomment when backend is ready

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface UpdateProfileData {
  username?: string;
  email?: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  user?: {
    id: number;
    username: string;
    email: string;
    role: 'user' | 'admin';
  };
}

export interface LoginResponse {
  success: boolean;
  user?: {
    id: number;
    username: string;
    email: string;
    role: 'user' | 'admin';
  };
}

export interface RegisterResponse {
  success: boolean;
  user?: {
    id: number;
    username: string;
    email: string;
    role: 'user' | 'admin';
  };
}

export const authService = {
  login: async (data: LoginData): Promise<LoginResponse> => {
    // TODO: Uncomment when backend is ready
    // const response = await api.post('/auth.php', { action: 'login', ...data });
    // return response.data;

    // Mock response for development
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (data.email === 'admin@admin.com' && data.password === 'admin') {
          resolve({
            success: true,
            user: {
              id: 1,
              username: 'admin',
              email: 'admin@admin.com',
              role: 'admin'
            }
          });
        } else if (data.email === 'user@user.com' && data.password === 'user') {
          resolve({
            success: true,
            user: {
              id: 2,
              username: 'user',
              email: 'user@user.com',
              role: 'user'
            }
          });
        } else {
          reject(new Error('Credenciales inválidas'));
        }
      }, 1000);
    });
  },

  register: async (data: RegisterData): Promise<RegisterResponse> => {
    // TODO: Uncomment when backend is ready
    // const response = await api.post('/auth.php', { action: 'register', ...data });
    // return response.data;

    // Mock response for development
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          user: {
            id: Date.now(),
            username: data.username,
            email: data.email,
            role: 'user'
          }
        });
      }, 1000);
    });
  },

  logout: async () => {
    // TODO: Uncomment when backend is ready
    // const response = await api.post('/auth.php', { action: 'logout' });
    // return response.data;

    // Mock response for development
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 300);
    });
  },

  updateProfile: async (userId: number, data: UpdateProfileData): Promise<UpdateProfileResponse> => {
    // TODO: Uncomment when backend is ready
    // const response = await api.put(`/users/${userId}`, data);
    // return response.data;

    // Mock response for development
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          user: {
            id: userId,
            username: data.username || 'user',
            email: data.email || 'user@user.com',
            role: 'user'
          }
        });
      }, 1000);
    });
  },
};