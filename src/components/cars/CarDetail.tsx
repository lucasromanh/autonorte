import React from 'react';
import type { Car } from '@/services/carService';
import { formatPrice, formatDate } from '@/utils/helpers';
import Button from '@/components/ui/Button';
import { adminService } from '@/services/adminService';

interface CarDetailProps {
  car: Car;
  onMakeOffer?: () => void;
}

const CarDetail: React.FC<CarDetailProps> = ({ car, onMakeOffer }) => {
  const flagged = adminService.getFlagForUser(car.userId);
  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {flagged && (
        <div className="w-full bg-yellow-600 text-white p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <p className="font-bold">Advertencia: usuario señalado</p>
            {flagged.reason && <p className="text-sm opacity-90">Motivo: {flagged.reason}</p>}
          </div>
          <div className="text-sm opacity-90">
            Señalado: {new Date(flagged.at).toLocaleString()}
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{car.title}</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{car.description}</p>
          <div className="space-y-2 mb-6">
            <p><strong>Ubicación:</strong> {car.location}</p>
            <p><strong>Precio:</strong> {formatPrice(car.price)}</p>
            <p><strong>Publicado:</strong> {formatDate(car.createdAt)}</p>
          </div>
          {onMakeOffer && (
            <Button onClick={onMakeOffer} size="lg">
              Hacer Oferta
            </Button>
          )}
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {car.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${car.title} ${index + 1}`}
                className="w-full h-32 object-cover rounded-md"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;