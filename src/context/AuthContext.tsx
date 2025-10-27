import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '@/services/authService';

interface User {
  id: number;
  nombre?: string;
  username?: string;
  email: string;
  role?: 'USER' | 'ADMIN' | 'user' | 'admin';
  token?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (nombre: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: User) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } catch {
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await authService.login({ email, password });
      const saved = res.user || res;
      // Ensure token is present
      const token = res.token || (saved && saved.token) || saved.api_token;
  const toStore = { ...saved, token };
  const normalized = { ...toStore, username: (toStore as any).username || (toStore as any).nombre || (toStore as any).name };
  setUser(normalized);
  localStorage.setItem('user', JSON.stringify(normalized));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (nombre: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await authService.register({ nombre, email, password });
      const saved = res.user || res;
      const token = res.token || (saved && saved.token) || saved.api_token;
  const toStore = { ...saved, token };
  const normalized = { ...toStore, username: (toStore as any).username || (toStore as any).nombre || (toStore as any).name };
  setUser(normalized);
  localStorage.setItem('user', JSON.stringify(normalized));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    try {
      const raw = localStorage.getItem('user');
      const parsed = raw ? JSON.parse(raw) : {};
      const merged = { ...parsed, ...updatedUser };
      localStorage.setItem('user', JSON.stringify(merged));
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};