import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import type { Car } from '@/services/carService';
import { adminService } from '@/services/adminService';

const ApproveListings: React.FC = () => {
  const [pendingCars, setPendingCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingCars();
  }, []);

  const loadPendingCars = async () => {
    try {
      const cars = await adminService.getPendingCars() as Car[];
      setPendingCars(cars);
    } catch (error) {
      console.error('Error loading pending cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await adminService.approveCar(id);
      setPendingCars(pendingCars.filter(car => car.id !== id));
    } catch (error) {
      console.error('Error approving car:', error);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await adminService.rejectCar(id);
      setPendingCars(pendingCars.filter(car => car.id !== id));
    } catch (error) {
      console.error('Error rejecting car:', error);
    }
  };

  if (loading) return <Loader size="lg" />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Aprobar Publicaciones</h2>
      {pendingCars.length === 0 ? (
        <p className="text-center text-gray-500">No hay publicaciones pendientes</p>
      ) : (
        <div className="space-y-4">
          {pendingCars.map((car) => (
            <div key={car.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{car.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{car.description}</p>
                  <p className="text-sm text-gray-500">Usuario ID: {car.userId}</p>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => handleApprove(car.id)} variant="primary">
                    Aprobar
                  </Button>
                  <Button onClick={() => handleReject(car.id)} variant="danger">
                    Rechazar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApproveListings;