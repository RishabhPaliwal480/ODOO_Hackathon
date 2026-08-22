import {
  Calendar,
  CheckCircle2,
  Edit3,
  MapPin,
  Share2,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { fmtDate, money } from '../utils/formatters';

export function ItineraryView({ trip, onEditInBuilder, onBack }) {
  const { showToast } = useToast();

  const activeTrip = trip || {
    title: 'Parisian Art & Romance Grand Tour',
    description: 'Staying in 7th Arrondissement. Seine River Cruise & Eiffel illumination scheduled.',
    start_date: '2026-09-15',
    end_date: '2026-09-22',
    estimated_budget: 1450,
    current_spent: 740,
    stops: [
      {
        id: '1',
        city_name: 'Paris',
        country: 'France',
        stop_order: 1,
        arrival_date: '2026-09-15',
        departure_date: '2026-09-22',
        lodging_cost: 450,
        transport_cost: 150,
        activities: [
          { id: 'a1', title: 'Hotel Check-in at 7th Arrondissement', time_slot: '09:30 AM', cost: 0, day_number: 1 },
          { id: 'a2', title: 'Champ de Mars Afternoon Walking Tour', time_slot: '02:00 PM', cost: 25, day_number: 1 },
          { id: 'a3', title: 'Eiffel Tower Summit Access & Champagne', time_slot: '06:00 PM', cost: 115, day_number: 1 },
        ],
      },
    ],
  };

  const {
    title,
    description,
    start_date,
    end_date,
    estimated_budget = 1450,
    current_spent = 740,
    stops = [],
  } = activeTrip;

  const percentage = Math.min(100, Math.round((current_spent / estimated_budget) * 100));
  const remaining = Math.max(0, estimated_budget - current_spent);

  return (
    <div id="view-itineraryView" className="app-view space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/15 pb-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-emerald-400">Screen 9 • Overview</div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-0.5">Itinerary View & Budget Section</h2>
        </div>
        <div className="flex items-center space-x-2">
          {onEditInBuilder && (
            <button
              onClick={() => onEditInBuilder(activeTrip)}
              className="px-5 py-2 rounded-full btn-solid-white font-bold text-xs flex items-center space-x-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Modify in Builder</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Daily Timeline */}
        <div className="lg:col-span-7 space-y-4">
          {stops.map((stop, idx) => (
            <div key={stop.id || idx} className="glass-card-dark rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center space-x-3">
                  <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <h3 className="font-bold text-base text-white">Day {idx + 1}: {stop.city_name}, {stop.country}</h3>
                </div>
                <span className="text-xs font-bold text-slate-300">
                  {fmtDate(stop.arrival_date)}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {(stop.activities || []).map((act) => (
                  <div
                    key={act.id}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-slate-200"
                  >
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span><strong>{act.time_slot}:</strong> {act.title}</span>
                    </div>
                    {act.cost > 0 && (
                      <span className="font-bold text-emerald-400">{money(act.cost)}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Trip Budget Meter */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card-dark rounded-2xl p-6 space-y-4 sticky top-24">
            <h3 className="font-bold text-base text-white">Trip Budget Meter</h3>
            <div className="text-xs font-bold text-slate-300">
              Spent: {money(current_spent)} / {money(estimated_budget)} ({100 - percentage}% Remaining)
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <div className="bg-emerald-500 h-3 rounded-full" style={{ width: `${percentage}%` }} />
            </div>

            <div className="space-y-2 pt-3 border-t border-white/10 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Allocated Spend:</span>
                <span className="font-bold text-white">{money(current_spent)}</span>
              </div>
              <div className="flex justify-between">
                <span>Budget Balance Remaining:</span>
                <span className="font-bold text-emerald-400">{money(remaining)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
