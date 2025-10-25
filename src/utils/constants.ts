export const API_BASE_URL = '/api';

export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

export const CAR_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export const LOCATIONS = [
  'Salta',
  'Jujuy',
  'Tucumán',
  'Catamarca',
  'Santiago del Estero',
] as const;

export const BRANDS = [
  'Toyota',
  'Ford',
  'Chevrolet',
  'Volkswagen',
  'Renault',
  'Fiat',
  'Peugeot',
  'Honda',
  'Nissan',
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Kia',
  'Hyundai',
  'Chery',
  'Geely',
] as const;