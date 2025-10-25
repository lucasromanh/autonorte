import React from 'react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Panel de Administración</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Publicaciones Pendientes</h3>
          <p className="text-3xl font-bold text-orange-600">5</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Usuarios Totales</h3>
          <p className="text-3xl font-bold text-blue-600">150</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Vehículos Activos</h3>
          <p className="text-3xl font-bold text-green-600">89</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;