import { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronDown,
  MapPin,
  Pause,
  Play,
  Search,
  Users,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function HeroVideo({
  onSelectDestination,
  onLearnMore,
  cities = [],
  activeTripsCount = 1,
  isPlaying = true,
  onToggleVideo,
}) {
  const { user } = useAuth();
  const [searchLocation, setSearchLocation] = useState('Bali, Indonesia');
  const [searchDates, setSearchDates] = useState('Sep 15 – 22, 2026');
  const [searchGuests, setSearchGuests] = useState('2 People');

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    onSelectDestination({
      destination: searchLocation,
      startDate: '2026-09-15',
      budget: 1500,
    });
  };

  const userName = user?.name ? user.name.split(' ')[0] : 'Rishabh';

  return (
    <section className="relative min-h-[82vh] flex flex-col justify-between pt-2 pb-2">
      {/* 1. Top Centered Welcome Status Pill & Single-Line Title */}
      <div className="text-center space-y-4 pt-1">
        {/* Welcome Status Pill */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#0b1317]/80 backdrop-blur-md border border-emerald-500/30 text-xs font-semibold text-slate-200 shadow-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>
            Welcome back, <strong className="text-white font-bold">{userName}!</strong>{' '}
            <span className="text-emerald-400 font-bold">{activeTripsCount} Active Trip Scheduled.</span>
          </span>
        </div>

        {/* Massive Single-Line Headline */}
        <div className="w-full overflow-hidden flex justify-center">
          <h1 className="hero-title-single-line uppercase tracking-tight text-white select-none whitespace-nowrap drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] font-bold">
            Explore the Unseen
          </h1>
        </div>
      </div>

      {/* 2. Mid Section: Left Editorial Annotation + Right Search Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto py-6">
        {/* Left Callout Box with Pointer Line */}
        <div className="lg:col-span-6 max-w-[380px] text-white space-y-2 relative">
          <p className="text-xs sm:text-sm font-medium leading-relaxed drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] text-white/95">
            Discover unique places beyond the tourist path, with carefully planned multi-city itineraries that balance adventure, comfort, and authenticity.
          </p>

          {/* Dotted vector connector line */}
          <div className="hidden sm:block absolute top-1/2 -right-32 w-32 h-12 pointer-events-none opacity-85">
            <svg width="128" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="4" cy="24" r="3" fill="#ffffff" />
              <path
                d="M 4 24 L 70 24 L 105 38 L 124 38"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <circle cx="124" cy="38" r="3" fill="#ffffff" />
            </svg>
          </div>
        </div>

        {/* Right: Floating Travel Search Bar */}
        <div className="lg:col-span-6 flex justify-start lg:justify-end">
          <form
            onSubmit={handleSearchSubmit}
            className="bg-[#0e191f]/85 backdrop-blur-2xl border border-white/15 rounded-2xl p-2 sm:p-2.5 flex flex-col sm:flex-row items-center gap-2 text-xs text-white shadow-2xl w-full sm:w-auto"
          >
            {/* Find City Field */}
            <div className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 flex items-center space-x-3 transition-colors w-full sm:w-auto min-w-[140px]">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="flex-1">
                <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">FIND CITY</div>
                <select
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="bg-transparent text-white font-bold text-xs outline-none cursor-pointer w-full"
                >
                  <option value="Bali, Indonesia" className="text-slate-900">Bali, Indonesia</option>
                  <option value="Paris, France" className="text-slate-900">Paris, France</option>
                  <option value="Tokyo, Japan" className="text-slate-900">Tokyo, Japan</option>
                  <option value="Amalfi Coast, Italy" className="text-slate-900">Amalfi Coast, Italy</option>
                  <option value="Jaipur, India" className="text-slate-900">Jaipur, India</option>
                  {cities.map((c) => (
                    <option key={c.id} value={`${c.name}, ${c.country}`} className="text-slate-900">
                      {c.name}, {c.country}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dates Field */}
            <div className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 flex items-center space-x-3 transition-colors w-full sm:w-auto min-w-[140px]">
              <CalendarIcon className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="flex-1">
                <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">DATES</div>
                <div className="font-bold text-white text-xs">{searchDates}</div>
              </div>
            </div>

            {/* Guests Field */}
            <div className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 flex items-center space-x-3 transition-colors w-full sm:w-auto min-w-[110px]">
              <Users className="w-4 h-4 text-blue-400 shrink-0" />
              <div className="flex-1">
                <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">GUESTS</div>
                <div className="font-bold text-white text-xs flex items-center justify-between">
                  <span>{searchGuests}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400 ml-1" />
                </div>
              </div>
            </div>

            {/* Search Submit Button */}
            <button
              type="submit"
              className="w-11 h-11 rounded-xl bg-white hover:bg-slate-100 text-slate-900 flex items-center justify-center font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 shrink-0"
              aria-label="Search"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>
        </div>
      </div>

      {/* 3. Bottom Row: Left Feature Card + Right Statistics HUD & Video Control */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pt-2">
        {/* Bottom Left: Making Travel Simple & Joyful Card */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-2xl border border-white/40 flex items-center space-x-4 max-w-[320px] text-slate-900">
          <div className="space-y-2 flex-1">
            <h3 className="font-bold text-sm sm:text-base leading-snug text-slate-900">
              Making Travel Simple & Joyful
            </h3>
            <button
              onClick={onLearnMore}
              className="text-xs font-bold text-slate-700 hover:text-black flex items-center space-x-1 pt-0.5"
            >
              <span>Plan New Trip →</span>
            </button>
          </div>
          <div className="w-16 h-20 sm:w-20 sm:h-22 rounded-2xl overflow-hidden shrink-0 shadow-md">
            <img
              src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=300&auto=format&fit=crop&q=80"
              alt="Traveler with backpack"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Bottom Right: Statistics HUD & Video Control */}
        <div className="flex items-center space-x-8 sm:space-x-10 text-white">
          <div>
            <div className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white drop-shadow-md">
              34K
            </div>
            <div className="text-xs font-semibold text-slate-300 mt-0.5">Total Customers</div>
          </div>
          <div>
            <div className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white drop-shadow-md">
              12+
            </div>
            <div className="text-xs font-semibold text-slate-300 mt-0.5">Years Experience</div>
          </div>
          <div>
            <div className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white drop-shadow-md">
              15K
            </div>
            <div className="text-xs font-semibold text-slate-300 mt-0.5">Destinations</div>
          </div>

          {/* Circular Video Pause/Play Control */}
          <button
            onClick={onToggleVideo}
            id="videoToggleBtn"
            className="w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/25 text-white flex items-center justify-center transition-transform hover:scale-105 shadow-lg shrink-0"
            title="Toggle Background Video"
            aria-label="Toggle Background Video"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-white" />
            ) : (
              <Play className="w-4 h-4 text-white fill-white ml-0.5" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
