import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cuentas hardcodeadas para testing
  const hardcodedUsers = [
    {
      id: 1,
      username: 'usuario',
      email: 'usuario@test.com',
      password: '123456',
      role: 'user' as const
    },
    {
      id: 2,
      username: 'admin',
      email: 'admin@test.com',
      password: 'admin123',
      role: 'admin' as const
    }
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));

    const foundUser = hardcodedUsers.find(user => user.email === email && user.password === password);

    if (foundUser) {
      const { password: _password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    } else {
      throw new Error('Credenciales incorrectas');
    }
  };

  const register = async (username: string, email: string, password: string) => {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verificar si el email ya existe
    const existingUser = hardcodedUsers.find(user => user.email === email);
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    // Verificar que la contraseña tenga al menos 6 caracteres
    if (password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    // Crear nuevo usuario
    const newUser = {
      id: Date.now(),
      username,
      email,
      role: 'user' as const
    };

    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};