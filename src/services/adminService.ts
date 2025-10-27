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

import { messageService } from './messageService';
import { carService } from './carService';

export const adminService = {
  getPendingCars: async () => {
    // Try backend endpoints first (several possible routes depending on backend)
    const endpoints = ['/api/admin.php?action=pending', '/api/admin/pending', '/api/admin/cars/pending', '/api/admin/pending-cars'];
    for (const ep of endpoints) {
      try {
        const res = await api.get(ep);
        const data = res.data;
        if (Array.isArray(data)) return data;
        if (data && Array.isArray(data.data)) return data.data;
        if (data && Array.isArray(data.cars)) return data.cars;
        if (data && Array.isArray(data.items)) return data.items;
      } catch (err) {
        // try next
      }
    }

    // Fallback to mock data
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockPendingCars), 500);
    });
  },

  approveCar: async (_id: number) => {
    const endpoints = [
      { method: 'put', url: `/api/admin.php?action=approve&id=${_id}` },
      { method: 'put', url: `/api/admin/approve/${_id}` },
      { method: 'post', url: `/api/admin/approve`, data: { id: _id } },
    ];
    for (const e of endpoints) {
      try {
        const res = e.method === 'put' ? await api.put(e.url) : await api.post((e as any).url, (e as any).data);
        return res.data;
      } catch (err) {
        // try next
      }
    }
    // Mock fallback
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 500);
    });
  },

  rejectCar: async (_id: number) => {
    const endpoints = [
      { method: 'put', url: `/api/admin.php?action=reject&id=${_id}` },
      { method: 'put', url: `/api/admin/reject/${_id}` },
      { method: 'post', url: `/api/admin/reject`, data: { id: _id } },
    ];
    for (const e of endpoints) {
      try {
        const res = e.method === 'put' ? await api.put(e.url) : await api.post((e as any).url, (e as any).data);
        return res.data;
      } catch (err) {
        // try next
      }
    }
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 500);
    });
  },

  getAllUsers: async () => {
    const endpoints = ['/api/admin.php?action=users', '/api/admin/users', '/api/admin/get-users'];
    for (const ep of endpoints) {
      try {
        const res = await api.get(ep);
        const data = res.data;
        if (Array.isArray(data)) return data;
        if (data && Array.isArray(data.data)) return data.data;
        if (data && Array.isArray(data.users)) return data.users;
      } catch (err) {
        // next
      }
    }
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockUsers), 500);
    });
  },

  deleteUser: async (_id: number) => {
    const endpoints = [
      `/api/admin.php?action=deleteUser&id=${_id}`,
      `/api/admin/users/${_id}`,
      `/api/admin/deleteUser/${_id}`,
    ];
    for (const ep of endpoints) {
      try {
        const res = await api.delete(ep);
        return res.data;
      } catch (err) {
        // next
      }
    }
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 500);
    });
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
      const raw = localStorage.getItem('blocked_users');
      const list = raw ? JSON.parse(raw) : [];
      if (!list.includes(id)) list.push(id);
      localStorage.setItem('blocked_users', JSON.stringify(list));
      return { success: true };
    } catch {
      return { success: false };
    }
  },

  flagUser: async (id: number, reason = '') => {
    try {
      const raw = localStorage.getItem('flagged_users');
      const list = raw ? JSON.parse(raw) : [];
      // evitar duplicados: si ya existe, actualizar razón y timestamp
      const existingIndex = list.findIndex((f: any) => f.id === id);
      const entry = { id, reason, at: Date.now() };
      if (existingIndex >= 0) list[existingIndex] = entry;
      else list.push(entry);
      localStorage.setItem('flagged_users', JSON.stringify(list));

      // Enviar notificación formal al usuario señalado para que pueda apelar
      try {
        const adminName = mockUsers.find(u => u.id === 1)?.username || 'Equipo de TuAutoNorte';
        await messageService.sendMessage(1, {
          toUserId: id,
          carId: '',
          subject: 'Notificación de moderación: señalización en TuAutoNorte',
          content: `Estimado/a usuario,\n\nLe informamos que su cuenta ha sido señalada por el equipo de moderación de TuAutoNorte.\n\nRazón: ${reason || 'No especificada'}.\n\nSi considera que esta señalización es incorrecta, puede apelar respondiendo a este mensaje o enviando una apelación desde la página de su anuncio. Al apelar, describa brevemente por qué considera que la señalización es errónea y, si dispone, adjunte pruebas (fotos, documentación, etc.).\n\nNuestro equipo revisará su apelación en un plazo de 3-5 días hábiles.\n\nAtentamente,\n${adminName} (Equipo de moderación)\nsoporte@tuautonorte.example`,
        });
      } catch (msgErr) {
        // si falla la notificación, no interfiere con la señalización principal
        console.error('Error sending flag notification message:', msgErr);
      }

      return { success: true };
    } catch {
      return { success: false };
    }
  }
  ,

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

  // Quitar la señalización para un usuario
  unflagUser: async (id: number) => {
    try {
      const raw = localStorage.getItem('flagged_users');
      const list = raw ? JSON.parse(raw) : [];
      const newList = list.filter((f: any) => f.id !== id);
      localStorage.setItem('flagged_users', JSON.stringify(newList));
      return { success: true };
    } catch {
      return { success: false };
    }
  }
};
