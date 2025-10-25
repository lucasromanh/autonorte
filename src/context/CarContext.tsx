import React, { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Car } from '@/services/carService';

interface CarContextType {
  selectedCar: Car | null;
  setSelectedCar: (car: Car | null) => void;
}

const CarContext = createContext<CarContextType | undefined>(undefined);

export { CarContext };

// export const useCar = () => {
//   const context = useContext(CarContext);
//   if (!context) {
//     throw new Error('useCar must be used within a CarProvider');
//   }
//   return context;
// };

interface CarProviderProps {
  children: ReactNode;
}

export const CarProvider: React.FC<CarProviderProps> = ({ children }) => {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  return (
    <CarContext.Provider value={{ selectedCar, setSelectedCar }}>
      {children}
    </CarContext.Provider>
  );
};