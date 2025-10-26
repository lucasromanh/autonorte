import React, { useEffect, useState } from 'react';
import CarForm from '@/components/cars/CarForm';
import CarList from '@/components/cars/CarList';
import Button from '@/components/ui/Button';
import type { Car, CreateCarData } from '@/services/carService';
import { carService } from '@/services/carService';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/context/FavoritesContext';
import { messageService } from '@/services/messageService';

const MyCarsPage: React.FC = () => {
  const [myCars, setMyCars] = useState<Car[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [favoritesList, setFavoritesList] = useState<Car[]>([]);
  const [messagedCars, setMessagedCars] = useState<Car[]>([]);

  const { user } = useAuth();
  const { favorites } = useFavorites();

  useEffect(() => {
    loadCars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, favorites]);

  // TODO: Load user's cars from API
  // For now, using empty array

  const handleCreateCar = async (data: CreateCarData) => {
    setLoading(true);
    try {
      await carService.createCar(data);
      setShowForm(false);
      // Refrescar lista después de crear
      await loadCars();
    } catch (error) {
      console.error('Error creating car:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCars = async () => {
    try {
      const all = (await carService.getAllCars()) as Car[];
      // Autos del usuario
      const mine = user ? all.filter(c => c.userId === user.id) : [];
      setMyCars(mine);

      // Favoritos
      const fav = all.filter(c => favorites.includes(c.id));
      setFavoritesList(fav);

      // Autos sobre los que el usuario envió mensajes
      const sent = user ? messageService.getSentMessages(user.id) : [];
      const messagedIds = sent.map(s => parseInt(String(s.carId)).valueOf()).filter(Boolean) as number[];
      const messaged = all.filter(c => messagedIds.includes(c.id));
      setMessagedCars(messaged);
    } catch (err) {
      console.error('Error loading cars:', err);
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
        <>
          <h2 className="text-xl font-semibold mb-4">Mis Publicaciones</h2>
          <CarList cars={myCars} loading={false} />

          <h2 className="text-xl font-semibold mt-8 mb-4">Favoritos</h2>
          <CarList cars={favoritesList} loading={false} />

          <h2 className="text-xl font-semibold mt-8 mb-4">Autos con los que interactué</h2>
          <CarList cars={messagedCars} loading={false} />
        </>
      )}
    </div>
  );
};

export default MyCarsPage;