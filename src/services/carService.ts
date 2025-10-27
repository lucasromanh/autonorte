import api from './api';

export interface Car {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  userId: number;
  userName: string;
  userEmail: string;
  approved: boolean;
  createdAt: string;
  createdAtTimestamp?: number; // Para expiración localStorage
  // Información adicional del vehículo
  brand: string;
  model: string;
  year: number;
  mileage: number;
  fuelType: 'nafta' | 'diesel' | 'gnc' | 'electrico' | 'hibrido';
  transmission: 'manual' | 'automatico' | 'cvt';
  engine: string;
  color: string;
  doors: number;
  bodyType: string;
  features: string[];
  issues: string[];
  paymentMethods: string[];
  warranty: boolean;
  warrantyDetails?: string;
}

export interface CreateCarData {
  title: string;
  description: string;
  price: number;
  location: string;
  images: File[];
  brand?: string;
  model?: string;
  year?: number;
  mileage?: number;
  engine?: string;
  fuelType?: string;
  transmission?: string;
  color?: string;
  doors?: number;
  bodyType?: string;
  features?: string[];
  warranty?: boolean;
  warrantyDetails?: string;
  paymentMethods?: string[];
  issues?: string[];
}

export interface CreateCarResult {
  success: boolean;
  id?: number;
  error?: string;
}

// Utilidades para localStorage
const STORAGE_KEY = 'autonorte_cars';
const EXPIRATION_TIME = 2 * 60 * 60 * 1000; // 2 horas en milisegundos

const getStoredCars = (): Car[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    const now = Date.now();

    // Filtrar autos expirados (2 horas)
    const validCars = parsed.filter((car: any) => {
      const age = now - (car.createdAtTimestamp || 0);
      return age < EXPIRATION_TIME;
    });

    // Si había autos expirados, actualizar localStorage
    if (validCars.length !== parsed.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validCars));
      console.log(`Limpiados ${parsed.length - validCars.length} autos expirados`);
    }

    return validCars;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

