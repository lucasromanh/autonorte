import api from './api';

type Review = {
  id: number;
  car_id: number;
  user_id: number;
  rating: number;
  comment?: string | null;
  created_at?: string;
  user_name?: string;
};

type ReviewsResponse = {
  ok: boolean;
  summary?: { avg_rating?: number | null; score_10?: number | null; total?: number };
  reviews?: Review[];
};

const cache = new Map<number, ReviewsResponse>();

export const reviewService = {
  // Get reviews + summary for a car. Cached in-memory to avoid duplicate requests on lists.
  getCarReviews: async (carId: number, force = false): Promise<ReviewsResponse> => {
    if (!force && cache.has(carId)) return cache.get(carId)!;
    try {
      const res = await api.get(`/reviews/car/${carId}`);
      const data: ReviewsResponse = res.data;
      // Normalize summary fields coming from backend (strings, nulls, etc.)
      if (data && data.summary) {
        const s = data.summary as any;
        // Coerce to numbers when possible, keep null otherwise
        s.avg_rating = s.avg_rating != null && s.avg_rating !== '' ? Number(s.avg_rating) : null;
        s.score_10 = s.score_10 != null && s.score_10 !== '' ? Number(s.score_10) : null;
        s.total = s.total != null && s.total !== '' ? Number(s.total) : 0;
      }
      cache.set(carId, data);
      return data;
    } catch (err) {
      console.error('[reviewService] getCarReviews failed for', carId, err);
      return { ok: false, summary: { avg_rating: null, score_10: null, total: 0 }, reviews: [] };
    }
  },

  // Create or update review for current user on car
  createOrUpdateReview: async (carId: number, payload: { rating: number; comment?: string }) => {
    try {
      console.debug('[reviewService] POST /reviews/car/', carId, 'payload=', payload);
      const res = await api.post(`/reviews/car/${carId}`, payload);
      // invalidate cache
      cache.delete(carId);
      return res.data;
    } catch (err) {
      console.error('[reviewService] createOrUpdateReview failed', err);
      throw err;
    }
  },

  // Delete a review by id
  deleteReview: async (reviewId: number) => {
    try {
      const res = await api.delete(`/reviews/${reviewId}`);
      // best-effort: clear entire cache (simple)
      cache.clear();
      return res.data;
    } catch (err) {
      console.error('[reviewService] deleteReview failed', err);
      throw err;
    }
  },

  // Admin: fetch recent reviews if backend exposes /admin/reviews
  getRecentReviews: async () => {
    try {
      const res = await api.get('/admin/reviews');
      return res.data;
    } catch (err) {
      console.warn('[reviewService] getRecentReviews not available on backend');
      return { ok: false, reviews: [] };
    }
  }
};

export type { Review };
