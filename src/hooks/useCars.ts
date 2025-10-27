import { useState, useEffect } from 'react';
import { carService } from '../services/carService';
import type { Car } from '../services/carService';

export const useCars = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const data = await carService.getAllCars();
      // Normalizar respuesta: asegurar que 'cars' sea un array
      let resolved: Car[] = [];
      if (Array.isArray(data)) resolved = data as Car[];
      else if (data && Array.isArray((data as any).cars)) resolved = (data as any).cars as Car[];
      else if (data && Array.isArray((data as any).data)) resolved = (data as any).data as Car[];
      else resolved = [];
      setCars(resolved);
      setError(null);
    } catch {
      setError('Error fetching cars');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return { cars, loading, error, refetch: fetchCars };
};