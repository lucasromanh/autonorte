import React, { useEffect, useState } from 'react';
import { reviewService } from '@/services/reviewService';
import { useAuth } from '@/hooks/useAuth';
import Stars from '@/components/ui/Stars';
import Button from '@/components/ui/Button';

interface ReviewsPanelProps {
  carId: number;
}

const ReviewsPanel: React.FC<ReviewsPanelProps> = ({ carId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [myRating, setMyRating] = useState<number>(0);
  const [myComment, setMyComment] = useState<string>('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await reviewService.getCarReviews(carId, true);
      setSummary(res.summary || null);
      setReviews(res.reviews || []);
      if (user && res.reviews) {
        const mine = res.reviews.find((r: any) => Number(r.user_id) === Number(user.id));
        if (mine) {
          setMyRating(Number(mine.rating));
          setMyComment(mine.comment || '');
        }
      }
    } catch (err) {
      console.error('Error loading reviews', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [carId, user?.id]);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Reseñas</h3>
          {summary && (
            <div className="text-sm text-gray-500">
              {summary.total || 0} reseñas • {Number.isFinite(Number(summary.avg_rating)) ? `${Number(summary.avg_rating).toFixed(1)}★` : ''}
            </div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-medium mb-2">Dejar una reseña</h4>
        <div className="space-y-2">
          <div className="flex items-center">
            <Stars value={myRating} interactive onChange={v => {
              if (!user) { window.location.href = '/login'; return; }
              setMyRating(v);
            }} size={18} />
          </div>
          <textarea value={myComment} onChange={e => setMyComment(e.target.value)} placeholder={user ? 'Tu comentario' : 'Inicia sesión para dejar un comentario'} className="w-full border rounded p-2 text-sm" rows={3} disabled={!user} />
          <div className="flex items-center mt-2">
            {user ? (
              <Button size="sm" onClick={async () => {
                if (myRating < 1 || myRating > 5) { alert('Elige una puntuación de 1 a 5 estrellas'); return; }
                setSaving(true);
                try {
                  await reviewService.createOrUpdateReview(carId, { rating: myRating, comment: myComment });
                  await load();
                } catch (err) { console.error(err); alert('Error al guardar la reseña'); } finally { setSaving(false); }
              }} disabled={saving}>{saving ? 'Guardando...' : 'Enviar'}</Button>
            ) : (
              <Button size="sm" onClick={() => window.location.href = '/login'}>Iniciar sesión para comentar</Button>
            )}
          </div>
        </div>
      </div>

      <div>
        {loading ? (
          <div className="text-sm text-gray-500">Cargando reseñas...</div>
        ) : (
          <div className="space-y-3">
            {reviews.length === 0 && <div className="text-sm text-gray-500">Aún no hay reseñas para este vehículo.</div>}
            {reviews.map(r => (
              <div key={r.id} className="border rounded p-3 bg-white dark:bg-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{r.user_name || (r as any).user || 'Usuario'}</div>
                    <div className="text-xs text-gray-500">{new Date(r.created_at || '').toLocaleString()}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Stars value={r.rating} size={14} />
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

export default ReviewsPanel;
