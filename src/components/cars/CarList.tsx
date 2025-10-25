import React from 'react';
import type { Car } from '@/services/carService';
import CarCard from './CarCard';

interface CarListProps {
  cars: Car[];
  loading?: boolean;
}

const CarList: React.FC<CarListProps> = ({ cars, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (cars.length === 0) {
    return <p className="text-center text-gray-500">No se encontraron vehículos</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cars.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );
};

export default CarList;