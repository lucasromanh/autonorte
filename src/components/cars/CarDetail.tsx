import React, { useEffect, useState } from 'react';
import type { Car } from '@/services/carService';
import { formatPrice, formatDate } from '@/utils/helpers';
import Button from '@/components/ui/Button';
import { adminService } from '@/services/adminService';
import { reviewService } from '@/services/reviewService';
import type { Review } from '@/services/reviewService';
import { normalizeImages } from '@/utils/images';
import Stars from '@/components/ui/Stars';
import { useAuth } from '@/hooks/useAuth';

interface CarDetailProps {
  car: Car;
  onMakeOffer?: () => void;
}

const CarDetail: React.FC<CarDetailProps> = ({ car, onMakeOffer }) => {
  const flagged = adminService.getFlagForUser(car.userId);
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const [myRating, setMyRating] = useState<number>(0);
  const [myComment, setMyComment] = useState<string>('');

  const load = async () => {
    setLoadingReviews(true);
    try {
      const res = await reviewService.getCarReviews(car.id, true);
      setSummary(res.summary || null);
      setReviews(res.reviews || []);
      // if user has existing review, prefill
      if (user && res.reviews) {
        const mine = res.reviews.find(r => Number(r.user_id) === Number(user.id));
        if (mine) {
          setMyRating(Number(mine.rating));
          setMyComment(mine.comment || '');
        }
      }
    } catch (err) {
      console.error('Error loading reviews', err);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => { load(); }, [car.id]);
  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {flagged && (
        <div className="w-full bg-yellow-600 text-white p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <p className="font-bold">Advertencia: usuario señalado</p>
            {flagged.reason && <p className="text-sm opacity-90">Motivo: {flagged.reason}</p>}
          </div>
          <div className="text-sm opacity-90">
            Señalado: {new Date(flagged.at).toLocaleString()}
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{car.title}</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{car.description}</p>
          {/* Reviews summary */}
          {summary && (
            <div className="mb-4">
              <div className="flex items-center space-x-3">
                <Stars value={summary.avg_rating ?? 0} size={18} />
                <div>
                  <div className="text-sm font-semibold">{summary.score_10 ? `${summary.score_10}/10` : ''}</div>
                  <div className="text-xs text-gray-500">{summary.total || 0} reseñas</div>
                </div>
              </div>
            </div>
          )}
          <div className="space-y-2 mb-6">
            <p><strong>Ubicación:</strong> {car.location}</p>
            <p><strong>Precio:</strong> {formatPrice(car.price)}</p>
            <p><strong>Publicado:</strong> {formatDate(car.createdAt)}</p>
          </div>
          {onMakeOffer && (
            <Button onClick={onMakeOffer} size="lg">
              Hacer Oferta
            </Button>
          )}

          {/* Review form for authenticated users */}
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-2">Dejar una reseña</h4>
            {!user ? (
              <p className="text-sm text-gray-500">Debes iniciar sesión para dejar una reseña.</p>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center"><Stars value={myRating} interactive onChange={v => setMyRating(v)} size={20} /></div>
                <textarea value={myComment} onChange={e => setMyComment(e.target.value)} placeholder="Tu comentario" className="w-full border rounded p-2 text-sm" rows={3} />
                <div className="flex items-center space-x-2">
                  <Button size="sm" onClick={async () => {
                    if (myRating < 1 || myRating > 5) { alert('Elige una puntuación de 1 a 5 estrellas'); return; }
                    try {
                      await reviewService.createOrUpdateReview(car.id, { rating: myRating, comment: myComment });
                      await load();
                    } catch (err) { console.error(err); alert('Error al guardar la reseña'); }
                  }}>Enviar</Button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {normalizeImages((car as any).images).map((image, index) => (
              <img
                key={index}
                src={image || '/images/cars/default-car.svg'}
                alt={`${car.title} ${index + 1}`}
                className="w-full h-32 object-cover rounded-md"
              />
            ))}
          </div>
        </div>
      </div>
      {/* Reviews list */}
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-3">Reseñas</h3>
        {loadingReviews ? (
          <div className="text-sm text-gray-500">Cargando reseñas...</div>
        ) : (
          <div className="space-y-4">
            {reviews.length === 0 && <div className="text-sm text-gray-500">Aún no hay reseñas para este vehículo.</div>}
            {reviews.map(r => (
              <div key={r.id} className="border rounded p-3 bg-white dark:bg-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{r.user_name || (r as any).user || (r as any).owner_name || 'Usuario'}</div>
                    <div className="text-xs text-gray-500">{new Date(r.created_at || '').toLocaleString()}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Stars value={r.rating} size={14} />
                    {(user && (user.role === 'admin' || Number(user.id) === Number(r.user_id))) && (
                      <Button size="sm" variant="danger" onClick={async () => {
                        if (!window.confirm('¿Eliminar esta reseña?')) return;
                        try {
                          await reviewService.deleteReview(r.id);
                          await load();
                        } catch (err) { console.error(err); alert('No se pudo eliminar la reseña'); }
                      }}>Eliminar</Button>
                    )}
                  </div>
                </div>
                {r.comment && <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CarDetail;