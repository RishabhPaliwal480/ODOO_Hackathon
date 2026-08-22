import { ArrowRight, Bookmark, BookmarkCheck, MapPin } from 'lucide-react';
import { Badge, Card } from '../ui';
import { money } from '../../utils/formatters';

export function CityCard({ city, onPlan, onSave, isSaved = false }) {
  const { name, country, region, description, image_url, avg_daily_cost, cost_index } = city;

  return (
    <Card hover className="p-4 space-y-3.5 group flex flex-col justify-between">
      <div className="space-y-3">
        <div className="relative h-44 rounded-xl overflow-hidden bg-stone-100">
          <img
            src={image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'}
            alt={`${name}, ${country}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-2.5 left-2.5">
            <Badge variant="glass">{region || country}</Badge>
          </div>
          {onSave && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSave(city);
              }}
              className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-xs transition-colors"
              title={isSaved ? 'Remove from Saved' : 'Save City'}
            >
              {isSaved ? (
                <BookmarkCheck className="w-3.5 h-3.5 text-emerald-700 fill-emerald-700" />
              ) : (
                <Bookmark className="w-3.5 h-3.5" />
              )}
            </button>
          )}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 px-3 py-1 rounded-xl bg-white/95 backdrop-blur-sm flex items-center justify-between text-xs font-bold text-slate-900 shadow-xs">
            <span className="text-[11px] text-slate-500 uppercase">{cost_index || 'Moderate'}</span>
            <span className="text-emerald-800 font-extrabold">{money(avg_daily_cost)} / day</span>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-800 transition-colors">
            {name}, {country}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      <button
        onClick={() => onPlan(city)}
        className="w-full py-2.5 rounded-xl bg-stone-100 group-hover:bg-[#18181b] group-hover:text-white text-slate-800 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
      >
        <MapPin className="w-3.5 h-3.5" />
        <span>Plan Trip to {name}</span>
      </button>
    </Card>
  );
}
