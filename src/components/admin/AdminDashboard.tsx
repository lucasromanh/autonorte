import React, { useEffect, useState } from 'react';
import Loader from '@/components/ui/Loader';
import { adminService } from '@/services/adminService';
import { reviewService } from '@/services/reviewService';
import Button from '@/components/ui/Button';

const AdminDashboard: React.FC = () => {
  const [pendingCount, setPendingCount] = useState<number | null>(null);
  const [usersCount, setUsersCount] = useState<number | null>(null);
  const [carsCount, setCarsCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const pending = await adminService.getPendingCars();
        const users = await adminService.getAllUsers();
        const cars = await adminService.getAllCars();

        setPendingCount(Array.isArray(pending) ? pending.length : 0);
        setUsersCount(Array.isArray(users) ? users.length : 0);
        setCarsCount(Array.isArray(cars) ? cars.length : 0);
      } catch (err) {
        console.error('Error loading admin dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loader size="lg" />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Panel de Administración</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Publicaciones Pendientes</h3>
          <p className="text-3xl font-bold text-orange-600">{pendingCount ?? 0}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Usuarios Totales</h3>
          <p className="text-3xl font-bold text-blue-600">{usersCount ?? 0}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Vehículos Activos</h3>
          <p className="text-3xl font-bold text-green-600">{carsCount ?? 0}</p>
        </div>
      </div>
      {/* Recent reviews (if backend exposes admin/reviews) */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">Reseñas recientes</h3>
        <RecentReviews />
      </div>
    </div>
  );
};

export default AdminDashboard;

const RecentReviews: React.FC = () => {
  const [reviews, setReviews] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await reviewService.getRecentReviews();
        if (!mounted) return;
        if (res && Array.isArray(res.reviews)) setReviews(res.reviews);
      } catch (err) {
        console.error('Error fetching recent reviews', err);
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="text-sm text-gray-500">Cargando...</div>;
  if (reviews.length === 0) return <div className="text-sm text-gray-500">No hay reseñas recientes o el endpoint /admin/reviews no está disponible.</div>;

  return (
    <div className="space-y-3">
      {reviews.map((r: any) => (
        <div key={r.id} className="flex items-start justify-between border rounded p-3">
          <div>
            <div className="font-semibold">{r.user_name || r.user || 'Usuario'}</div>
            <div className="text-xs text-gray-500">{r.comment}</div>
            <div className="text-xs text-gray-400">{new Date(r.created_at || r.createdAt).toLocaleString()}</div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <div className="text-sm">{r.rating} ⭐</div>
            <Button size="sm" variant="danger" onClick={async () => {
              if (!window.confirm('Eliminar esta reseña?')) return;
              try {
                await reviewService.deleteReview(r.id);
                setReviews(prev => prev.filter(x => x.id !== r.id));
              } catch (err) { console.error(err); alert('No se pudo eliminar la reseña'); }
            }}>Eliminar</Button>
          </div>
        </div>
      ))}
    </div>
  );
};