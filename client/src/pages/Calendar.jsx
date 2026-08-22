export function Calendar({ trips = [] }) {
  return (
    <div id="view-calendarView" className="app-view space-y-6">
      <div className="border-b border-white/15 pb-4">
        <div className="text-xs font-bold uppercase tracking-widest text-emerald-400">Screen 11 • Calendar</div>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-0.5">Trip Calendar: September 2026</h2>
      </div>

      <div className="glass-card-dark rounded-2xl p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-bold">
          <div className="p-4 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl space-y-1">
            <span className="text-[10px] text-emerald-400 block uppercase">Sep 15, 2026</span>
            <div className="text-sm font-bold text-white">Paris Arrival & Summit 🗼</div>
            <p className="text-[11px] font-normal text-slate-300">Hotel Check-in at 7th Arrondissement + Eiffel Access</p>
          </div>

          <div className="p-4 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl space-y-1">
            <span className="text-[10px] text-emerald-400 block uppercase">Sep 16, 2026</span>
            <div className="text-sm font-bold text-white">Louvre Masterpieces 🖼️</div>
            <p className="text-[11px] font-normal text-slate-300">Private guided walk & Tuileries Garden afternoon</p>
          </div>

          <div className="p-4 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl space-y-1">
            <span className="text-[10px] text-emerald-400 block uppercase">Sep 17, 2026</span>
            <div className="text-sm font-bold text-white">Montmartre & Seine Cruise 🥐</div>
            <p className="text-[11px] font-normal text-slate-300">Sacré-Cœur sunset & Seine dinner cruise</p>
          </div>
        </div>
      </div>
    </div>
  );
}
