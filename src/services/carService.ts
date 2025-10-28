import api from './api';
import { normalizeImages } from '@/utils/images';

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
  fuelType: 'nafta' | 'diesel' | 'gnc' | 'electrico' | 'hibrido' | string;
  transmission: 'manual' | 'automatico' | 'cvt' | string;
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

// ================================
// 🗃️ UTILIDADES LOCALSTORAGE
// ================================

const STORAGE_KEY = 'autonorte_cars';
const EXPIRATION_TIME = 2 * 60 * 60 * 1000; // 2 horas

const getStoredCars = (): Car[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    const now = Date.now();

    const validCars = parsed.filter((car: any) => {
      const age = now - (car.createdAtTimestamp || 0);
      return age < EXPIRATION_TIME;
    });

    if (validCars.length !== parsed.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validCars));
      console.log(`🧹 Limpiados ${parsed.length - validCars.length} autos expirados`);
    }

    return validCars;
  } catch (error) {
    console.error('Error leyendo localStorage:', error);
    return [];
  }
};


// ================================
// 🔧 NORMALIZADOR DE DATOS
// ================================

function normalizeCarData(raw: any): Car {
  let technical: any = {};
  try {
    if (typeof raw.technical === 'string') {
      technical = JSON.parse(raw.technical);
    } else if (typeof raw.technical === 'object' && raw.technical !== null) {
      technical = raw.technical;
    }
  } catch {
    technical = {};
  }

  return {
    id: Number(raw.id),
    title: raw.title || '',
    description: raw.description || '',
    price: Number(raw.price || 0),
    location: raw.location || '',
    images: normalizeImages(raw.images || []),
    userId: Number(raw.userId || raw.user_id || 0),
    userName: raw.owner_name || raw.ownerName || raw.user_name || raw.username || 'Usuario',
    userEmail: raw.owner_email || raw.user_email || '',
    approved: Boolean(raw.approved ?? raw.is_approved ?? raw.status === 'APPROVED'),
    createdAt: raw.createdAt || raw.created_at || new Date().toISOString(),
    createdAtTimestamp: Date.now(),
    brand: raw.brand || raw.make || (technical?.brand ?? ''),
    model: raw.model || (technical?.model ?? ''),
    year: Number(raw.year || technical?.year || 0),
    mileage: Number(raw.mileage || technical?.mileage || 0),
    fuelType: raw.fuelType || technical?.fuelType || '',
    transmission: raw.transmission || technical?.transmission || '',
    engine: raw.engine || technical?.engine || '',
    color: raw.color || technical?.color || '',
    doors: Number(raw.doors || technical?.doors || 4),
    bodyType: raw.bodyType || technical?.bodyType || '',
    features: raw.features || technical?.features || [],
    issues: raw.issues || technical?.issues || [],
    paymentMethods: raw.paymentMethods || technical?.paymentMethods || [],
    warranty: Boolean(raw.warranty ?? technical?.warranty ?? false),
    warrantyDetails: raw.warrantyDetails || technical?.warrantyDetails || ''
  };
}

// ================================
// 🚗 SERVICIO PRINCIPAL
// ================================

