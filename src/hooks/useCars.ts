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
      const data = await carService.getAllCars() as Car[];
      setCars(data);
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