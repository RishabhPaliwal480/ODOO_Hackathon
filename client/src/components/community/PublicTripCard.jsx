import { useState } from 'react';
import { Calendar, Copy, Heart, MapPin, Users } from 'lucide-react';
import { Avatar, Badge, BudgetMeter, Card } from '../ui';
import { fmtDate, money } from '../../utils/formatters';

export function PublicTripCard({ trip, onCopy, copying = false }) {
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
    organizer_name,
    organizer_avatar,
    stops = [],
  } = trip;

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 80) + 45);

  const handleToggleLike = (e) => {
    e.stopPropagation();
    if (liked) {
      setLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      setLiked(true);
      setLikeCount((prev) => prev + 1);
    }
  };

  const displayImage =
    cover_image ||
    stops[0]?.city_image ||
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800';

  return (
    <Card hover className="p-5 space-y-4 flex flex-col justify-between group">
      <div className="space-y-3.5">
        {/* Cover Photo */}
        <div className="relative h-48 rounded-xl overflow-hidden bg-stone-100">
          <img
            src={displayImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-3 left-3">
            <Badge variant="glass">{stop_count} Stops Route</Badge>
          </div>

          <button
            onClick={handleToggleLike}
            className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1.5 backdrop-blur-md transition-all ${
              liked
                ? 'bg-rose-500 text-white'
                : 'bg-white/90 text-slate-800 hover:bg-white'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
            <span>{likeCount}</span>
          </button>

          <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-sm flex items-center justify-between text-xs font-bold text-slate-900 shadow-xs">
            <span>Budget Target</span>
            <span className="text-emerald-800 font-extrabold">{money(estimated_budget)}</span>
          </div>
        </div>

        {/* Organizer Info */}
        <div className="flex items-center space-x-2.5">
          <Avatar name={organizer_name || 'Traveler'} image={organizer_avatar} size="sm" />
          <div className="text-xs">
            <span className="font-bold text-slate-900 block">{organizer_name || 'Community Explorer'}</span>
            <span className="text-[11px] text-slate-500">Shared publicly</span>
          </div>
        </div>

        {/* Title and Description */}
        <div className="space-y-1">
          <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
            {title}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {description || 'Curated multi-city travel itinerary with recommended stops and activities.'}
          </p>
        </div>
      </div>

      {/* Copy Trip Action Button */}
      <button
        onClick={() => onCopy(trip)}
        disabled={copying}
        className="w-full py-2.5 rounded-xl bg-[#18181b] hover:bg-black text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-xs transition-colors disabled:opacity-50"
      >
        <Copy className="w-3.5 h-3.5" />
        <span>{copying ? 'Copying Itinerary...' : 'Copy Trip to My Account'}</span>
      </button>
    </Card>
  );
}
