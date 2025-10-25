// import api from './api'; // TODO: Uncomment when backend is ready

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

export const adminService = {
  getPendingCars: async () => {
    // TODO: Uncomment when backend is ready
    // const response = await api.get('/admin.php?action=pending');
    // return response.data;

    // Mock data for development
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockPendingCars), 500);
    });
  },

  approveCar: async (_id: number) => {
    // TODO: Uncomment when backend is ready
    // const response = await api.put('/admin.php', { action: 'approve', id });
    // return response.data;

    // Mock response for development
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 500);
    });
  },

  rejectCar: async (_id: number) => {
    // TODO: Uncomment when backend is ready
    // const response = await api.put('/admin.php', { action: 'reject', id });
    // return response.data;

    // Mock response for development
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 500);
    });
  },

  getAllUsers: async () => {
    // TODO: Uncomment when backend is ready
    // const response = await api.get('/admin.php?action=users');
    // return response.data;

    // Mock data for development
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockUsers), 500);
    });
  },

  deleteUser: async (_id: number) => {
    // TODO: Uncomment when backend is ready
    // const response = await api.delete(`/admin.php?action=deleteUser&id=${id}`);
    // return response.data;

    // Mock response for development
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 500);
    });
  },
};
