import { Activity, Clock, Plus } from 'lucide-react';
import { Badge, Card } from '../ui';
import { money } from '../../utils/formatters';

export function ActivityCard({ activity, onAddToTrip }) {
  const { name, category, description, duration_hours, cost, image_url } = activity;

  return (
    <Card hover className="p-4 flex flex-col justify-between space-y-3 group">
      <div className="space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
                {name}
              </h4>
              <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-semibold mt-0.5">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{duration_hours || 2}h</span>
                </span>
                <span>•</span>
                <span>{category || 'Sightseeing'}</span>
              </div>
            </div>
          </div>
          <span className="text-xs font-extrabold text-emerald-800 shrink-0">
            {money(cost)}
          </span>
        </div>

        {description && (
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {onAddToTrip && (
        <button
          onClick={() => onAddToTrip(activity)}
          className="w-full py-2 rounded-xl bg-stone-100 hover:bg-slate-900 hover:text-white text-slate-800 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add to Itinerary</span>
        </button>
      )}
    </Card>
  );
}