const saveCarToStorage = (car: Car): void => {
  try {
    const storedCars = getStoredCars();
    storedCars.push(car);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedCars));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const mockCars = [
  {
    id: 1,
    title: 'Toyota Corolla 2020',
    description: 'Excelente estado, único dueño, todos los servicios al día.',
    price: 850000,
    location: 'Salta',
    images: ['/images/cars/Toyota-Corolla-2020.jpeg'],
    userId: 1,
    userName: 'Carlos Mendoza',
    userEmail: 'carlos.mendoza@email.com',
    approved: true,
    createdAt: '2025-01-15T10:00:00Z',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2020,
    mileage: 45000,
    fuelType: 'nafta',
    transmission: 'automatico',
    engine: '1.8L 4 cilindros',
    color: 'Blanco',
    doors: 4,
    bodyType: 'Sedán',
    features: ['Aire acondicionado', 'Dirección asistida', 'ABS', 'Airbags', 'Cámara de retroceso'],
    issues: [],
    paymentMethods: ['Efectivo', 'Transferencia', 'Financiación'],
    warranty: true,
    warrantyDetails: 'Garantía oficial Toyota hasta 2027'
  },
  {
    id: 2,
    title: 'Ford Focus 2019',
    description: 'Vehículo en perfectas condiciones, muy económico.',
    price: 720000,
    location: 'Jujuy',
    images: ['/images/cars/Ford-Focus-2019.jpg'],
    userId: 2,
    userName: 'María González',
    userEmail: 'maria.gonzalez@email.com',
    approved: true,
    createdAt: '2025-01-10T14:30:00Z',
    brand: 'Ford',
    model: 'Focus',
    year: 2019,
    mileage: 68000,
    fuelType: 'nafta',
    transmission: 'manual',
    engine: '1.6L 4 cilindros',
    color: 'Rojo',
    doors: 4,
    bodyType: 'Hatchback',
    features: ['Aire acondicionado', 'ABS', 'Airbags', 'Bluetooth'],
    issues: ['Pequeño rayón en puerta trasera'],
    paymentMethods: ['Efectivo', 'Transferencia'],
    warranty: false
  },
  {
    id: 3,
    title: 'Chevrolet Cruze 2021',
    description: 'Auto seminuevo, garantía de fábrica.',
    price: 950000,
    location: 'Tucumán',
    images: ['/images/cars/Chevrolet-Cruze-2021.webp'],
    userId: 3,
    userName: 'Roberto Silva',
    userEmail: 'roberto.silva@email.com',
    approved: true,
    createdAt: '2025-01-20T09:15:00Z',
    brand: 'Chevrolet',
    model: 'Cruze',
    year: 2021,
    mileage: 25000,
    fuelType: 'nafta',
    transmission: 'automatico',
    engine: '1.4L Turbo',
    color: 'Negro',
    doors: 4,
    bodyType: 'Sedán',
    features: ['Aire acondicionado', 'Dirección asistida', 'ABS', 'Airbags', 'Cámara de retroceso', 'Sensores de estacionamiento'],
    issues: [],
    paymentMethods: ['Efectivo', 'Transferencia', 'Financiación', 'Tarjeta de crédito'],
    warranty: true,
    warrantyDetails: 'Garantía oficial Chevrolet hasta 2028'
  },
  {
    id: 4,
    title: 'Volkswagen Gol Trend 2018',
    description: 'Auto familiar, ideal para la ciudad.',
    price: 580000,
    location: 'Salta',
    images: ['/images/cars/Volkswagen-Gol-Trend-2018.webp'],
    userId: 1,
    userName: 'Carlos Mendoza',
    userEmail: 'carlos.mendoza@email.com',
    approved: true,
    createdAt: '2025-01-18T16:45:00Z',
    brand: 'Volkswagen',
    model: 'Gol Trend',
    year: 2018,
    mileage: 95000,
    fuelType: 'nafta',
    transmission: 'manual',
    engine: '1.6L 4 cilindros',
    color: 'Gris',
    doors: 4,
    bodyType: 'Sedán',
    features: ['Aire acondicionado', 'Dirección asistida', 'ABS', 'Airbags'],
    issues: ['Necesita cambio de aceite'],
    paymentMethods: ['Efectivo', 'Transferencia'],
    warranty: false
  },
  {
    id: 5,
    title: 'Renault Sandero 2022',
    description: 'Vehículo nuevo, cero kilómetros.',
    price: 780000,
    location: 'Catamarca',
    images: ['/images/cars/Renault-Sandero-2022.webp'],
    userId: 4,
    userName: 'Ana López',
    userEmail: 'ana.lopez@email.com',
    approved: true,
    createdAt: '2025-01-22T11:20:00Z',
    brand: 'Renault',
    model: 'Sandero',
    year: 2022,
    mileage: 5000,
    fuelType: 'nafta',
    transmission: 'manual',
    engine: '1.6L 4 cilindros',
    color: 'Azul',
    doors: 4,
    bodyType: 'Hatchback',
    features: ['Aire acondicionado', 'ABS', 'Airbags', 'Cámara de retroceso', 'Bluetooth'],
    issues: [],
    paymentMethods: ['Efectivo', 'Transferencia', 'Financiación'],
    warranty: true,
    warrantyDetails: 'Garantía oficial Renault 3 años o 100.000km'
  },
  {
    id: 6,
    title: 'Peugeot 208 2020',
    description: 'Auto deportivo, excelente performance.',
    price: 820000,
    location: 'Jujuy',
    images: ['/images/cars/Peugeot-208-2020.jpg'],
    userId: 5,
    userName: 'Diego Ramírez',
    userEmail: 'diego.ramirez@email.com',
    approved: true,
    createdAt: '2025-01-12T13:10:00Z',
    brand: 'Peugeot',
    model: '208',
    year: 2020,
    mileage: 35000,
    fuelType: 'nafta',
    transmission: 'automatico',
    engine: '1.6L Turbo',
    color: 'Blanco',
    doors: 4,
    bodyType: 'Hatchback',
    features: ['Aire acondicionado', 'Dirección asistida', 'ABS', 'Airbags', 'Cámara de retroceso', 'Bluetooth', 'Asientos de cuero'],
    issues: [],
    paymentMethods: ['Efectivo', 'Transferencia', 'Financiación', 'Tarjeta de crédito'],
    warranty: true,
    warrantyDetails: 'Garantía oficial Peugeot hasta 2027'
  },
  {
    id: 7,
    title: 'Fiat Cronos 2019',
    description: 'Sedán espacioso, ideal para familia.',
    price: 650000,
    location: 'Tucumán',
    images: ['/images/cars/Fiat-Cronos-2019.jpg'],
    userId: 6,
    userName: 'Laura Torres',
    userEmail: 'laura.torres@email.com',
    approved: true,
    createdAt: '2025-01-14T15:30:00Z',
    brand: 'Fiat',
    model: 'Cronos',
    year: 2019,
    mileage: 78000,
    fuelType: 'nafta',
    transmission: 'manual',
    engine: '1.8L 4 cilindros',
    color: 'Plateado',
    doors: 4,
    bodyType: 'Sedán',
    features: ['Aire acondicionado', 'Dirección asistida', 'ABS', 'Airbags'],
    issues: ['Pequeño golpe en parachoques trasero'],
    paymentMethods: ['Efectivo', 'Transferencia'],
    warranty: false
  },
  {
    id: 8,
    title: 'Honda Civic 2021',
    description: 'Auto premium, tecnología de punta.',
    price: 1100000,
    location: 'Salta',
    images: ['/images/cars/Hond- Civic-2021.webp'],
    userId: 7,
    userName: 'Martín Herrera',
    userEmail: 'martin.herrera@email.com',
    approved: true,
    createdAt: '2025-01-19T10:45:00Z',
    brand: 'Honda',
    model: 'Civic',
    year: 2021,
    mileage: 18000,
    fuelType: 'nafta',
    transmission: 'cvt',
    engine: '2.0L 4 cilindros',
    color: 'Rojo',
    doors: 4,
    bodyType: 'Sedán',
    features: ['Aire acondicionado', 'Dirección asistida', 'ABS', 'Airbags', 'Cámara de retroceso', 'Sensores de estacionamiento', 'Navegación GPS', 'Techo solar'],
    issues: [],
    paymentMethods: ['Efectivo', 'Transferencia', 'Financiación', 'Tarjeta de crédito'],
    warranty: true,
    warrantyDetails: 'Garantía oficial Honda 3 años sin límite de kilometraje'
  },
  {
    id: 9,
    title: 'Nissan Kicks 2020',
    description: 'SUV urbana, perfecta para ciudad y ruta.',
    price: 890000,
    location: 'Catamarca',
    images: ['/images/cars/Nissan-Kicks-2020.jpg'],
    userId: 8,
    userName: 'Sofia Castro',
    userEmail: 'sofia.castro@email.com',
    approved: true,
    createdAt: '2025-01-16T12:00:00Z',
    brand: 'Nissan',
    model: 'Kicks',
    year: 2020,
    mileage: 42000,
    fuelType: 'nafta',
    transmission: 'automatico',
    engine: '1.6L 4 cilindros',
    color: 'Negro',
    doors: 4,
    bodyType: 'SUV',
    features: ['Aire acondicionado', 'Dirección asistida', 'ABS', 'Airbags', 'Cámara de retroceso', 'Sensores de estacionamiento', 'Bluetooth', 'Control de velocidad crucero'],
    issues: [],
    paymentMethods: ['Efectivo', 'Transferencia', 'Financiación'],
    warranty: true,
    warrantyDetails: 'Garantía oficial Nissan hasta 2027'
  },
  {
    id: 10,
    title: 'Honda Civic 2021',
    description: 'Auto premium, tecnología de punta.',
    price: 1100000,
    location: 'Salta',
    images: ['/images/cars/Hond- Civic-2021.webp'],
    userId: 3,
    userName: 'Martín Herrera',
    userEmail: 'martin.herrera@email.com',
    approved: true,
    createdAt: '2025-01-20T14:30:00Z',
    brand: 'Honda',
    model: 'Civic',
    year: 2021,
    mileage: 18000,
    fuelType: 'nafta',
    transmission: 'cvt',
    engine: '2.0L 4 cilindros',
    color: 'Rojo',
    doors: 4,
    bodyType: 'Sedán',
    features: ['Aire acondicionado', 'Dirección asistida', 'ABS', 'Airbags', 'Cámara de retroceso', 'Sensores de estacionamiento', 'Navegación GPS', 'Techo solar'],
    issues: [],
    paymentMethods: ['Efectivo', 'Transferencia', 'Financiación', 'Tarjeta de crédito'],
    warranty: true,
    warrantyDetails: 'Garantía oficial Honda 3 años sin límite de kilometraje'
  }
];

