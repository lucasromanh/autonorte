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
  // For now force dark theme so headings are visible and toggle does not cause inconsistent states
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Force dark mode class on document so tailwind dark: styles apply consistently
    document.documentElement.classList.add('dark');
    // Keep theme state in sync
    setTheme('dark');
  }, []);

  // Disable runtime theme toggling to avoid broken toggle behavior reported by the user
  const toggleTheme = () => {
    // no-op: theme switching disabled
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