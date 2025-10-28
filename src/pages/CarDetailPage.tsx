import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { carService, type Car } from '@/services/carService';
import { messageService } from '@/services/messageService';
import { adminService } from '@/services/adminService';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { formatPrice, getDisplayName } from '@/utils/helpers';
import ReviewsPanel from '@/components/cars/ReviewsPanel';

const CarDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [appealMessage, setAppealMessage] = useState('');
  const [appealLoading, setAppealLoading] = useState(false);
  const [showAppealForm, setShowAppealForm] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const carData = await carService.getCarById(parseInt(id)) as Car | null;
        if (carData) {
          setCar(carData);
        } else {
          navigate('/explore');
        }
      } catch (err) {
        setError('Error al cargar el vehículo');
        console.error('Error fetching car:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id, navigate]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !car) return;

    setIsLoading(true);
    try {
      await messageService.sendMessage(user.id, {
        toUserId: car.userId,
        carId: car.id.toString(),
        subject: `Interés en ${car.title}`,
        content: message,
      });
      alert('Mensaje enviado exitosamente');
      setMessage('');
      setShowMessageForm(false);
    } catch (error) {
      alert('Error al enviar el mensaje');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Cargando detalles del vehículo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md p-4 mb-4">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
          <Button onClick={() => navigate('/explore')}>
            Volver a explorar
          </Button>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Vehículo no encontrado</p>
          <Button onClick={() => navigate('/explore')} className="mt-4">
            Volver a explorar
          </Button>
        </div>
      </div>
    );
  }
  const flagged = adminService.getFlagForUser(car.userId);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header con navegación */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/explore')}
            className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a explorar
          </button>
        </div>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {flagged && (
            <div className="col-span-1 lg:col-span-2 mb-4">
              <div className="w-full bg-yellow-600 text-white p-4 rounded-md flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <p className="font-bold">Advertencia: tu publicación fue señalada</p>
                  {flagged.reason && <p className="text-sm opacity-90">Motivo: {flagged.reason}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm opacity-90">Señalado: {new Date(flagged.at).toLocaleString()}</p>
                  {user && user.id === car.userId && (
                    <Button onClick={() => setShowAppealForm(prev => !prev)} variant="secondary">{showAppealForm ? 'Cerrar' : 'Apelar'}</Button>
                  )}
                </div>
              </div>
              {showAppealForm && user && user.id === car.userId && (
                <div className="mt-3 bg-white dark:bg-gray-800 p-4 rounded-md">
                  <p className="text-sm mb-2">Escribe tu apelación al administrador. Se enviará como mensaje privado y será registrado.</p>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    if (!user) return;
                    setAppealLoading(true);
                    try {
                      await messageService.sendMessage(user.id, {
                        toUserId: 1, // admin
                        carId: car.id.toString(),
                        subject: `Apelación por señalización - ${car.title}`,
                        content: appealMessage || 'Solicito revisión de la señalización.'
                      });
                      setAppealMessage('');
                      setShowAppealForm(false);
                      alert('Apelación enviada al administrador.');
                    } catch (err) {
                      console.error('Error sending appeal:', err);
                      alert('Error al enviar la apelación. Intenta nuevamente.');
                    } finally {
                      setAppealLoading(false);
                    }
                  }}>
                    <Input value={appealMessage} onChange={(e) => setAppealMessage((e.target as HTMLInputElement).value)} placeholder="Describe por qué crees que la señalización es incorrecta..." />
                    <div className="flex gap-2 mt-2">
                      <Button type="submit" disabled={appealLoading}>{appealLoading ? 'Enviando...' : 'Enviar Apelación'}</Button>
                      <Button type="button" variant="secondary" onClick={() => setShowAppealForm(false)}>Cancelar</Button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
          {/* Galería de imágenes */}
          <div className="space-y-4">
            <div className="relative">
                {(() => {
                  // Normalizar imágenes: la API puede devolver string, array o un objeto
                  let images: string[] = [];
                  if (Array.isArray(car.images)) images = car.images;
                  else if (typeof car.images === 'string') images = [car.images];
                  else if (car.images && typeof car.images === 'object') {
                    // intentar extraer valores que sean strings
                    const vals = Object.values(car.images).filter((v) => typeof v === 'string');
                    images = Array.isArray(vals) ? (vals as string[]) : [];
                  }

                  const main = images[0] || '/images/cars/default-car.svg';
                  return (
                    <img
                      src={main}
                      alt={car.title}
                      className="w-full h-96 object-cover rounded-lg"
                    />
                  );
                })()}
              {car.warranty && (
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Con Garantía
                  </span>
                </div>
              )}
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  car.approved
                    ? 'bg-green-600 text-white'
                    : 'bg-orange-600 text-white'
                }`}>
                  {car.approved ? 'Aprobado' : 'Pendiente'}
                </span>
              </div>
            </div>

            {/* Miniaturas adicionales (placeholder) */}
            <div className="grid grid-cols-4 gap-2">
              {(() => {
                let images: string[] = [];
                if (Array.isArray(car.images)) images = car.images;
                else if (typeof car.images === 'string') images = [car.images];
                else if (car.images && typeof car.images === 'object') {
                  const vals = Object.values(car.images).filter((v) => typeof v === 'string');
                  images = Array.isArray(vals) ? (vals as string[]) : [];
                }
                return images.slice(1, 5).map((image: string, index: number) => (
                  <img
                    key={index}
                    src={image || '/images/cars/default-car.svg'}
                    alt={`${car.title} ${index + 2}`}
                    className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                  />
                ));
              })()}
            </div>
          </div>

          {/* Información del vehículo */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {car.title}
              </h1>
              <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {car.location}
              </div>
              <div className="text-4xl font-bold text-blue-600 mb-4">
                {formatPrice(car.price)}
              </div>
            </div>

            {/* Información del vendedor */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Información del Vendedor
              </h3>
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold text-lg">
                    {getDisplayName(car).charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{getDisplayName(car)}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Miembro desde {new Date(car.createdAt).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
              {!showMessageForm ? (
                <Button
                  onClick={() => setShowMessageForm(true)}
                  className="w-full"
                  variant="secondary"
                >
                  Contactar Vendedor
                </Button>
              ) : (
                <form onSubmit={handleSendMessage} className="space-y-3">
                  <Input
                    type="text"
                    placeholder="Escribe tu mensaje..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? 'Enviando...' : 'Enviar Mensaje'}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setShowMessageForm(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* Especificaciones técnicas */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Especificaciones Técnicas
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Marca:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">{car.brand}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Modelo:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">{car.model}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Año:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">{car.year}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Kilometraje:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">{car.mileage.toLocaleString()} km</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Motor:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">{car.engine}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Combustible:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white capitalize">{car.fuelType}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Transmisión:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white capitalize">{car.transmission}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Color:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">{car.color}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Puertas:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">{car.doors}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Carrocería:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">{car.bodyType}</span>
                </div>
              </div>
            </div>

            {/* Características */}
            {car.features && car.features.length > 0 && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Características
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {car.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center">
                      <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Problemas conocidos */}
            {car.issues && car.issues.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-4">
                  Información Importante
                </h3>
                <div className="space-y-2">
                  {car.issues.map((issue: string, index: number) => (
                    <div key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-red-700 dark:text-red-300">{issue}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Garantía */}
            {car.warranty && (
              <div className="bg-green-50 dark:bg-green-900 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
                  Garantía
                </h3>
                <p className="text-green-700 dark:text-green-300">
                  {car.warrantyDetails || 'Este vehículo cuenta con garantía oficial.'}
                </p>
              </div>
            )}

            {/* Formas de pago */}
            {car.paymentMethods && car.paymentMethods.length > 0 && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Formas de Pago Aceptadas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {car.paymentMethods.map((method: string, index: number) => (
                    <span
                      key={index}
                      className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <ReviewsPanel carId={car.id} />
          </div>
        </div>

        {/* Descripción completa */}
        <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Descripción
          </h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {car.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CarDetailPage;