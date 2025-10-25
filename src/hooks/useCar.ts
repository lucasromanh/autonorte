import { useContext } from 'react';
import { CarContext } from '@/context/CarContext';

export const useCar = () => {
  const context = useContext(CarContext);
  if (!context) {
    throw new Error('useCar must be used within a CarProvider');
  }
  return context;
};