import React, { useState } from 'react';
import CarForm from '@/components/cars/CarForm';
import CarList from '@/components/cars/CarList';
import Button from '@/components/ui/Button';
import type { Car, CreateCarData } from '@/services/carService';
import { carService } from '@/services/carService';

const MyCarsPage: React.FC = () => {
  const [myCars] = useState<Car[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // TODO: Load user's cars from API
  // For now, using empty array

  const handleCreateCar = async (data: CreateCarData) => {
    setLoading(true);
    try {
      await carService.createCar(data);
      setShowForm(false);
      // TODO: Refresh car list
    } catch (error) {
      console.error('Error creating car:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mis Vehículos</h1>
        <Button onClick={() => setShowForm(prev => !prev)}>
          {showForm ? 'Cancelar' : 'Publicar Nuevo Vehículo'}
        </Button>
      </div>

      {/* Mostrar el formulario inline dentro del área principal en lugar de abrir un modal */}
      {showForm ? (
        <div className="mainflex mb-8">
          <CarForm onSubmit={handleCreateCar} loading={loading} />
        </div>
      ) : (
        <CarList cars={myCars} loading={false} />
      )}
    </div>
  );
};

export default MyCarsPage;