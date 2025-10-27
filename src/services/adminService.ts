import api from './api';

// Mock data for development
const mockPendingCars = [
  {
    id: 4,
    title: 'Honda Civic 2018',
    description: 'Buen estado, necesita algunos arreglos menores.',
    price: 650000,
    location: 'Salta',
    images: ['https://via.placeholder.com/400x300/4A90E2/FFFFFF?text=Auto'],
    userId: 4,
    approved: false,
    createdAt: '2025-01-25T08:00:00Z'
  }
];

const mockUsers = [
  { id: 1, username: 'admin', email: 'admin@admin.com', role: 'admin', created_at: '2025-01-01T00:00:00Z' },
  { id: 2, username: 'user', email: 'user@user.com', role: 'user', created_at: '2025-01-02T00:00:00Z' },
  { id: 3, username: 'juan', email: 'juan@example.com', role: 'user', created_at: '2025-01-03T00:00:00Z' },
];

import { carService } from './carService';

export const adminService = {
  getPendingCars: async () => {
    // Prioritize the most-likely working endpoints to avoid many 404s in console.
    const endpoints = [
      '/admin/cars/pending', // observed in your logs returning {ok:true, pending: [...]}
      '/admin/pending',
      '/admin/pending-cars',
      '/routes_admin.php?action=pending',
      '/router.php?file=routes_admin&action=pending',
    ];

    for (const ep of endpoints) {
      try {
        const res = await api.get(ep);
        const data = res.data;
        // Only log successful responses (reduce noise)
        if (data) console.debug('[adminService] getPendingCars - endpoint', ep, 'returned', data);
        // Normalize several possible shapes into an array of cars
        if (Array.isArray(data)) return data;
        if (data && Array.isArray(data.pending)) return data.pending;
        if (data && Array.isArray(data.data)) return data.data;
        if (data && Array.isArray(data.cars)) return data.cars;
        if (data && Array.isArray(data.items)) return data.items;
        if (data && Array.isArray(data.payload)) return data.payload;
      } catch (err) {
        // try next endpoint, avoid noisy logging here
      }
    }

    // Fallback to mock data
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockPendingCars), 500);
    });
  },

  approveCar: async (_id: number) => {
    try {
      // Backend router expects: POST /api/admin/cars/{id}/approve
      const res = await api.post(`/admin/cars/${_id}/approve`);
      return res.data;
    } catch (err) {
      console.error('[adminService] approveCar failed for', _id, err);
      // graceful fallback so UI doesn't break
      return { ok: false, error: 'APPROVE_FAILED' };
    }
  },

  rejectCar: async (_id: number) => {
    try {
      // Backend router expects: POST /api/admin/cars/{id}/reject
      const res = await api.post(`/admin/cars/${_id}/reject`);
      return res.data;
    } catch (err) {
      console.error('[adminService] rejectCar failed for', _id, err);
      return { ok: false, error: 'REJECT_FAILED' };
    }
  },

  getAllUsers: async () => {
    // Exact backend endpoints (router.php maps /api/* to these): prefer REST-style under /admin
    const endpoints = [
      '/admin/users',
      '/routes_admin.php?action=users',
      '/admin.php?action=users',
      '/router.php?route=routes_admin&action=users',
      '/router.php?route=admin&action=users',
    ];
    for (const ep of endpoints) {
      try {
        const res = await api.get(ep);
        const data = res.data;
        if (data) console.debug('[adminService] getAllUsers - endpoint', ep, 'returned', data);
        if (Array.isArray(data)) return data;
        if (data && Array.isArray(data.users)) return data.users;
        if (data && Array.isArray(data.data)) return data.data;
        if (data && Array.isArray(data.payload)) return data.payload;
      } catch (err) {
        // try next
      }
    }
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockUsers), 500);
    });
  },

  deleteUser: async (_id: number) => {
    try {
      const res = await api.delete(`/admin/users/${_id}`);
      return res.data;
    } catch (err) {
      // try a PHP-script variant
      try {
        const res2 = await api.get(`/routes_admin.php?action=deleteUser&id=${_id}`);
        return res2.data;
      } catch (err2) {
        return { ok: false, error: 'DELETE_FAILED' };
      }
    }
  },
  // Obtener todos los autos (delegar a carService)
  getAllCars: async () => {
    return carService.getAllCars();
  },

  deleteCar: async (_id: number) => {
    // Mock delete
    return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 300));
  },

  editCar: async (_id: number, _data: any) => {
    // Mock edit
    return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 300));
  },

  // Bloquear usuario (persistir en localStorage)
  blockUser: async (id: number) => {
    try {
      const res = await api.post(`/admin/users/${id}/block`);
      return res.data;
    } catch (err) {
      console.error('[adminService] blockUser failed', err);
      return { ok: false };
    }
  },

  flagUser: async (id: number, reason = '') => {
    try {
      const res = await api.post(`/admin/users/${id}/flag`, { reason });
      return res.data;
    } catch (err) {
      console.error('[adminService] flagUser failed', err);
      return { ok: false };
    }
  }
  ,

  unblockUser: async (id: number) => {
    try {
      const res = await api.post(`/admin/users/${id}/unblock`);
      return res.data;
    } catch (err) {
      console.error('[adminService] unblockUser failed', err);
      return { ok: false };
    }
  },

  unflagUser: async (id: number) => {
    try {
      const res = await api.post(`/admin/users/${id}/unflag`);
      return res.data;
    } catch (err) {
      console.error('[adminService] unflagUser failed', err);
      return { ok: false };
    }
  },

  // Devuelve todos los flags almacenados
  getFlags: () => {
    try {
      const raw = localStorage.getItem('flagged_users');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  // Devuelve el flag para un usuario específico (si existe)
  getFlagForUser: (id: number) => {
    try {
      const raw = localStorage.getItem('flagged_users');
      const list = raw ? JSON.parse(raw) : [];
      return list.find((f: any) => f.id === id) || null;
    } catch {
      return null;
    }
  }
  ,
};
