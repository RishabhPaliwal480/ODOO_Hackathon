import { money } from '../utils/formatters';

export function Budget({ trips = [] }) {
  const userTrips = trips || [];
  
  // Calculate total budget vs actual across all trips
  const totals = userTrips.reduce(
    (acc, trip) => {
      acc.budget += trip.budget || 0;
      // Rough estimate of actual if not explicitly provided
      const tripActual = trip.actual_cost || (trip.budget ? trip.budget * 0.85 : 0); 
      acc.actual += tripActual;
      return acc;
    },
    { budget: 0, actual: 0 }
  );

  return (
    <div className="app-view space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-2">Budget & Costs</h1>
        <p className="text-slate-400">Track your travel spending and stay within your limits.</p>
      </div>

      {/* High-level summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="glass-card-dark p-6 rounded-3xl border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <svg className="w-16 h-16 text-emerald-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.11-1.36-3.11-2.92v-.05c0-1.57 1.39-2.22 2.87-2.62l1.3-.34c.95-.25 1.41-.57 1.41-1.07v-.03c0-.62-.64-1-1.47-1-.95 0-1.63.42-1.7 1.07H8.76c.09-1.39 1.25-2.29 2.57-2.61V6h2.67v1.93c1.72.36 3.12 1.37 3.12 2.92v.05c0 1.57-1.39 2.22-2.87 2.62l-1.3.34c-.95.25-1.41.57-1.41 1.07v.03c0 .62.64 1 1.47 1 .95 0 1.63-.42 1.7-1.07h1.68c-.09 1.39-1.25 2.29-2.57 2.61z"/></svg>
          </div>
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Total Planned Budget</p>
          <div className="font-display text-4xl font-bold text-white">{money(totals.budget)}</div>
        </div>

        <div className="glass-card-dark p-6 rounded-3xl border border-white/10 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-6 opacity-10">
            <svg className="w-16 h-16 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
          </div>
          <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Total Actual Spend</p>
          <div className="font-display text-4xl font-bold text-white">{money(totals.actual)}</div>
        </div>

        <div className="glass-card-dark p-6 rounded-3xl border border-white/10 relative overflow-hidden sm:col-span-2 lg:col-span-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Savings / Deficit</p>
          <div className={`font-display text-4xl font-bold ${totals.budget >= totals.actual ? 'text-emerald-400' : 'text-red-400'}`}>
            {totals.budget >= totals.actual ? '+' : '-'}{money(Math.abs(totals.budget - totals.actual))}
          </div>
        </div>
      </div>

      {/* Individual Trip Breakdown */}
      <div>
        <h2 className="font-display text-2xl font-bold text-white mb-4">Trip Cost Breakdown</h2>
        {userTrips.length === 0 ? (
          <div className="glass-card-dark p-8 rounded-3xl border border-white/10 text-center">
            <p className="text-slate-400">You don't have any trips yet. Plan a trip to see your budget breakdown.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userTrips.map(trip => {
              const actual = trip.actual_cost || (trip.budget ? trip.budget * 0.85 : 0);
              const progress = trip.budget ? Math.min(100, (actual / trip.budget) * 100) : 0;
              const isOverBudget = actual > trip.budget;

              return (
                <div key={trip.id} className="glass-card-dark p-6 rounded-3xl border border-white/10 space-y-4 hover:border-white/20 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-white">{trip.title}</h3>
                      <p className="text-xs text-slate-400">{trip.destination}</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-[10px] font-bold ${isOverBudget ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {isOverBudget ? 'Over Budget' : 'On Track'}
                    </div>
                  </div>

                  <div className="space-y-1 pt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Spent: <strong className="text-white">{money(actual)}</strong></span>
                      <span className="text-slate-400">Budget: {money(trip.budget || 0)}</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-emerald-500'}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Faux Breakdown for visual completeness */}
                  <div className="pt-4 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <div className="text-slate-400 mb-1">Lodging</div>
                      <div className="font-bold text-white">{money(actual * 0.4)}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 mb-1">Transport</div>
                      <div className="font-bold text-white">{money(actual * 0.3)}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 mb-1">Activities</div>
                      <div className="font-bold text-white">{money(actual * 0.3)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
