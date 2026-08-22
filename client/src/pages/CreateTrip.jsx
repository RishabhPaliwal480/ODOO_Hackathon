import { useState } from 'react';
import { ArrowRight, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { tripsApi } from '../services';

export function CreateTrip({
  initialData = {},
  onTripCreated,
  onCancel,
  onNavigate,
}) {
  const { isAuthenticated, openAuthModal } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [startCity, setStartCity] = useState('Jaipur, India');
  const [form, setForm] = useState({
    title: initialData.title || (initialData.destination ? `${initialData.destination} Grand Discovery` : 'Tokyo Food and Culture Circuit'),
    description: initialData.description || 'A balanced exploration of historic shrines, vibrant street markets, and culinary walks.',
    start_date: initialData.startDate || '2026-09-15',
    end_date: initialData.endDate || '2026-09-22',
    estimated_budget: initialData.budget || 1900,
    cover_image: initialData.coverImage || 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800',
    is_public: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      openAuthModal('login');
      showToast('Please sign in or create an account to save your trip.', 'info');
      return;
    }

    setLoading(true);
    try {
      const res = await tripsApi.create({
        ...form,
        estimated_budget: Number(form.estimated_budget) || 1500,
      });
      showToast(`Trip to ${form.title} initialized!`, 'success');
      onTripCreated(res.data);
    } catch (err) {
      showToast(err.message || 'Failed to create trip', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="view-createTrip" className="app-view space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/15 pb-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-emerald-400">Screen 4 • Wizard</div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-0.5">Plan a New Adventure</h2>
        </div>
        <button
          onClick={() => onNavigate('builder')}
          className="px-5 py-2.5 rounded-full btn-solid-white font-bold text-xs flex items-center space-x-2 self-start"
        >
          <span>Go to Itinerary Builder</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="glass-card-dark rounded-3xl p-6 sm:p-8 space-y-6">
        <form id="new-trip-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Start City (Origin)</label>
              <input
                id="form-start-city"
                type="text"
                value={startCity}
                onChange={(e) => setStartCity(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-sm font-semibold text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Trip Title / Destination</label>
              <input
                id="form-destination-city"
                type="text"
                placeholder="e.g. Paris, Tokyo, Bali"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-sm font-semibold text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Start Date</label>
              <input
                id="form-start-date"
                type="date"
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-sm font-semibold text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-2">End Date</label>
              <input
                id="form-end-date"
                type="date"
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-sm font-semibold text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Target Budget ($ USD)</label>
              <input
                id="form-target-budget"
                type="number"
                min="100"
                step="50"
                value={form.estimated_budget}
                onChange={(e) => setForm({ ...form, estimated_budget: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-sm font-semibold text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Cover Photo URL (Optional)</label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={form.cover_image}
                onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-sm font-semibold text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Trip Overview / Notes</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-sm font-semibold text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-full btn-solid-white font-bold text-xs flex items-center space-x-2 shadow-lg hover:scale-105 active:scale-95 transition-transform"
            >
              <Layers className="w-4 h-4" />
              <span>{loading ? 'Initializing Trip...' : 'Save & Build Daily Sections (Screen 5)'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
