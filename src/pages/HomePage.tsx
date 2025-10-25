import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import CarCard from '@/components/cars/CarCard';
import { useCars } from '@/hooks/useCars';
import { useAuth } from '@/hooks/useAuth';

const HomePage: React.FC = () => {
  const { cars, loading, error } = useCars();
  const { user } = useAuth();

  if (loading) return <div className="text-center py-8">Cargando...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-12 md:py-24 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-6xl font-bold mb-6 animate-fade-in">
            Bienvenido a <span className="text-yellow-300">AutoNorte</span>
          </h1>
          <p className="text-lg md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            La plataforma líder para compra y venta de vehículos en el norte argentino.
            Encuentra el auto de tus sueños o vende el tuyo de manera segura y fácil.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/explore">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-6 py-3 text-base md:px-8 md:py-4 md:text-lg shadow-lg transform hover:scale-105 transition-all duration-200 w-full sm:w-auto">
                Explorar Vehículos
              </Button>
            </Link>
            {user ? (
              <Link to="/sell-car">
                <Button variant="secondary" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-6 py-3 text-base md:px-8 md:py-4 md:text-lg shadow-lg transform hover:scale-105 transition-all duration-200 w-full sm:w-auto">
                  Vender Mi Auto
                </Button>
              </Link>
            ) : (
              <Link to="/register">
                <Button variant="secondary" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-6 py-3 text-base md:px-8 md:py-4 md:text-lg shadow-lg transform hover:scale-105 transition-all duration-200 w-full sm:w-auto">
                  Vender Mi Auto
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-white dark:bg-gray-800 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center">
            <div className="p-4 md:p-6">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-sm md:text-base text-gray-600 dark:text-gray-300">Vehículos Disponibles</div>
            </div>
            <div className="p-4 md:p-6">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-sm md:text-base text-gray-600 dark:text-gray-300">Usuarios Activos</div>
            </div>
            <div className="p-4 md:p-6">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">4.8★</div>
              <div className="text-sm md:text-base text-gray-600 dark:text-gray-300">Calificación Promedio</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Vehículos Destacados
            </h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Descubre algunos de los mejores vehículos disponibles en nuestra plataforma
            </p>
          </div>

          {loading ? (
            <div className="text-center py-8 md:py-12">
              <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-sm md:text-base text-gray-600 dark:text-gray-300">Cargando vehículos...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 md:py-12">
              <div className="text-red-500 text-base md:text-lg">{error}</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {cars.slice(0, 6).map((car) => (
                <div key={car.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                  <CarCard car={car} />
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-8 md:mt-12">
            <Link to="/explore">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 md:px-8 md:py-4">
                Ver Todos los Vehículos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-blue-600 text-white px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            ¿Listo para encontrar tu próximo vehículo?
          </h2>
          <p className="text-lg md:text-xl mb-6 md:mb-8 text-blue-100">
            Únete a miles de usuarios que ya confían en AutoNorte
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-6 py-3 md:px-8 md:py-4 w-full sm:w-auto">
                Crear Cuenta Gratis
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-6 py-3 md:px-8 md:py-4 w-full sm:w-auto">
                Iniciar Sesión
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;