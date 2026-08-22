import { ArrowRight, Calendar, MapPin, Trash2 } from 'lucide-react';
import { Badge, BudgetMeter, Card } from '../ui';
import { fmtDate, money } from '../../utils/formatters';

export function TripCard({
  trip,
  onOpen,
  onView,
  onDelete,
  actionLabel = 'Open Builder',
}) {
  const {
    id,
    title,
    description,
    start_date,
    end_date,
    estimated_budget = 1500,
    current_spent = 0,
    stop_count = 0,
    cover_image,
    is_public,
    organizer_name,
    stops = [],
  } = trip;

  const displayImage =
    cover_image ||
    stops[0]?.city_image ||
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800';

  return (
    <Card hover className="overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-0 group">
      {/* Cover Image Container */}
      <div className="md:col-span-4 relative h-48 md:h-auto min-h-[200px] overflow-hidden bg-stone-100">
        <img
          src={displayImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <Badge variant="glass">{stop_count} {stop_count === 1 ? 'Stop' : 'Stops'}</Badge>
          {is_public && <Badge variant="emerald">Public</Badge>}
        </div>
      </div>

      {/* Content Container */}
      <div className="md:col-span-8 p-5 sm:p-6 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-emerald-700" />
            <span>
              {fmtDate(start_date)} — {fmtDate(end_date)}
            </span>
          </div>

          <h3 className="font-bold text-lg sm:text-xl text-slate-900 group-hover:text-emerald-800 transition-colors">
            {title}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {description || 'Custom multi-city travel itinerary.'}
          </p>
        </div>

        {/* Budget Progress Meter */}
        <div className="pt-1">
          <BudgetMeter
            spent={current_spent}
            budget={estimated_budget}
            label="Trip Budget Progress"
          />
        </div>

        {/* Action Controls */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onOpen(trip)}
              className="px-4 py-2 rounded-full bg-[#18181b] hover:bg-black text-white text-xs font-bold flex items-center space-x-1.5 transition-colors"
            >
              <span>{actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {onView && (
              <button
                onClick={() => onView(trip)}
                className="px-3.5 py-2 rounded-full border border-stone-300 hover:bg-stone-100 text-xs font-bold text-slate-700 transition-colors"
              >
                View Summary
              </button>
            )}
          </div>

          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
                  onDelete(id);
                }
              }}
              className="w-9 h-9 rounded-full bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors"
              title="Delete Trip"
              aria-label="Delete Trip"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
