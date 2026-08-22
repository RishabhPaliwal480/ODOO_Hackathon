import { ChevronRight } from 'lucide-react';
import { HeroVideo } from '../components/hero';
import { RegionalGrid } from '../components/destinations';
import { useAuth } from '../context/AuthContext';
import { fmtDate, money } from '../utils/formatters';

export function Home({
  cities = [],
  trips = [],
  isPlayingVideo = true,
  onToggleVideo,
  onNavigate,
  onPlanCity,
}) {
  const { user, isAuthenticated } = useAuth();

  const handleHeroSearch = (searchData) => {
    if (onPlanCity) onPlanCity(searchData);
    else onNavigate('create');
  };

  const handleDestinationPlan = (city) => {
    onNavigate('create', { state: { destination: `${city.name}, ${city.country}`, budget: city.avg_daily_cost * 7 } });
  };

  const userTrips = trips || [];

  return (
    <div id="view-landing" className="app-view space-y-16">
      {/* 1. Hero Section over Full Background Video */}
      <HeroVideo
        cities={cities}
        activeTripsCount={userTrips.length || 1}
        isPlaying={isPlayingVideo}
        onToggleVideo={onToggleVideo}
        onSelectDestination={handleHeroSearch}
        onLearnMore={() => onNavigate('create')}
      />

      {/* 2. Top Regional Selections */}
      <RegionalGrid
        cities={cities}
        onPlan={handleDestinationPlan}
        onSave={() => {}}
        savedCityIds={[]}
      />

      {/* 3. Section: Previous & Ongoing Journeys */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-white/15 pb-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-emerald-400">Your Archive</div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-1">
              Previous & Ongoing Journeys
            </h2>
          </div>
          <button
            onClick={() => onNavigate('trips')}
            className="text-xs font-bold text-slate-300 hover:text-white flex items-center space-x-1 transition-colors"
          >
            <span>View All Trips</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {userTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {userTrips.slice(0, 3).map((trip) => (
              <div
                key={trip.id}
                className="glass-card-dark glass-card-hover rounded-2xl p-5 space-y-3 cursor-pointer"
                onClick={() => onNavigate('itinerary')}
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${trip.is_public ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'}`}>
                    {trip.is_public ? 'PUBLIC' : 'PRIVATE'}
                  </span>
                  <span className="text-xs text-slate-400">{fmtDate(trip.start_date)}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <img
                    src={trip.cover_image || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=200&auto=format&fit=crop&q=80'}
                    alt={trip.title}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-white text-sm">{trip.title}</h4>
                    <p className="text-xs text-slate-400">
                      {trip.stops?.length || 0} stops • {fmtDate(trip.start_date)} - {fmtDate(trip.end_date)}
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-400">Budget: {money(trip.estimated_budget)}</span>
                  <span className="text-emerald-400 hover:underline">View Itinerary →</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div
              className="glass-card-dark glass-card-hover rounded-2xl p-5 space-y-3 cursor-pointer"
              onClick={() => onNavigate('create')}
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  COMPLETED
                </span>
                <span className="text-xs text-slate-400">May 12 - 18</span>
              </div>
              <div className="flex items-center space-x-3">
                <img
                  src="https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=200&auto=format&fit=crop&q=80"
                  alt="Swiss Alps"
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <h4 className="font-bold text-white text-sm">Swiss Alpine Explorer</h4>
                  <p className="text-xs text-slate-400">Zermatt & Interlaken • 6 Days</p>
                </div>
              </div>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-400">Budget: $2,100</span>
                <span className="text-emerald-400 hover:underline">Short Overview →</span>
              </div>
            </div>

            {/* Card 2 */}
            <div
              className="glass-card-dark glass-card-hover rounded-2xl p-5 space-y-3 cursor-pointer"
              onClick={() => onNavigate('create')}
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  UPCOMING
                </span>
                <span className="text-xs text-slate-400">Sep 04 - 10</span>
              </div>
              <div className="flex items-center space-x-3">
                <img
                  src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=200&auto=format&fit=crop&q=80"
                  alt="Santorini"
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <h4 className="font-bold text-white text-sm">Santorini Sunset Bliss</h4>
                  <p className="text-xs text-slate-400">Oia & Fira • 7 Days</p>
                </div>
              </div>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-400">Budget: $1,750</span>
                <span className="text-emerald-400 hover:underline">View Itinerary →</span>
              </div>
            </div>

            {/* Card 3 */}
            <div
              className="glass-card-dark glass-card-hover rounded-2xl p-5 space-y-3 cursor-pointer"
              onClick={() => onNavigate('itinerary')}
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  DRAFT PLAN
                </span>
                <span className="text-xs text-slate-400">Oct 15 - 22</span>
              </div>
              <div className="flex items-center space-x-3">
                <img
                  src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=200&auto=format&fit=crop&q=80"
                  alt="Kyoto"
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <h4 className="font-bold text-white text-sm">Kyoto Autumn Leaves</h4>
                  <p className="text-xs text-slate-400">Arashiyama & Gion • 8 Days</p>
                </div>
              </div>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-400">Sections: 4 Added</span>
                <span className="text-emerald-400 hover:underline">Continue Build →</span>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