export const carService = {
  // ==========================
  // 📜 OBTENER TODOS LOS AUTOS
  // ==========================
  getAllCars: async (): Promise<Car[]> => {
    const endpoints = [
      '/api/cars', 
      '/autonorte/api/cars'
    ];

    for (const ep of endpoints) {
      try {
        const response = await api.get(ep);
        const data = response.data;
        if (data) console.debug('[carService] getAllCars -', ep, data);

        if (data?.ok && Array.isArray(data.cars))
          return data.cars.map(normalizeCarData);
        if (Array.isArray(data)) return data.map(normalizeCarData);
        if (Array.isArray(data.data)) return data.data.map(normalizeCarData);
        if (Array.isArray(data.payload)) return data.payload.map(normalizeCarData);
        if (Array.isArray((data as any).items)) return (data as any).items.map(normalizeCarData);
      } catch (err) {
        console.warn(`[carService] ${ep} falló, probando siguiente...`);
      }
    }

    // fallback a localStorage
    const stored = getStoredCars();
    return stored.length ? stored : [];
  },

  // ==========================
  // 🔍 OBTENER AUTO POR ID
  // ==========================
  getCarById: async (id: number): Promise<Car | null> => {
    try {
      const response = await api.get(`/api/cars/${id}`);
      const data = response.data;
      if (!data) return null;

      if (data.car) return normalizeCarData(data.car);
      if (data.data) return normalizeCarData(data.data);
      if (Array.isArray(data)) {
        const car = data.find((c: any) => Number(c.id) === Number(id));
        return car ? normalizeCarData(car) : null;
      }
      return normalizeCarData(data);
    } catch (err) {
      console.error('[carService] getCarById error', err);
      const stored = getStoredCars();
      const car = stored.find((c) => c.id === id);
      return car ? normalizeCarData(car) : null;
    }
  },

  // ==========================
  // 🆕 CREAR PUBLICACIÓN
  // ==========================
  createCar: async (data: CreateCarData): Promise<CreateCarResult> => {
    try {
      const payload = {
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

      const carId =
        created?.car_id ||
        created?.id ||
        created?.car?.id ||
        created?.data?.id ||
        created?.insertId ||
        null;

      let uploadFailures = 0;

      if (carId && data.images && data.images.length > 0) {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const uploadUrl = '/api/upload';

        for (const file of data.images) {
          const formData = new FormData();
          formData.append('car_id', String(carId));
          formData.append('image', file);

          try {
            const res = await api.post(uploadUrl, formData, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
              }
            });
            if (res.status < 200 || res.status >= 300) {
              uploadFailures++;
              console.warn('[carService] subida fallida', res.status);
            } else {
              console.log(`[carService] imagen subida correctamente (${file.name})`);
            }
          } catch (e) {
            uploadFailures++;
            console.error('[carService] error subiendo imagen', e);
          }
        }
      }

      if (carId) {
        if (uploadFailures > 0)
          return { success: false, id: carId, error: `${uploadFailures} imagen(es) fallaron al subir` };
        return { success: true, id: carId };
      }

      return created || { success: true };
    } catch (err) {
      console.error('[carService] createCar error:', err);
      return { success: false, error: 'Error al crear publicación' };
    }
  },

  // ==========================
  // ✏️ ACTUALIZAR AUTO
  // ==========================
  updateCar: async (id: number, data: Partial<CreateCarData>) => {
    try {
      const payload: any = { ...data };
      if (data.brand) payload.make = data.brand;
      if (data.engine || data.fuelType || data.transmission) {
        payload.technical = JSON.stringify({
          engine: data.engine,
          fuelType: data.fuelType,
          transmission: data.transmission
        });
      }
      const response = await api.put(`/api/cars/${id}`, payload);
      return response.data;
    } catch (err) {
      console.error('[carService] updateCar error:', err);
      return { success: false };
    }
  },

  // ==========================
  // 🗑️ ELIMINAR AUTO
  // ==========================
  deleteCar: async (id: number) => {
    try {
      const response = await api.delete(`/api/cars/${id}`);
      return response.data;
    } catch (err) {
      console.error('[carService] deleteCar error:', err);
      return { success: false };
    }
  },

  // ==========================
  // 🚘 OBTENER MIS AUTOS
  // ==========================
  getMyCars: async (): Promise<Car[]> => {
    try {
      const response = await api.get('/api/my/cars');
      const data = response.data;
      if (Array.isArray(data)) return data.map(normalizeCarData);
      if (Array.isArray(data.cars)) return data.cars.map(normalizeCarData);
      if (Array.isArray(data.data)) return data.data.map(normalizeCarData);
      if (Array.isArray((data as any).items)) return (data as any).items.map(normalizeCarData);
      if (Array.isArray((data as any).payload)) return (data as any).payload.map(normalizeCarData);
      if (data && typeof data === 'object') return [normalizeCarData(data)];
      return [];
    } catch (err) {
      console.error('[carService] getMyCars error:', err);
      return [];
    }
  }
};