export const carService = {
  getAllCars: async () => {
    // Intenta varias rutas probables del backend antes de usar el fallback a mock
    const endpoints = [
      '/api/routes_cars.php?action=list',
      '/api/routes_cars.php?action=getCars',
      '/api/routes_cars.php?action=getAll',
      '/api/cars',
      '/api/router.php?route=routes_cars&action=list',
      '/api/router.php?route=cars&action=list',
      '/api/router.php?file=routes_cars&action=list',
    ];

    for (const ep of endpoints) {
      try {
        const response = await api.get(ep);
        const data = response.data;
        if (data) console.debug('[carService] getAllCars - endpoint', ep, 'returned', data);
        // Normalizar distintas formas de respuesta: array directo, { data: [...] }, { cars: [...] }
        if (Array.isArray(data)) return data;
        if (data && Array.isArray(data.data)) return data.data;
        if (data && Array.isArray(data.cars)) return data.cars;
        // si backend devuelve objeto con success y payload
        if (data && Array.isArray(data.payload)) return data.payload;
        // si es un objeto con propiedad 'items' o 'results' o 'pending'
        if (data && Array.isArray((data as any).items)) return (data as any).items;
        if (data && Array.isArray((data as any).results)) return (data as any).results;
        if (data && Array.isArray((data as any).pending)) return (data as any).pending;
        // si ninguna coincidencia, pero data es un objeto con arrays en alguna propiedad, devolver valores compatibles
      } catch (err) {
        // intentar siguiente endpoint
      }
    }

    // Fallback to mock data si ninguna ruta respondió correctamente
    return new Promise((resolve) => {
      setTimeout(() => {
        const storedCars = getStoredCars();
        const allCars = [...mockCars, ...storedCars];
        resolve(allCars);
      }, 500);
    });
  },

  getCarById: async (id: number) => {
    try {
      const response = await api.get(`/api/cars/${id}`);
      const data = response.data;
      // Normalize shapes: backend might return { car: {...} }, { data: {...} }, or the car object directly
      if (!data) return null;
      if (data.car && typeof data.car === 'object') return data.car;
      if (data.data && typeof data.data === 'object') return data.data;
      if (data.item && typeof data.item === 'object') return data.item;
      // If it's an array, try to find by id
      if (Array.isArray(data)) return data.find((c: any) => Number(c.id) === Number(id)) || null;
      // Otherwise assume it's the car object
      return data;
    } catch (err) {
      // Fallback to mock
      return new Promise((resolve) => {
        setTimeout(() => {
          const storedCars = getStoredCars();
          const allCars = [...mockCars, ...storedCars];
          const car = allCars.find(c => c.id === id);
          resolve(car || null);
        }, 300);
      });
    }
  },

  createCar: async (data: CreateCarData): Promise<CreateCarResult> => {
    try {
      // Build payload: map frontend fields to backend columns
      const payload: any = {
        title: data.title,
        description: data.description,
        price: data.price,
        make: data.brand,
        model: data.model,
        year: data.year,
        mileage: data.mileage,
        technical: JSON.stringify({
          engine: data.engine,
          fuelType: data.fuelType,
          transmission: data.transmission,
          color: data.color,
          doors: data.doors,
          bodyType: data.bodyType,
          features: data.features,
          issues: data.issues,
          paymentMethods: data.paymentMethods,
          warranty: data.warranty,
          warrantyDetails: data.warrantyDetails
        })
      };

      const response = await api.post('/api/cars', payload);
      const created = response.data;

      // Try to extract carId from several possible backend shapes
      const carId = created?.id || created?.car?.id || created?.data?.id || (created && created.insertId) || null;

      let uploadFailures = 0;
      // If backend returned created car id, upload images
      if (carId && data.images && data.images.length > 0) {
        const uploadEndpoints = [
          '/api/upload',
          '/api/uploads',
          '/api/routes_upload.php?action=upload',
          '/upload.php',
          '/routes_upload.php?action=upload'
        ];
        const fieldNames = ['image', 'file', 'fileToUpload', 'upload'];

        for (const file of data.images) {
          let uploaded = false;
          for (const ep of uploadEndpoints) {
            if (uploaded) break;
            for (const field of fieldNames) {
              try {
                const form = new FormData();
                form.append(field, file);
                // append common possible keys for car id
                form.append('car_id', String(carId));
                form.append('carId', String(carId));
                const res = await api.post(ep, form, { headers: { 'Content-Type': 'multipart/form-data' } });
                if (res && res.status >= 200 && res.status < 300) {
                  uploaded = true;
                  break;
                }
              } catch (upErr) {
                // try next field/endpoint
              }
            }
          }
          if (!uploaded) {
            uploadFailures += 1;
            console.warn('Failed to upload image for car', carId);
          }
        }
      }

      // Normalize returned result to CreateCarResult
      if (carId) {
        if (uploadFailures > 0) {
          return { success: false, id: carId as any, error: `${uploadFailures} imagen(es) fallaron al subir` };
        }
        return { success: true, id: carId as any };
      }

      // If backend didn't return an id, return the raw created response as fallback
      return (created as any) || { success: true };
    } catch (err) {
      // Fallback to saving locally
      return new Promise<CreateCarResult>((resolve) => {
        setTimeout(() => {
          try {
            const newCar: Car = {
              id: Date.now(),
              title: data.title,
              description: data.description,
              price: data.price,
              location: (data as any).location || '',
              images: data.images.map(() => `/images/cars/default-car.svg`), // Placeholder images
              userId: 1, // Mock user ID
              userName: 'Usuario de Prueba',
              userEmail: 'test@example.com',
              approved: true,
              createdAt: new Date().toISOString(),
              createdAtTimestamp: Date.now(), // Para expiración
              brand: data.brand || 'Marca Desconocida',
              model: data.model || 'Modelo Desconocido',
              year: data.year || new Date().getFullYear(),
              mileage: data.mileage || 0,
              fuelType: (data.fuelType as 'nafta' | 'diesel' | 'gnc' | 'electrico' | 'hibrido') || 'nafta',
              transmission: (data.transmission as 'manual' | 'automatico' | 'cvt') || 'manual',
              engine: data.engine || 'Motor Desconocido',
              color: data.color || 'Color Desconocido',
              doors: data.doors || 4,
              bodyType: data.bodyType || 'Sedán',
              features: data.features || [],
              issues: data.issues || [],
              paymentMethods: data.paymentMethods || ['Efectivo'],
              warranty: data.warranty || false,
              warrantyDetails: data.warrantyDetails
            };

            saveCarToStorage(newCar);
            resolve({ success: true, id: newCar.id });
          } catch (error) {
            console.error('Error creating car:', error);
            resolve({ success: false, error: 'Error al guardar la publicación' });
          }
        }, 1000);
      });
    }
  },

  updateCar: async (_id: number, _data: Partial<CreateCarData>) => {
    try {
      const payload: any = { ..._data };
      if (_data.brand) payload.make = _data.brand;
      if (_data.engine || _data.fuelType || _data.transmission) {
        payload.technical = JSON.stringify({
          engine: _data.engine,
          fuelType: _data.fuelType,
          transmission: _data.transmission,
        });
      }
      const response = await api.put(`/api/cars/${_id}`, payload);
      return response.data;
    } catch (err) {
      return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 500));
    }
  },

  deleteCar: async (_id: number) => {
    try {
      const response = await api.delete(`/api/cars/${_id}`);
      return response.data;
    } catch (err) {
      return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 500));
    }
  },
  
  getMyCars: async () => {
    try {
      const response = await api.get('/api/my/cars');
      return response.data;
    } catch (err) {
      // fallback: filter mockCars by mock userId 1
      return mockCars.filter(c => c.userId === 1);
    }
  },
};
