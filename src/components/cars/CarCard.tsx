import React from 'react';
import { Link } from 'react-router-dom';
import type { Car } from '@/services/carService';
import { formatPrice, getDisplayName } from '@/utils/helpers';
import { normalizeImages } from '@/utils/images';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/context/FavoritesContext';
import { adminService } from '@/services/adminService';

interface CarCardProps {
  car: Car;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  const showFavorite = !user || car.userId !== user.id;
  const isMine = !!user && car.userId === user.id;
  const flagged = adminService.getFlagForUser(car.userId);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group relative z-10">
      <div className="relative overflow-hidden h-48">
        <img
          src={(normalizeImages((car as any).images)[0]) || '/images/cars/default-car.svg'}
          alt={car.title}
          className="w-full h-48 object-cover"
        />
        {/* Banner que cruza la imagen si el usuario está señalado */}
        {flagged && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Banner centrado que cruza la imagen, limitado para evitar overflow */}
            <div className="absolute left-[-10%] top-6 w-[120%] -rotate-12 text-center bg-yellow-600 text-white font-bold text-sm py-2 shadow-lg opacity-95 mx-auto">
              <span className="inline-block px-4 truncate max-w-full" title={flagged.reason || 'Usuario señalado'}>
                {flagged.reason ? flagged.reason : 'Usuario señalado'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Badges posicionados fuera de la imagen */}
      <div className="absolute top-3 left-3 z-20">
        {car.warranty && (
          <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
            Garantía
          </span>
        )}
        {flagged && (
          <div className="mt-2">
            <span title={flagged.reason} className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
              Señalado
            </span>
          </div>
        )}
      </div>
      <div className="absolute top-3 right-3 z-20">
        <div className="flex items-center space-x-2">
          {showFavorite && (
            <button
              type="button"
              onClick={() => toggleFavorite(car.id)}
              aria-label={isFavorite(car.id) ? 'Quitar favorito' : 'Agregar favorito'}
              className={`p-2 rounded-full text-sm transition-colors ${isFavorite(car.id) ? 'bg-red-500 text-white' : 'bg-white/80 dark:bg-gray-700 text-gray-800'}`}
            >
              {isFavorite(car.id) ? '❤️' : '🤍'}
            </button>
          )}
          {isMine && (
            <span className="px-3 py-1 rounded-full text-sm font-semibold shadow-lg bg-indigo-600 text-white">
              MIO
            </span>
          )}
          <span className={`px-3 py-1 rounded-full text-sm font-semibold shadow-lg ${
            car.approved
              ? 'bg-green-600 text-white'
              : 'bg-orange-600 text-white'
          }`}>
            {car.approved ? 'Aprobado' : 'Pendiente'}
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
            {car.title}
          </h3>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">
              {formatPrice(car.price)}
            </p>
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {car.location}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">Año:</span>
            <span className="ml-2 font-semibold text-gray-900 dark:text-white">{car.year}</span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Km:</span>
            <span className="ml-2 font-semibold text-gray-900 dark:text-white">{car.mileage.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Motor:</span>
            <span className="ml-2 font-semibold text-gray-900 dark:text-white">{car.engine}</span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Transmisión:</span>
            <span className="ml-2 font-semibold text-gray-900 dark:text-white capitalize">{car.transmission}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-2">
              <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                {getDisplayName(car).charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{getDisplayName(car)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(car.createdAt).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short'
                })}
              </p>
            </div>
          </div>
        </div>

        <Link
          to={`/car/${car.id}`}
          className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 text-center"
        >
          Ver Detalles
        </Link>
      </div>
    </div>
  );
};

export default CarCard;