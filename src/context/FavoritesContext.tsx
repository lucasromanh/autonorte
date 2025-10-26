import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface FavoritesContextType {
  favorites: number[];
  toggleFavorite: (carId: number) => void;
  isFavorite: (carId: number) => boolean;
  setFavorites: (ids: number[]) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
};

interface ProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<ProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavoritesState] = useState<number[]>([]);

  const storageKey = user ? `favorites:${user.id}` : 'favorites:guest';

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setFavoritesState(JSON.parse(raw));
      else setFavoritesState([]);
    } catch {
      setFavoritesState([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(favorites));
    } catch {}
  }, [favorites, storageKey]);

  const toggleFavorite = (carId: number) => {
    setFavoritesState(prev => prev.includes(carId) ? prev.filter(id => id !== carId) : [...prev, carId]);
  };

  const isFavorite = (carId: number) => favorites.includes(carId);

  const setFavorites = (ids: number[]) => setFavoritesState(ids);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, setFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};
