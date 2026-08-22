import {
  Bed,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Plus,
  Trash2,
} from 'lucide-react';
import { Badge, Card } from '../ui';
import { fmtDate, money } from '../../utils/formatters';

export function StopCard({
  stop,
  onAddActivity,
  onRemoveStop,
  onRemoveActivity,
}) {
  const {
    id,
    stop_order,
    city_name,
    country,
    arrival_date,
    departure_date,
    lodging_cost = 0,
    transport_cost = 0,
    notes,
    activities = [],
  } = stop;

  const totalStopCost =
    lodging_cost +
    transport_cost +
    activities.reduce((sum, a) => sum + (Number(a.cost) || 0), 0);

  return (
    <Card className="p-5 sm:p-6 space-y-4">
      {/* Stop Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
        <div className="flex items-center space-x-3.5">
          <span className="w-8 h-8 rounded-full bg-[#18181b] text-white font-bold text-xs flex items-center justify-center shrink-0">
            {stop_order}
          </span>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-base sm:text-lg text-slate-900">
                {city_name}, {country}
              </h3>
              <Badge variant="stone">Stop {stop_order}</Badge>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-700" />
              <span>
                {fmtDate(arrival_date)} — {fmtDate(departure_date)}
              </span>
            </div>
          </div>
        </div>

        {/* Cost & Delete Action */}
        <div className="flex items-center space-x-3 self-end sm:self-center">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Stop Total</span>
            <span className="text-xs sm:text-sm font-extrabold text-emerald-800">
              {money(totalStopCost)}
            </span>
          </div>

          {onRemoveStop && (
            <button
              onClick={() => onRemoveStop(id)}
              className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Remove City Stop"
              aria-label="Remove City Stop"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Lodging & Transport Badges */}
      <div className="flex flex-wrap gap-2 text-xs">
        <div className="px-3 py-1 rounded-xl bg-stone-50 border border-stone-200 flex items-center space-x-2 text-slate-700">
          <Bed className="w-3.5 h-3.5 text-emerald-700" />
          <span>Lodging: <strong>{money(lodging_cost)}</strong></span>
        </div>
        <div className="px-3 py-1 rounded-xl bg-stone-50 border border-stone-200 flex items-center space-x-2 text-slate-700">
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          <span>Transit: <strong>{money(transport_cost)}</strong></span>
        </div>
        {notes && (
          <div className="px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs italic">
            {notes}
          </div>
        )}
      </div>

      {/* Activities Schedule */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span>Scheduled Activities ({activities.length})</span>
          {onAddActivity && (
            <button
              onClick={() => onAddActivity(stop)}
              className="text-emerald-800 hover:text-emerald-950 flex items-center space-x-1 font-bold text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Activity</span>
            </button>
          )}
        </div>

        {activities.length === 0 ? (
          <p className="text-xs text-slate-400 py-2 italic bg-stone-50 rounded-xl p-3 text-center border border-dashed border-stone-200">
            No activities scheduled for this stop yet. Click "+ Add Activity" to schedule sightseeing, dining, or museum tours.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {activities.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-stone-50 hover:bg-stone-100/80 border border-stone-200/80 flex items-center justify-between gap-3 text-xs transition-colors"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div className="truncate">
                    <span className="font-bold text-slate-900 block truncate">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium flex items-center space-x-1.5 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{item.time_slot || 'Anytime'} • Day {item.day_number || 1} • {item.category || 'Sightseeing'}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span className="font-bold text-emerald-800 text-xs">
                    {money(item.cost)}
                  </span>
                  {onRemoveActivity && (
                    <button
                      onClick={() => onRemoveActivity(item.id)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded-md transition-colors"
                      title="Remove Activity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
