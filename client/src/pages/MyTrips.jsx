import { Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fmtDate, money } from '../utils/formatters';

export function MyTrips({
  trips = [],
  loading = false,
  onOpenTrip,
  onViewTrip,
  onDeleteTrip,
  onNavigate,
}) {
  const { isAuthenticated, openAuthModal } = useAuth();

  if (!isAuthenticated) {
    return (
      <div id="view-myTrips" className="app-view space-y-6">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">User Trip Listing</h2>
        <div className="glass-card-dark rounded-2xl p-8 text-center space-y-4">
          <p className="text-xs text-slate-300">Sign in to view your personalized trip records, budgets, and saved itineraries.</p>
          <button
            onClick={() => openAuthModal('login')}
            className="px-6 py-2.5 rounded-full btn-solid-white font-bold text-xs"
          >
            Sign In / Register
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="view-myTrips" className="app-view space-y-6">
      <div className="flex items-center justify-between border-b border-white/15 pb-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-emerald-400">Screen 6 • My Trips</div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-0.5">User Trip Listing</h2>
        </div>
        <button
          onClick={() => onNavigate('create')}
          className="px-5 py-2.5 rounded-full btn-solid-white font-bold text-xs flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Plan New Trip</span>
        </button>
      </div>

      {loading ? (
        <div className="glass-card-dark rounded-2xl p-12 text-center text-xs font-bold text-slate-300">
          Loading your travel itineraries...
        </div>
      ) : trips.length === 0 ? (
        <div className="glass-card-dark rounded-2xl p-12 text-center space-y-3">
          <h3 className="font-bold text-base text-white">No trips planned yet</h3>
          <p className="text-xs text-slate-400">Start planning your first multi-city adventure!</p>
          <button
            onClick={() => onNavigate('create')}
            className="px-6 py-2.5 rounded-full btn-solid-white font-bold text-xs"
          >
            + Create a Trip
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {trips.map((trip) => {
            const spent = Number(trip.current_spent) || 0;
            const budget = Number(trip.estimated_budget) || 1500;
            const percentage = Math.min(100, Math.round((spent / budget) * 100));

            return (
              <div key={trip.id} className="glass-card-dark rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    {trip.stop_count || 0} STOPS • ACTIVE
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {fmtDate(trip.start_date)} — {fmtDate(trip.end_date)}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-xl text-white">{trip.title}</h3>
                  <p className="text-xs text-slate-300 mt-1">{trip.description || 'Custom curated multi-city itinerary.'}</p>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span>Budget Status</span>
                    <span>{money(spent)} / {money(budget)} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${percentage}%` }} />
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => onOpenTrip(trip)}
                      className="px-5 py-2 rounded-full btn-solid-white font-bold text-xs"
                    >
                      Open Builder
                    </button>
                    <button
                      onClick={() => onViewTrip(trip)}
                      className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
                    >
                      Live Itinerary View
                    </button>
                  </div>

                  {onDeleteTrip && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete "${trip.title}"?`)) onDeleteTrip(trip.id);
                      }}
                      className="text-slate-400 hover:text-rose-400 text-xs font-bold transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
