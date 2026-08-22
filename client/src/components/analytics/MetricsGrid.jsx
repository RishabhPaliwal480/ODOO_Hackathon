import { BarChart3, DollarSign, Globe, MapPin, Users } from 'lucide-react';
import { StatCard } from '../ui';
import { money } from '../../utils/formatters';

export function MetricsGrid({ analytics, userTrips = [] }) {
  const userSpend = userTrips.reduce((sum, t) => sum + (Number(t.current_spent) || 0), 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Platform Trips"
        value={analytics?.totalTrips || userTrips.length || 0}
        icon={Globe}
        subtext="Total itineraries created"
      />

      <StatCard
        label="My Total Spend"
        value={money(userSpend)}
        icon={DollarSign}
        trend="Live Account"
        subtext="Across active trips"
      />

      <StatCard
        label="Community Explorers"
        value={analytics?.totalUsers || 1}
        icon={Users}
        subtext="Registered travelers"
      />

      <StatCard
        label="Average Trip Budget"
        value={money(analytics?.avgBudget || 1900)}
        icon={BarChart3}
        subtext="Platform benchmark"
      />
    </div>
  );
}
