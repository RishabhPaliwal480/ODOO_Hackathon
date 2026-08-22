import { ArrowRight, Bookmark, BookmarkCheck } from 'lucide-react';
import { money } from '../../utils/formatters';

export function DestinationCard({
  destination,
  onPlan,
  onSave,
  isSaved = false,
}) {
  const {
    name,
    country,
    description,
    image_url,
    avg_daily_cost,
    cost_index,
    days = 7,
    total_cost,
  } = destination;

  const estimatedTotal = total_cost || (avg_daily_cost ? Math.round(avg_daily_cost * days) : 1450);

  return (
    <div
      onClick={() => onPlan(destination)}
      className="region-card glass-card-dark glass-card-hover rounded-2xl p-4 space-y-3.5 cursor-pointer group flex flex-col justify-between"
    >
      <div className="space-y-3">
        {/* Cover Image */}
        <div className="relative h-52 rounded-xl overflow-hidden bg-black/40">
          <img
            src={image_url || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80'}
            alt={`${name}, ${country}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold">
            {country || 'Global'}
          </div>

          {onSave && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSave(destination);
              }}
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center shadow-xs transition-colors"
              title={isSaved ? 'Remove from Saved' : 'Save Destination'}
              aria-label={isSaved ? 'Remove from Saved' : 'Save Destination'}
            >
              {isSaved ? (
                <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
              ) : (
                <Bookmark className="w-3.5 h-3.5 text-white" />
              )}
            </button>
          )}

          <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-sm flex items-center justify-between text-xs font-bold text-white">
            <span>{days} Days Itinerary</span>
            <span className="text-emerald-400 font-extrabold">{money(estimatedTotal)}</span>
          </div>
        </div>

        {/* Title and Description */}
        <div>
          <h3 className="font-bold text-base text-white group-hover:text-emerald-400 transition-colors">
            {name}
          </h3>
          <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Plan Button */}
      <button
        type="button"
        className="w-full py-2.5 rounded-xl bg-white/10 group-hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
      >
        <span>Plan This Trip</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
