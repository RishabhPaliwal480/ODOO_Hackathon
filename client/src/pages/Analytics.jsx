import { useEffect, useState } from 'react';
import { analyticsApi } from '../services';
import { money } from '../utils/formatters';

export function Analytics({ userTrips = [] }) {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    analyticsApi
      .global()
      .then((res) => setAnalytics(res.data))
      .catch(() => {});
  }, []);

  const totalTrips = analytics?.totalTrips || userTrips.length || 6;
  const totalUsers = analytics?.totalUsers || 12;
  const avgBudget = analytics?.avgBudget || 1850;

  const categories = [
    { label: 'Lodging & Stays', percentage: 40, color: '#ffffff', amount: 950 },
    { label: 'Activities & Tours', percentage: 25, color: '#047857', amount: 620 },
    { label: 'Food & Dining', percentage: 20, color: '#d97706', amount: 480 },
    { label: 'Transit & Rail', percentage: 15, color: '#2563eb', amount: 350 },
  ];

  return (
    <div id="view-analytics" className="app-view space-y-6">
      <div className="border-b border-white/15 pb-4">
        <div className="text-xs font-bold uppercase tracking-widest text-emerald-400">Screen 12 • Dashboard</div>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-0.5">Travel Insights Dashboard</h2>
      </div>

      {/* Top Stat Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card-dark rounded-2xl p-5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Expeditions</span>
          <div className="font-display text-4xl font-bold text-white">{totalTrips}</div>
        </div>
        <div className="glass-card-dark rounded-2xl p-5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Registered Travelers</span>
          <div className="font-display text-4xl font-bold text-white">{totalUsers}k</div>
        </div>
        <div className="glass-card-dark rounded-2xl p-5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Average Itinerary Budget</span>
          <div className="font-display text-4xl font-bold text-emerald-400">{money(avgBudget)}</div>
        </div>
      </div>

      {/* 2 Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Expense Breakdown */}
        <div className="glass-card-dark rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-sm text-white">Expense Breakdown</h3>
          
          <div className="h-4 rounded-full overflow-hidden bg-white/10 flex">
            {categories.map((c) => (
              <div key={c.label} style={{ width: `${c.percentage}%`, backgroundColor: c.color }} />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {categories.map((c) => (
              <div key={c.label} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="text-xs font-bold text-white">{c.label}</span>
                </div>
                <div className="text-xs text-slate-300 font-semibold">{c.percentage}% ({money(c.amount)})</div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trend Spend */}
        <div className="glass-card-dark rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-sm text-white">Monthly Spend Trend ($ USD)</h3>
          
          <div className="space-y-3 pt-2">
            {[
              { month: 'Jan - Mar (Winter)', amount: 1450, width: '65%' },
              { month: 'Apr - Jun (Spring)', amount: 2100, width: '90%' },
              { month: 'Jul - Sep (Summer)', amount: 1890, width: '80%' },
              { month: 'Oct - Dec (Autumn)', amount: 1200, width: '50%' },
            ].map((item) => (
              <div key={item.month} className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300 font-semibold">
                  <span>{item.month}</span>
                  <span className="text-emerald-400 font-bold">{money(item.amount)}</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: item.width }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
