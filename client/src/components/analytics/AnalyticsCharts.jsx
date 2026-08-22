import { Card } from '../ui';
import { money } from '../../utils/formatters';

export function AnalyticsCharts({ analytics, userTrips = [] }) {
  // Top destinations from analytics
  const topDestinations = analytics?.topDestinations || [
    { name: 'Paris', country: 'France', visit_count: 5 },
    { name: 'Tokyo', country: 'Japan', visit_count: 4 },
    { name: 'Rome', country: 'Italy', visit_count: 3 },
    { name: 'Bali', country: 'Indonesia', visit_count: 2 },
  ];

  const maxVisits = Math.max(...topDestinations.map((d) => d.visit_count || 1), 1);

  // Compute category spend breakdown from user's active trips
  let lodgingTotal = 0;
  let transportTotal = 0;
  let activityTotal = 0;

  userTrips.forEach((t) => {
    (t.stops || []).forEach((s) => {
      lodgingTotal += Number(s.lodging_cost) || 0;
      transportTotal += Number(s.transport_cost) || 0;
      (s.activities || []).forEach((a) => {
        activityTotal += Number(a.cost) || 0;
      });
    });
  });

  const totalCalculatedSpend = lodgingTotal + transportTotal + activityTotal;
  const categories = [
    { label: 'Lodging & Stays', amount: lodgingTotal || 600, color: '#111827', percentage: totalCalculatedSpend ? Math.round((lodgingTotal / totalCalculatedSpend) * 100) : 45 },
    { label: 'Transit & Transfers', amount: transportTotal || 350, color: '#047857', percentage: totalCalculatedSpend ? Math.round((transportTotal / totalCalculatedSpend) * 100) : 25 },
    { label: 'Activities & Tours', amount: activityTotal || 250, color: '#d97706', percentage: totalCalculatedSpend ? Math.round((activityTotal / totalCalculatedSpend) * 100) : 20 },
    { label: 'Dining & Experiences', amount: Math.round(totalCalculatedSpend * 0.1) || 120, color: '#2563eb', percentage: 10 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Expense Breakdown */}
      <Card className="p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800">
              Spend Distribution
            </span>
            <h3 className="font-bold text-base text-slate-900 mt-0.5">
              Trip Budget Allocations
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-500">
            Total: {money(totalCalculatedSpend || 1320)}
          </span>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className="h-4 rounded-full overflow-hidden bg-stone-100 flex">
          {categories.map((cat) => (
            <div
              key={cat.label}
              style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
              title={`${cat.label}: ${cat.percentage}%`}
            />
          ))}
        </div>

        {/* Categories Legend List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {categories.map((cat) => (
            <div
              key={cat.label}
              className="p-3 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between"
            >
              <div className="flex items-center space-x-2.5">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-xs font-bold text-slate-800">{cat.label}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-extrabold text-slate-900 block">{money(cat.amount)}</span>
                <span className="text-[10px] text-slate-400 font-semibold">{cat.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 2. Most Visited Destinations */}
      <Card className="p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800">
              Popularity Index
            </span>
            <h3 className="font-bold text-base text-slate-900 mt-0.5">
              Top Visited Destinations
            </h3>
          </div>
        </div>

        <div className="space-y-4">
          {topDestinations.map((dest, idx) => {
            const barWidth = Math.round(((dest.visit_count || 1) / maxVisits) * 100);
            return (
              <div key={dest.name || idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded bg-stone-100 text-stone-700 flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <span>{dest.name}, {dest.country}</span>
                  </div>
                  <span className="text-emerald-800 font-extrabold">{dest.visit_count} {dest.visit_count === 1 ? 'Trip' : 'Trips'}</span>
                </div>
                <div className="h-2.5 rounded-full bg-stone-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#18181b] transition-all duration-500"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
