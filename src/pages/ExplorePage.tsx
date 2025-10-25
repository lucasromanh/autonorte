import React, { useState } from 'react';
import { useCars } from '@/hooks/useCars';
import CarList from '@/components/cars/CarList';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const ITEMS_PER_PAGE = 6;

const ExplorePage: React.FC = () => {
  const { cars, loading, error } = useCars();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCars = cars.filter(car => {
    const matchesSearch = car.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !locationFilter || car.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  // Paginación
  const totalPages = Math.ceil(filteredCars.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCars = filteredCars.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setLocationFilter('');
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8 pb-16">
      <h1 className="text-3xl font-bold mb-8">Explorar Vehículos</h1>

      <div className="mb-8 space-y-4 md:space-y-0 md:flex md:space-x-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Buscar por título o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Filtrar por ubicación..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          />
        </div>
        <Button onClick={clearFilters}>
          Limpiar Filtros
        </Button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-300">
          Mostrando {paginatedCars.length} de {filteredCars.length} vehículos
        </p>
      </div>

      <CarList cars={paginatedCars} loading={loading} />

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center space-x-2">
          <Button
            variant="secondary"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? 'primary' : 'secondary'}
              onClick={() => handlePageChange(page)}
              className="w-10 h-10 flex items-center justify-center"
            >
              {page}
            </Button>
          ))}

          <Button
            variant="secondary"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
};

export default ExplorePage;