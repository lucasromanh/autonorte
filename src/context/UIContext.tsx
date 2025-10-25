import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface UIContextType {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export { UIContext };

// export const useUI = () => {
//   const context = useContext(UIContext);
//   if (!context) {
//     throw new Error('useUI must be used within a UIProvider');
//   }
//   return context;
// };

interface UIProviderProps {
  children: ReactNode;
}

export const UIProvider: React.FC<UIProviderProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <UIContext.Provider value={{
      isSidebarOpen,
      setIsSidebarOpen,
      showModal,
      setShowModal,
      theme,
      toggleTheme
    }}>
      {children}
    </UIContext.Provider>
  );
};