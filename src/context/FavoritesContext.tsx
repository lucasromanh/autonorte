import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/services/api';

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
  // map carId -> favoriteId (backend id) to allow deletion
  const [favMap, setFavMap] = useState<Record<number, number>>({});

  const storageKey = user ? `favorites:${user.id}` : 'favorites:guest';

  useEffect(() => {
    const load = async () => {
      try {
        if (user) {
          // fetch favorites from backend
          const res = await api.get('/api/favorites');
          const list = Array.isArray(res.data) ? res.data : [];
          const ids = list.map((f: any) => f.car_id || f.carId || f.carId);
          setFavoritesState(ids);
          const map: Record<number, number> = {};
          list.forEach((f: any) => {
            const carId = f.car_id || f.carId || f.carId;
            if (carId) map[carId] = f.id;
          });
          setFavMap(map);
        } else {
          const raw = localStorage.getItem(storageKey);
          if (raw) setFavoritesState(JSON.parse(raw));
          else setFavoritesState([]);
        }
      } catch {
        setFavoritesState([]);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(favorites));
    } catch {}
  }, [favorites, storageKey]);

  const toggleFavorite = async (carId: number) => {
    if (!user) {
      // local toggle for guests
      setFavoritesState(prev => prev.includes(carId) ? prev.filter(id => id !== carId) : [...prev, carId]);
      return;
    }

    try {
      if (favorites.includes(carId)) {
        // remove from backend
        const favId = favMap[carId];
        if (favId) await api.delete(`/api/favorites/${favId}`);
        setFavoritesState(prev => prev.filter(id => id !== carId));
        setFavMap(prev => {
          const copy = { ...prev };
          delete copy[carId];
          return copy;
        });
      } else {
        const res = await api.post('/api/favorites', { car_id: carId });
        const created = res.data;
        // backend should return created favorite with id
        const favId = created?.id;
        setFavoritesState(prev => [...prev, carId]);
        if (favId) setFavMap(prev => ({ ...prev, [carId]: favId }));
      }
    } catch (err) {
      console.warn('Favorite toggle failed, falling back to local change', err);
      setFavoritesState(prev => prev.includes(carId) ? prev.filter(id => id !== carId) : [...prev, carId]);
    }
  };

  const isFavorite = (carId: number) => favorites.includes(carId);

  const setFavorites = (ids: number[]) => setFavoritesState(ids);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, setFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};
