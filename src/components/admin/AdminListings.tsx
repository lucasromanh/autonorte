import React, { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import Modal from '@/components/ui/Modal';
import type { Car } from '@/services/carService';
import { adminService } from '@/services/adminService';

const AdminListings: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [flagModalOpen, setFlagModalOpen] = useState(false);
  const [flagUserId, setFlagUserId] = useState<number | null>(null);
  const [flagReason, setFlagReason] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      const all = (await adminService.getAllCars()) as Car[];
      setCars(all as Car[]);
    } catch (err) {
      console.error('Error loading cars for admin:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Eliminar esta publicación?')) return;
    try {
      await adminService.deleteCar(id);
      setCars(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Error deleting car:', err);
    }
  };

  const handleEdit = async (id: number) => {
    // Abre modal o redirige a editar; por ahora simulamos modificación rápida
    const title = window.prompt('Nuevo título para la publicación (dejar vacío para cancelar):');
    if (!title) return;
    try {
      await adminService.editCar(id, { title });
      setCars(prev => prev.map(c => c.id === id ? { ...c, title } : c));
    } catch (err) {
      console.error('Error editing car:', err);
    }
  };

  const openFlagModal = (userId: number) => {
    setFlagUserId(userId);
    setFlagReason('');
    setFlagModalOpen(true);
  };

  const confirmFlag = async () => {
    if (!flagUserId) return;
    try {
      await adminService.flagUser(flagUserId, flagReason || '');
      setFlagModalOpen(false);
      setMessage('Usuario señalado correctamente');
      // limpiar mensaje luego de 3s
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('Error flagging user:', err);
      setMessage('Error al señalar usuario');
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleBlockUser = async (userId: number) => {
    if (!window.confirm('Bloquear usuario?')) return;
    try {
      await adminService.blockUser(userId);
      alert('Usuario bloqueado');
    } catch (err) {
      console.error('Error blocking user:', err);
    }
  };

  if (loading) return <Loader size="lg" />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Listado de Publicaciones</h2>
      {cars.length === 0 ? (
        <p className="text-center text-gray-700 dark:text-gray-300">No hay publicaciones</p>
      ) : (
        <div className="space-y-4">
          {cars.map(car => {
            const flagged = adminService.getFlagForUser(car.userId);
            return (
              <div key={car.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col md:flex-row md:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{car.title}</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">{car.description}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Usuario: {car.userName} (ID: {car.userId})</p>
                {flagged && (
                  <p className="text-xs text-yellow-700 dark:text-yellow-300">Señalado: {flagged.reason || 'Sin motivo'} — {new Date(flagged.at).toLocaleString()}</p>
                )}
              </div>

              <div className="mt-4 md:mt-0 flex items-center space-x-2">
                <Button onClick={() => handleEdit(car.id)} variant="secondary" size="sm">Editar</Button>
                <Button onClick={() => handleDelete(car.id)} variant="danger" size="sm">Eliminar</Button>
                {flagged ? (
                  <Button onClick={async () => {
                    if (!window.confirm('Quitar señalización de este usuario?')) return;
                    await adminService.unflagUser(car.userId);
                    setMessage('Señalización removida');
                    // forzar re-render para reflejar cambio
                    setCars(prev => [...prev]);
                    setTimeout(() => setMessage(null), 3000);
                  }} variant="secondary" size="sm">Quitar Señalización</Button>
                ) : (
                  <Button onClick={() => openFlagModal(car.userId)} variant="secondary" size="sm">Señalar Usuario</Button>
                )}
                <Button onClick={() => handleBlockUser(car.userId)} variant="danger" size="sm">Bloquear Usuario</Button>
              </div>
            </div>
          );
          })}
        </div>
      )}
      {/* Modal de señalización */}
      <Modal isOpen={flagModalOpen} onClose={() => setFlagModalOpen(false)} title="Señalar Usuario">
        <div className="space-y-3">
          <p className="text-sm text-gray-700 dark:text-gray-300">Indica la razón por la cual señalas a este usuario. Esto se mostrará en las publicaciones relacionadas.</p>
          <textarea
            value={flagReason}
            onChange={(e) => setFlagReason(e.target.value)}
            placeholder="Motivo (opcional)"
            className="w-full h-28 p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={() => setFlagModalOpen(false)}>Cancelar</Button>
            <Button onClick={confirmFlag}>Confirmar</Button>
          </div>
        </div>
      </Modal>

      {message && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow-lg">
          {message}
        </div>
      )}
    </div>
  );
};

export default AdminListings;
